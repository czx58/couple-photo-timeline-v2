import { NextRequest, NextResponse } from 'next/server';

interface TripItem {
  name: string;
  city?: string;
  province?: string;
  lat?: number;
  lng?: number;
}

interface GenerateTripResponse {
  data: { result: string; route: string } | null;
  error: string | null;
}

function validateItems(items: unknown): items is TripItem[] {
  return (
    Array.isArray(items) &&
    items.length > 0 &&
    items.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as TripItem).name === 'string' &&
        (item as TripItem).name.trim().length > 0
    )
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!validateItems(body.items)) {
      return NextResponse.json<GenerateTripResponse>(
        { data: null, error: '请至少选择一个有效地点' },
        { status: 400 }
      );
    }

    const names = body.items.map((i: TripItem) => i.name).join(' → ');
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return NextResponse.json<GenerateTripResponse>(
        { data: null, error: '未配置 DeepSeek API Key' },
        { status: 503 }
      );
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content:
              '你是一位专业的旅行规划师。用户已经手动选择了他们想去的地点，你的任务是把他们创造的路线翻译成一份真实可执行的旅行计划。用中文回答，使用 Markdown 格式。包含：路线总览、每日行程安排、各地点之间的交通方式、每个地点建议停留时长、天气与穿衣建议、实用注意事项。不要否定用户的选择，只在现实约束（如交通 impossible、时间过紧）时给出提醒。',
          },
          {
            role: 'user',
            content: `我选了这些地方，请帮我生成一份可执行的旅行计划：${names}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error('DeepSeek API error:', response.status, await response.text());
      return NextResponse.json<GenerateTripResponse>(
        { data: null, error: 'AI 服务暂时不可用，请稍后重试' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || '';

    return NextResponse.json<GenerateTripResponse>(
      { data: { result, route: names }, error: null },
      { status: 200 }
    );
  } catch (error) {
    console.error('Generate trip error:', error);
    return NextResponse.json<GenerateTripResponse>(
      { data: null, error: '生成旅行计划失败' },
      { status: 500 }
    );
  }
}
