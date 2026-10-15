import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, TrendingUp, Loader2 } from 'lucide-react';
import { getPracticeRecords, type PracticeRecord } from '@/services/ieltsApi';

export default function IeltsHistory() {
  const [records, setRecords] = useState<PracticeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await getPracticeRecords();
      setRecords(data);
      if (data.length > 0) {
        setExpandedId(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取记录失败');
    } finally {
      setLoading(false);
    }
  };

  const averageScore =
    records.length > 0
      ? (records.reduce((sum, r) => sum + Number(r.overallScore), 0) / records.length).toFixed(1)
      : '0';

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <a
            href="/ielts"
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </a>
          <h1 className="text-lg font-bold text-gray-900">练习记录</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Stats Card */}
        <section className="bg-white rounded-2xl shadow-sm border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">已完成练习</p>
              <p className="text-3xl font-bold text-gray-900">{records.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">平均总分</p>
              <div className="flex items-center gap-1 justify-end">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <p className="text-3xl font-bold text-indigo-600">{averageScore}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Records List */}
        <section className="space-y-4">
          <h2 className="font-medium text-gray-900">历史练习</h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
              <span className="ml-2 text-sm text-gray-500">加载中...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl p-4">{error}</div>
          ) : records.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
              <p className="text-gray-500 mb-4">还没有练习记录</p>
              <a
                href="/ielts"
                className="inline-block bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                去练习
              </a>
            </div>
          ) : (
            records.map((record) => (
              <article
                key={record.id}
                className="bg-white rounded-2xl shadow-sm border overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {record.questionTopic || '未知题目'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(record.createdAt).toLocaleString('zh-CN')}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold text-indigo-600">{record.overallScore}</p>
                      <p className="text-xs text-gray-400">总分</p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-3 text-xs">
                    <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">
                      FC {record.fluencyCoherence}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">
                      LR {record.lexicalResource}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">
                      GRA {record.grammaticalRangeAccuracy}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">
                      P {record.pronunciation}
                    </span>
                  </div>
                </button>

                {expandedId === record.id && (
                  <div className="border-t px-4 py-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">你的回答</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 leading-relaxed">
                        {record.transcript}
                      </p>
                    </div>

                    {record.feedbackJson.strengths.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-green-800 mb-2">优点</h4>
                        <ul className="space-y-1.5">
                          {record.feedbackJson.strengths.map((item, index) => (
                            <li
                              key={index}
                              className="text-sm text-green-700 flex items-start gap-2"
                            >
                              <span className="mt-1.5 w-1 h-1 bg-green-500 rounded-full flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {record.feedbackJson.weaknesses.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-orange-800 mb-2">待改进</h4>
                        <ul className="space-y-1.5">
                          {record.feedbackJson.weaknesses.map((item, index) => (
                            <li
                              key={index}
                              className="text-sm text-orange-700 flex items-start gap-2"
                            >
                              <span className="mt-1.5 w-1 h-1 bg-orange-500 rounded-full flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {record.feedbackJson.grammarErrors.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">语法纠错</h4>
                        <div className="space-y-2">
                          {record.feedbackJson.grammarErrors.map((item, index) => (
                            <div key={index} className="bg-red-50 rounded-xl p-3">
                              <p className="text-sm text-red-700 line-through">{item.original}</p>
                              <p className="text-sm text-green-700 font-medium mt-1">
                                {item.correction}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{item.explanation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {record.feedbackJson.improvedAnswer && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">参考优化版本</h4>
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 leading-relaxed whitespace-pre-wrap">
                          {record.feedbackJson.improvedAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
