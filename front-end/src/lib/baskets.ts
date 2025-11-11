import { apiRequest } from "@/lib/api";
import { BasketDetail, BasketPayload, BasketSummary } from "@/types/basket";

export const fetchBaskets = async (params?: { category?: string; search?: string }) => {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.search) query.set("search", params.search);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return apiRequest<BasketSummary[]>(`/baskets${suffix}`);
};

export const fetchBasketBySlug = async (slug: string) =>
  apiRequest<BasketDetail>(`/baskets/${slug}`);

export const createBasket = async (payload: BasketPayload, token: string) =>
  apiRequest<BasketDetail>("/admin/baskets", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);

export const updateBasket = async (id: string, payload: BasketPayload, token: string) =>
  apiRequest<BasketDetail>(`/admin/baskets/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  }, token);

export const deleteBasket = async (id: string, token: string) =>
  apiRequest<void>(`/admin/baskets/${id}`, {
    method: "DELETE",
    skipJson: true,
  }, token);
