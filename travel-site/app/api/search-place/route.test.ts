import { describe, it, expect, vi } from 'vitest';
import { GET } from './route';

const createRequest = (q: string) =>
  new Request(`http://localhost/api/search-place?q=${encodeURIComponent(q)}`, {
    method: 'GET',
  });

describe('GET /api/search-place', () => {
  it('returns 400 when query is missing', async () => {
    const req = new Request('http://localhost/api/search-place', { method: 'GET' });
    const res = await GET(req as any);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeTruthy();
  });

  it('returns 503 when API key is missing', async () => {
    vi.stubEnv('GAODE_WEB_API_KEY', '');
    vi.stubEnv('NEXT_PUBLIC_GAODE_KEY', '');

    const req = createRequest('故宫');
    const res = await GET(req as any);
    const json = await res.json();

    expect(res.status).toBe(503);
    expect(json.error).toContain('高德 Web API Key');

    vi.unstubAllEnvs();
  });

  it('returns search results from Gaode API', async () => {
    vi.stubEnv('GAODE_WEB_API_KEY', 'test-key');

    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        status: '1',
        pois: [
          {
            name: '故宫博物院',
            adname: '东城区',
            cityname: '北京市',
            pname: '北京市',
            location: '116.397026,39.918058',
          },
        ],
      }),
    } as any);

    const req = createRequest('故宫');
    const res = await GET(req as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toHaveLength(1);
    expect(json.data[0].name).toBe('故宫博物院');
    expect(json.data[0].lat).toBe(39.918058);
    expect(json.data[0].lng).toBe(116.397026);

    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });
});
