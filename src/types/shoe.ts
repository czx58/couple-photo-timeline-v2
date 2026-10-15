export interface ShoeImage {
  id: string;
  url: string;
  alt: string;
  angle: 'front' | 'side' | 'back' | 'sole' | 'detail' | 'top';
}

export interface ShoeSpec {
  label: string;
  value: string;
  icon: string;
}

export interface Shoe {
  id: string;
  name: string;
  brand: string;
  collab?: string;
  colorway: string;
  nickname?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  releaseDate: string;
  styleCode: string;
  images: ShoeImage[];
  description: string;
  story: string;
  specs: ShoeSpec[];
  tags: string[];
}
