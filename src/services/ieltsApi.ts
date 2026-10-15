const API_BASE_URL = '/api';

export interface IeltsQuestion {
  id: number;
  topic: string;
  question: string;
  bulletPoints: string[];
  category: string;
  createdAt: string;
}

export interface EvaluateRequest {
  questionId?: number;
  question: string;
  bulletPoints: string[];
  transcript: string;
  userId?: number;
}

export interface GrammarError {
  original: string;
  correction: string;
  explanation: string;
}

export interface VocabularySuggestion {
  original: string;
  suggestion: string;
  reason: string;
}

export interface IeltsScores {
  fluencyCoherence: number;
  lexicalResource: number;
  grammaticalRangeAccuracy: number;
  pronunciation: number;
}

export interface AdvancedWord {
  word: string;
  cefr: string;
  meaning: string;
}

export interface RepeatedWord {
  word: string;
  count: number;
  suggestions: string[];
}

export interface CollocationIssue {
  original: string;
  suggestion: string;
  explanation: string;
}

export interface VocabularyAnalysis {
  diversityScore: number;
  advancedWordCount: number;
  totalWordCount: number;
  comment: string;
  advancedWords: AdvancedWord[];
  repeatedWords: RepeatedWord[];
  collocationIssues: CollocationIssue[];
}

export interface IeltsEvaluationResponse {
  overallScore: number;
  scores: IeltsScores;
  feedback: {
    strengths: string[];
    weaknesses: string[];
    grammarErrors: GrammarError[];
    vocabularySuggestions: VocabularySuggestion[];
    improvedAnswer: string;
  };
  vocabularyAnalysis?: VocabularyAnalysis;
}

export interface PracticeRecord {
  id: number;
  questionId: number | null;
  questionTopic: string | null;
  questionText: string | null;
  transcript: string;
  overallScore: number;
  fluencyCoherence: number;
  lexicalResource: number;
  grammaticalRangeAccuracy: number;
  pronunciation: number;
  feedbackJson: IeltsEvaluationResponse['feedback'];
  createdAt: string;
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: '请求失败' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

function mapDbQuestionToQuestion(dbQuestion: Record<string, unknown>): IeltsQuestion {
  return {
    id: Number(dbQuestion.id),
    topic: String(dbQuestion.topic),
    question: String(dbQuestion.question),
    bulletPoints: Array.isArray(dbQuestion.bullet_points)
      ? dbQuestion.bullet_points.map(String)
      : [],
    category: String(dbQuestion.category),
    createdAt: String(dbQuestion.created_at || ''),
  };
}

function mapDbRecordToRecord(dbRecord: Record<string, unknown>): PracticeRecord {
  return {
    id: Number(dbRecord.id),
    questionId: dbRecord.question_id ? Number(dbRecord.question_id) : null,
    questionTopic: dbRecord.question_topic ? String(dbRecord.question_topic) : null,
    questionText: dbRecord.question_text ? String(dbRecord.question_text) : null,
    transcript: String(dbRecord.transcript),
    overallScore: Number(dbRecord.overall_score),
    fluencyCoherence: Number(dbRecord.fluency_coherence),
    lexicalResource: Number(dbRecord.lexical_resource),
    grammaticalRangeAccuracy: Number(dbRecord.grammatical_range_accuracy),
    pronunciation: Number(dbRecord.pronunciation),
    feedbackJson: (dbRecord.feedback_json as IeltsEvaluationResponse['feedback']) || {
      strengths: [],
      weaknesses: [],
      grammarErrors: [],
      vocabularySuggestions: [],
      improvedAnswer: '',
    },
    createdAt: String(dbRecord.created_at || ''),
  };
}

export async function getRandomQuestion(category?: string): Promise<IeltsQuestion> {
  const url = category
    ? `${API_BASE_URL}/ielts/questions/random?category=${encodeURIComponent(category)}`
    : `${API_BASE_URL}/ielts/questions/random`;
  const data = await fetchJson<Record<string, unknown>>(url);
  return mapDbQuestionToQuestion(data);
}

export async function getQuestions(category?: string): Promise<IeltsQuestion[]> {
  const url = category
    ? `${API_BASE_URL}/ielts/questions?category=${encodeURIComponent(category)}`
    : `${API_BASE_URL}/ielts/questions`;
  const data = await fetchJson<Record<string, unknown>[]>(url);
  return data.map(mapDbQuestionToQuestion);
}

export async function getPracticeRecords(userId?: number): Promise<PracticeRecord[]> {
  const url = userId
    ? `${API_BASE_URL}/ielts/records?userId=${userId}`
    : `${API_BASE_URL}/ielts/records`;
  const data = await fetchJson<Record<string, unknown>[]>(url);
  return data.map(mapDbRecordToRecord);
}

export async function evaluateSpeaking(
  data: EvaluateRequest
): Promise<IeltsEvaluationResponse> {
  const response = await fetch(`${API_BASE_URL}/ielts/evaluate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: '评分请求失败' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}
