export type BasketSummary = {
  id: string;
  slug: string;
  title: string;
  category: string;
  prompt: string;
  tags: string[];
  price: number;
  stock: number;
  heroImage?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BasketDetail = BasketSummary & {
  descriptionHtml: string;
};

export type BasketPayload = {
  title: string;
  slug?: string;
  category: string;
  prompt: string;
  tags: string[];
  price: number;
  stock: number;
  description: string;
  heroImage?: string;
};
