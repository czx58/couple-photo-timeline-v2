import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Loader2, RotateCcw, ChevronRight, AlertCircle, History, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  evaluateSpeaking,
  getRandomQuestion,
  getPracticeRecords,
  type IeltsEvaluationResponse,
  type IeltsScores,
  type IeltsQuestion,
  type PracticeRecord,
  type VocabularyAnalysis,
} from '@/services/ieltsApi';
import { useAuth } from '@/contexts/AuthContext';

export type { IeltsEvaluationResponse };

// Web Speech API 类型声明
interface SpeechRecognitionResult {
  [index: number]: { transcript: string; confidence: number };
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: new () => SpeechRecognitionInstance;
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
}

function getSpeechRecognition(): (new () => SpeechRecognitionInstance) | undefined {
  const win = window as unknown as WindowWithSpeechRecognition;
  return win.SpeechRecognition || win.webkitSpeechRecognition;
}

const criteriaLabels: Record<keyof IeltsScores, string> = {
  fluencyCoherence: '流利度与连贯性',
  lexicalResource: '词汇资源',
  grammaticalRangeAccuracy: '语法多样性与准确性',
  pronunciation: '发音',
};

function getHighlightPhrases(vocab?: VocabularyAnalysis, feedback?: IeltsEvaluationResponse['feedback']) {
  const phrases: string[] = [];

  feedback?.grammarErrors.forEach((e) => {
    if (e.original?.trim()) phrases.push(e.original.trim());
  });
  feedback?.vocabularySuggestions.forEach((e) => {
    if (e.original?.trim()) phrases.push(e.original.trim());
  });
  vocab?.repeatedWords.forEach((e) => {
    if (e.word?.trim()) phrases.push(e.word.trim());
  });
  vocab?.collocationIssues.forEach((e) => {
    if (e.original?.trim()) phrases.push(e.original.trim());
  });

  // 去重并按长度降序，避免短词先被匹配导致长词无法完整匹配
  return Array.from(new Set(phrases)).sort((a, b) => b.length - a.length);
}

