import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBaskets, fetchBasketBySlug, createBasket, updateBasket, deleteBasket } from "@/lib/baskets";
import { BasketDetail, BasketPayload, BasketSummary } from "@/types/basket";
import { useAuth } from "@/lib/auth";

export const useBaskets = () =>
  useQuery<BasketSummary[]>({
    queryKey: ["baskets"],
    queryFn: () => fetchBaskets(),
  });

export const useBasketDetail = (slug?: string) =>
  useQuery<BasketDetail>({
    queryKey: ["baskets", slug],
    queryFn: () => fetchBasketBySlug(slug as string),
    enabled: Boolean(slug),
  });

export const useBasketMutations = () => {
  const { token } = useAuth();
  const client = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: BasketPayload) => {
      if (!token) throw new Error("Necesită autentificare");
      return createBasket(payload, token);
    },
    onSuccess: (data) => {
      client.invalidateQueries({ queryKey: ["baskets"] });
      client.invalidateQueries({ queryKey: ["baskets", data.slug] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BasketPayload }) => {
      if (!token) throw new Error("Necesită autentificare");
      return updateBasket(id, payload, token);
    },
    onSuccess: (data) => {
      client.invalidateQueries({ queryKey: ["baskets"] });
      client.invalidateQueries({ queryKey: ["baskets", data.slug] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error("Necesită autentificare");
      return deleteBasket(id, token);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["baskets"] });
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
