import { describe, it, expect, vi } from 'vitest';
import { POST } from './route';

const createRequest = (body: unknown) =>
  new Request('http://localhost/api/generate-trip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('POST /api/generate-trip', () => {
  it('returns 400 when items is empty', async () => {
    const req = createRequest({ items: [] });
    const res = await POST(req as any);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeTruthy();
    expect(json.data).toBeNull();
  });

  it('returns 400 when items is not an array', async () => {
    const req = createRequest({ items: 'not-array' });
    const res = await POST(req as any);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeTruthy();
  });

  it('returns 400 when item name is missing', async () => {
    const req = createRequest({ items: [{ city: '北京' }] });
    const res = await POST(req as any);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeTruthy();
  });

  it('returns 503 when DeepSeek API key is missing', async () => {
    vi.stubEnv('DEEPSEEK_API_KEY', '');

    const req = createRequest({ items: [{ name: '故宫' }] });
    const res = await POST(req as any);
    const json = await res.json();

    expect(res.status).toBe(503);
    expect(json.error).toContain('DeepSeek API Key');

    vi.unstubAllEnvs();
  });
});