function renderHighlightedText(text: string, phrases: string[]) {
  if (!text || phrases.length === 0) {
    return <span className="text-gray-700 leading-relaxed">{text}</span>;
  }

  const escapedPhrases = phrases.map((p) =>
    p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  const pattern = new RegExp(`(${escapedPhrases.join('|')})`, 'gi');
  const parts = text.split(pattern);

  return (
    <span className="text-gray-700 leading-relaxed">
      {parts.map((part, index) => {
        const isMatch = phrases.some(
          (p) => p.toLowerCase() === part.toLowerCase()
        );
        if (isMatch) {
          return (
            <span
              key={index}
              className="text-red-600 bg-red-50 rounded px-0.5 font-medium"
            >
              {part}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}

const categories: { value: string; label: string }[] = [
  { value: '', label: '全部' },
  { value: 'person', label: '人物' },
  { value: 'place', label: '地点' },
  { value: 'event', label: '事件' },
  { value: 'object', label: '物品' },
];

export default function Ielts() {
  const { user, logout } = useAuth();
  const [question, setQuestion] = useState<IeltsQuestion | null>(null);
  const [questionLoading, setQuestionLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<IeltsEvaluationResponse | null>(null);
  const [browserSupportsSpeech, setBrowserSupportsSpeech] = useState(true);
  const [records, setRecords] = useState<PracticeRecord[]>([]);
  const [showRecords, setShowRecords] = useState(false);
  const [prepTimeLeft, setPrepTimeLeft] = useState(60);
  const [isPreparing, setIsPreparing] = useState(false);
  const prepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const loadRandomQuestion = async (category?: string) => {
    try {
      setQuestionLoading(true);
      const q = await getRandomQuestion(category);
      setQuestion(q);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取题目失败');
    } finally {
      setQuestionLoading(false);
    }
  };

  const loadRecords = useCallback(async () => {
    try {
      const data = await getPracticeRecords(user?.id);
      setRecords(data);
    } catch (err) {
      console.error('获取练习记录失败:', err);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!getSpeechRecognition()) {
      setBrowserSupportsSpeech(false);
    }
    loadRandomQuestion();
    loadRecords();

    return () => {
      if (prepTimerRef.current) {
        clearInterval(prepTimerRef.current);
      }
    };
  }, [loadRecords]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    loadRandomQuestion(category);
    setTranscript('');
    setFeedback(null);
    setError(null);
  };

  const startPrep = () => {
    setIsPreparing(true);
    setPrepTimeLeft(60);

    prepTimerRef.current = setInterval(() => {
      setPrepTimeLeft((prev) => {
        if (prev <= 1) {
          if (prepTimerRef.current) {
            clearInterval(prepTimerRef.current);
          }
          setIsPreparing(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const skipPrep = () => {
    if (prepTimerRef.current) {
      clearInterval(prepTimerRef.current);
    }
    setIsPreparing(false);
    setPrepTimeLeft(0);
  };

  const startRecording = () => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setError('你的浏览器不支持语音识别，请使用 Chrome 或 Edge');
      return;
    }

    setError(null);
    setFeedback(null);
    setTranscript('');

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart + ' ';
        }
      }
      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('语音识别错误:', event.error);
      if (event.error !== 'no-speech') {
        setError(`语音识别出错: ${event.error}，请重试`);
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleGetFeedback = async () => {
    if (!transcript.trim()) {
      setError('请先录音或输入你的回答');
      return;
    }

    if (!question) {
      setError('题目加载中，请稍后再试');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await evaluateSpeaking({
        questionId: question.id,
        question: question.question,
        bulletPoints: question.bulletPoints,
        transcript: transcript.trim(),
        userId: user?.id,
      });
      setFeedback(result);
      loadRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : '评分失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    loadRandomQuestion(selectedCategory);
    setTranscript('');
    setFeedback(null);
    setError(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranscript(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-gray-900">
            雅思口语 Part 2 陪练
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-red-600"
                  title="退出登录"
                >
                  退出
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-indigo-600"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  注册
                </Link>
              </>
            )}
            <Link
              to="/ielts/history"
              className="text-sm text-gray-600 hover:text-indigo-600 flex items-center gap-1"
            >
              <History className="w-4 h-4" />
              记录
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Category Filter */}
        <section className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </section>
        {/* Question Card */}
        <section className="bg-white rounded-2xl shadow-sm border p-5">
          {questionLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
              <span className="ml-2 text-sm text-gray-500">加载题目中...</span>
            </div>
          ) : question ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-600 rounded">
                  {question.category === 'person' && '人物'}
                  {question.category === 'place' && '地点'}
                  {question.category === 'event' && '事件'}
                  {question.category === 'object' && '物品'}
                </span>
                <span className="text-xs text-gray-400">Part 2</span>
              </div>

              <h2 className="text-lg font-semibold text-gray-900 mb-4">{question.question}</h2>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">You should say:</p>
                <ul className="space-y-2">
                  {question.bulletPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-sm text-red-600">
              题目加载失败，请刷新页面重试
            </div>
          )}
        </section>

        {/* Recording Controls */}
        <section className="bg-white rounded-2xl shadow-sm border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">你的回答</h3>
            {isRecording && (
              <span className="flex items-center gap-1.5 text-xs text-red-500">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                录音中...
              </span>
            )}
          </div>

          {!browserSupportsSpeech && (
            <div className="mb-4 p-3 bg-amber-50 text-amber-700 text-sm rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              你的浏览器不支持语音识别，请直接在下方文本框输入回答。
            </div>
          )}

          {/* Preparation Timer */}
          {!isRecording && !transcript && (
            <div className="mb-4">
              {isPreparing ? (
                <div className="bg-indigo-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-indigo-700 mb-2">准备时间</p>
                  <p className="text-3xl font-bold text-indigo-600 mb-3">
                    {Math.floor(prepTimeLeft / 60)}:{String(prepTimeLeft % 60).padStart(2, '0')}
                  </p>
                  <button
                    onClick={skipPrep}
                    className="text-xs px-3 py-1.5 bg-white text-indigo-600 rounded-full border border-indigo-200 hover:bg-indigo-100"
                  >
                    跳过准备，直接回答
                  </button>
                </div>
              ) : (
                <button
                  onClick={startPrep}
                  disabled={questionLoading || !question}
                  className="w-full py-2.5 bg-white border border-indigo-200 text-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  开始 60 秒准备（模拟真实考试）
                </button>
              )}
            </div>
          )}

          <div className="flex justify-center mb-4">
            {isRecording ? (
              <button
                onClick={stopRecording}
                className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
              >
                <MicOff className="w-7 h-7" />
              </button>
            ) : (
              <button
                onClick={startRecording}
                disabled={!browserSupportsSpeech}
                className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mic className="w-7 h-7" />
              </button>
            )}
          </div>

          <p className="text-center text-xs text-gray-500 mb-4">
            {isRecording ? '点击按钮结束录音' : '点击麦克风开口回答，或直接在下方输入文字'}
          </p>

          <textarea
            value={transcript}
            onChange={handleTextChange}
            placeholder="你的回答会显示在这里，也可以直接输入或修改..."
            className="w-full h-40 p-4 text-sm border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>
          )}

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleGetFeedback}
              disabled={isLoading || !transcript.trim()}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AI 评分中...
                </>
              ) : (
                '获取 AI 反馈'
              )}
            </button>
            <button
              onClick={handleNextQuestion}
              className="px-4 py-3 bg-white border text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" />
              换题
            </button>
          </div>
        </section>

        {/* Feedback Report */}
        {feedback && (
          <section className="bg-white rounded-2xl shadow-sm border p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">AI 评分报告</h3>
              <div className="text-right">
                <p className="text-xs text-gray-500">总分</p>
                <p className="text-2xl font-bold text-indigo-600">{feedback.overallScore}</p>
              </div>
            </div>

            {/* Scores */}
            <div className="space-y-3 mb-6">
              {(Object.keys(criteriaLabels) as Array<keyof IeltsScores>).map((key) => {
                const score = feedback.scores[key];
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700">{criteriaLabels[key]}</span>
                      <span className="font-medium text-gray-900">{score}/9</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${(score / 9) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Highlighted Transcript */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">你的回答（标红处为语法或词汇问题）</h4>
              <div className="bg-gray-50 rounded-xl p-4 text-sm">
                {renderHighlightedText(
                  transcript,
                  getHighlightPhrases(feedback.vocabularyAnalysis, feedback.feedback)
                )}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-green-800 mb-2">优点</h4>
                <ul className="space-y-1.5">
                  {feedback.feedback.strengths.map((item, index) => (
                    <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 bg-green-500 rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-orange-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-orange-800 mb-2">待改进</h4>
                <ul className="space-y-1.5">
                  {feedback.feedback.weaknesses.map((item, index) => (
                    <li key={index} className="text-sm text-orange-700 flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 bg-orange-500 rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Grammar Errors */}
            {feedback.feedback.grammarErrors.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">语法纠错</h4>
                <div className="space-y-3">
                  {feedback.feedback.grammarErrors.map((item, index) => (
                    <div key={index} className="bg-red-50 rounded-xl p-4">
                      <p className="text-sm text-red-700 line-through">{item.original}</p>
                      <p className="text-sm text-green-700 font-medium mt-1">{item.correction}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vocabulary Suggestions */}
            {feedback.feedback.vocabularySuggestions.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">词汇升级建议</h4>
                <div className="space-y-3">
                  {feedback.feedback.vocabularySuggestions.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 bg-blue-50 rounded-xl p-4">
                      <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm">
                          <span className="text-gray-500 line-through">{item.original}</span>
                          {' → '}
                          <span className="text-blue-700 font-medium">{item.suggestion}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{item.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vocabulary Analysis */}
            {feedback.vocabularyAnalysis && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900">词汇深度分析</h4>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-gray-500">
                      多样性 {feedback.vocabularyAnalysis.diversityScore}/9
                    </span>
                    <span className="text-gray-500">
                      高级词 {feedback.vocabularyAnalysis.advancedWordCount}/{feedback.vocabularyAnalysis.totalWordCount}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 bg-purple-50 rounded-xl p-4">
                  {feedback.vocabularyAnalysis.comment}
                </p>

                {feedback.vocabularyAnalysis.advancedWords.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-xs font-medium text-gray-500 mb-2">使用较好的词汇</h5>
                    <div className="flex flex-wrap gap-2">
                      {feedback.vocabularyAnalysis.advancedWords.map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-sm rounded-lg"
                        >
                          {item.word}
                          <span className="text-xs text-green-500">{item.cefr}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {feedback.vocabularyAnalysis.repeatedWords.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-xs font-medium text-gray-500 mb-2">重复过多的词</h5>
                    <div className="space-y-2">
                      {feedback.vocabularyAnalysis.repeatedWords.map((item, index) => (
                        <div key={index} className="bg-orange-50 rounded-xl p-3">
                          <p className="text-sm text-orange-700">
                            <span className="font-medium">{item.word}</span>
                            <span className="text-orange-500 ml-2">重复 {item.count} 次</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            可替换为：{item.suggestions.join('、')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {feedback.vocabularyAnalysis.collocationIssues.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-500 mb-2">搭配问题</h5>
                    <div className="space-y-2">
                      {feedback.vocabularyAnalysis.collocationIssues.map((item, index) => (
                        <div key={index} className="bg-red-50 rounded-xl p-3">
                          <p className="text-sm text-red-700 line-through">{item.original}</p>
                          <p className="text-sm text-green-700 font-medium mt-1">
                            {item.suggestion}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{item.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Improved Answer */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">参考优化版本</h4>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {feedback.feedback.improvedAnswer}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Practice Records */}
        {records.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm border p-5">
            <button
              onClick={() => setShowRecords(!showRecords)}
              className="w-full flex items-center justify-between mb-2"
            >
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-gray-500" />
                <h3 className="font-medium text-gray-900">练习记录</h3>
              </div>
              <span className="text-xs text-gray-500">{records.length} 条</span>
            </button>

            {showRecords && (
              <div className="space-y-3 mt-4">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="border rounded-xl p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate pr-2">
                        {record.questionTopic || '未知题目'}
                      </p>
                      <span className="text-sm font-bold text-indigo-600">
                        {record.overallScore}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">{record.transcript}</p>
                    <div className="flex gap-2 text-xs text-gray-400">
                      <span>FC {record.fluencyCoherence}</span>
                      <span>LR {record.lexicalResource}</span>
                      <span>GRA {record.grammaticalRangeAccuracy}</span>
                      <span>P {record.pronunciation}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(record.createdAt).toLocaleString('zh-CN')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
