import { NextRequest, NextResponse } from 'next/server';

interface SearchPlaceResponse {
  data: { name: string; lat: number; lng: number; district?: string; city?: string; province?: string }[] | null;
  error: string | null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('q')?.trim();

    if (!keyword) {
      return NextResponse.json<SearchPlaceResponse>(
        { data: null, error: '缺少搜索关键词' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GAODE_WEB_API_KEY || process.env.NEXT_PUBLIC_GAODE_KEY;

    if (!apiKey) {
      return NextResponse.json<SearchPlaceResponse>(
        { data: null, error: '未配置高德 Web API Key' },
        { status: 503 }
      );
    }

    const url = new URL('https://restapi.amap.com/v3/place/text');
    url.searchParams.set('key', apiKey);
    url.searchParams.set('keywords', keyword);
    url.searchParams.set('offset', '5');
    url.searchParams.set('page', '1');
    url.searchParams.set('extensions', 'base');

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== '1' || !Array.isArray(data.pois)) {
      console.error('Gaode place search failed:', data);
      return NextResponse.json<SearchPlaceResponse>(
        { data: null, error: '地点搜索服务暂时不可用' },
        { status: 502 }
      );
    }

    const results = data.pois.map((poi: any) => ({
      name: poi.name || '',
      district: poi.adname,
      city: poi.cityname,
      province: poi.pname,
      lat: Number(poi.location?.split(',')[1] || 0),
      lng: Number(poi.location?.split(',')[0] || 0),
    }));

    return NextResponse.json<SearchPlaceResponse>({ data: results, error: null });
  } catch (error) {
    console.error('Search place error:', error);
    return NextResponse.json<SearchPlaceResponse>(
      { data: null, error: '搜索失败' },
      { status: 500 }
    );
  }
}
