import type { Shoe } from '../types/shoe';

const API_BASE_URL = '/api';

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
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

// 把数据库返回的数据转换成前端需要的 Shoe 格式
function mapDbShoeToShoe(dbShoe: Record<string, unknown>): Shoe {
  return {
    id: String(dbShoe.id),
    name: String(dbShoe.name),
    brand: String(dbShoe.brand),
    collab: dbShoe.collab ? String(dbShoe.collab) : undefined,
    colorway: String(dbShoe.colorway),
    nickname: dbShoe.nickname ? String(dbShoe.nickname) : undefined,
    price: Number(dbShoe.price),
    originalPrice: dbShoe.original_price ? Number(dbShoe.original_price) : undefined,
    rating: Number(dbShoe.rating),
    reviewCount: Number(dbShoe.review_count),
    releaseDate: String(dbShoe.release_date || ''),
    styleCode: String(dbShoe.style_code || ''),
    images: dbShoe.image_url
      ? [
          {
            id: 'main',
            url: String(dbShoe.image_url),
            alt: `${dbShoe.brand} ${dbShoe.name}`,
            angle: 'side' as const,
          },
        ]
      : [],
    description: String(dbShoe.description || ''),
    story: String(dbShoe.story || ''),
    specs: Array.isArray(dbShoe.specs) ? dbShoe.specs : [],
    tags: Array.isArray(dbShoe.tags) ? dbShoe.tags.map(String) : [],
  };
}

export const shoesApi = {
  // 获取所有鞋款
  getAll: async (): Promise<Shoe[]> => {
    const data = await fetchJson<Record<string, unknown>[]>(`${API_BASE_URL}/shoes`);
    return data.map(mapDbShoeToShoe);
  },

  // 获取单双鞋
  getById: async (id: string | number): Promise<Shoe> => {
    const data = await fetchJson<Record<string, unknown>>(`${API_BASE_URL}/shoes/${id}`);
    return mapDbShoeToShoe(data);
  },

  // 添加鞋款
  create: async (shoe: Omit<Shoe, 'id'>): Promise<Shoe> => {
    const data = await fetchJson<Record<string, unknown>>(`${API_BASE_URL}/shoes`, {
      method: 'POST',
      body: JSON.stringify({
        name: shoe.name,
        brand: shoe.brand,
        collab: shoe.collab,
        colorway: shoe.colorway,
        nickname: shoe.nickname,
        price: shoe.price,
        original_price: shoe.originalPrice,
        rating: shoe.rating,
        review_count: shoe.reviewCount,
        release_date: shoe.releaseDate,
        style_code: shoe.styleCode,
        image_url: shoe.images[0]?.url,
        description: shoe.description,
        story: shoe.story,
        specs: shoe.specs,
        tags: shoe.tags,
      }),
    });
    return mapDbShoeToShoe(data);
  },

  // 更新鞋款
  update: async (id: string | number, shoe: Omit<Shoe, 'id'>): Promise<Shoe> => {
    const data = await fetchJson<Record<string, unknown>>(`${API_BASE_URL}/shoes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: shoe.name,
        brand: shoe.brand,
        collab: shoe.collab,
        colorway: shoe.colorway,
        nickname: shoe.nickname,
        price: shoe.price,
        original_price: shoe.originalPrice,
        rating: shoe.rating,
        review_count: shoe.reviewCount,
        release_date: shoe.releaseDate,
        style_code: shoe.styleCode,
        image_url: shoe.images[0]?.url,
        description: shoe.description,
        story: shoe.story,
        specs: shoe.specs,
        tags: shoe.tags,
      }),
    });
    return mapDbShoeToShoe(data);
  },

  // 删除鞋款
  delete: async (id: string | number): Promise<void> => {
    await fetchJson(`${API_BASE_URL}/shoes/${id}`, {
      method: 'DELETE',
    });
  },
};
