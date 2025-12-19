import { BasketDetail, BasketSummary } from "@/types/basket";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { fetchOrderBuckets, persistOrderSnapshot, updateOrderStatusApi, type OrderDto } from "@/lib/orders";

export type CartItem = {
  id: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  stock: number;
  heroImage?: string | null;
};

export type ShippingMethod = "standard" | "express";

export type OrderStatus = "processing" | "shipped" | "delivered" | "canceled";

export type EmailLog = {
  id: string;
  to: string;
  subject: string;
  message: string;
  createdAt: string;
};

export type OrderRecord = {
  id: string;
  number: string;
  createdAt: string;
  status: OrderStatus;
  shippingMethod: ShippingMethod;
  note?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  totals: {
    subtotal: number;
    shipping: number;
    vat: number;
    total: number;
  };
  items: CartItem[];
  emailHistory: EmailLog[];
};

type CartContextValue = {
  items: CartItem[];
  orders: OrderRecord[];
  allOrders: OrderRecord[];
  itemCount: number;
  addItem: (product: BasketSummary | BasketDetail, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotals: (shippingMethod?: ShippingMethod) => {
    subtotal: number;
    shipping: number;
    vat: number;
    total: number;
  };
  placeOrder: (params?: {
    shippingMethod?: ShippingMethod;
    note?: string;
    customer?: OrderRecord["customer"];
  }) => Promise<OrderRecord>;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  recordEmail: (id: string, subject: string, message: string) => void;
  seedDemoOrders: (
    orders: OrderRecord[],
    options?: { includeCurrentUser?: boolean; replaceExisting?: boolean }
  ) => void;
};

const CART_KEY = "baskit.cart.v3";
const CartContext = createContext<CartContextValue | undefined>(undefined);

const shippingCost = (method: ShippingMethod) => (method === "express" ? 35 : 25);
const VAT_RATE = 0.19;

const safeId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `tmp-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
};

const computeTotals = (items: CartItem[], method: ShippingMethod) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = items.length === 0 ? 0 : shippingCost(method);
  const vat = (subtotal + shipping) * VAT_RATE;
  const total = subtotal + shipping + vat;
  return { subtotal, shipping, vat, total };
};

const normalizeOrder = (order: OrderRecord): OrderRecord => ({
  ...order,
  status: order.status ?? "processing",
  shippingMethod: order.shippingMethod ?? "standard",
  emailHistory: order.emailHistory ?? [],
  totals: order.totals ?? computeTotals(order.items ?? [], order.shippingMethod ?? "standard"),
  items: order.items ?? [],
});

const mapOrderDtoToRecord = (dto: OrderDto, fallbackItems?: CartItem[]): OrderRecord => {
  const items = (dto.items && dto.items.length ? dto.items : fallbackItems ?? []).map((item) => ({
    id: item.id,
    slug: item.slug ?? item.id,
    title: item.title,
    price: Number(item.price),
    quantity: item.quantity,
    stock: item.quantity,
    heroImage: item.heroImage ?? undefined,
  }));
  const totals = dto.totals ?? {};
  return normalizeOrder({
    id: dto.id,
    number: dto.number,
    createdAt: dto.createdAt,
    status: (dto.status as OrderStatus) ?? "processing",
    shippingMethod: (dto.shippingMethod as ShippingMethod) ?? "standard",
    note: dto.note ?? undefined,
    customer: dto.customer ?? undefined,
    totals: {
      subtotal: Number(totals.subtotal ?? 0),
      shipping: Number(totals.shipping ?? 0),
      vat: Number(totals.vat ?? 0),
      total: Number(totals.total ?? 0),
    },
    items,
    emailHistory: [],
  });
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const userKey = user?.id || user?.email || "guest";

  type CartBucket = { byUser: Record<string, CartItem[]>; lastUserId?: string };
  const readCartBucket = (): CartBucket => {
    if (typeof localStorage === "undefined") return { byUser: {} };
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return { byUser: {} };
    try {
      const parsed = JSON.parse(raw) as CartBucket;
      return parsed?.byUser ? parsed : { byUser: {} };
    } catch {
      return { byUser: {} };
    }
  };
  const writeCartBucket = (bucket: CartBucket) => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(CART_KEY, JSON.stringify(bucket));
  };

  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [allOrders, setAllOrders] = useState<OrderRecord[]>([]);

  const loadOrders = useCallback(async (targetUserKey: string) => {
    const bucket = await fetchOrderBuckets();
    const userOrders = (bucket[targetUserKey] ?? []).map((dto) => mapOrderDtoToRecord(dto));
    setOrders(userOrders);
    const merged = Object.values(bucket)
      .flat()
      .map((dto) => mapOrderDtoToRecord(dto))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setAllOrders(merged);
  }, []);

  useEffect(() => {
    // Reload data when user changes
    const bucket = readCartBucket();
    setItems(bucket.byUser[userKey] ?? []);
    loadOrders(userKey).catch((err) => console.error("Nu am putut încărca comenzile din backend", err));
  }, [userKey, loadOrders]);

  useEffect(() => {
    const bucket = readCartBucket();
    bucket.byUser[userKey] = items;
    bucket.lastUserId = userKey;
    writeCartBucket(bucket);
  }, [items, userKey]);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const addItem: CartContextValue["addItem"] = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, existing.stock);
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: nextQty } : item));
      }
      const newItem: CartItem = {
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        quantity: Math.min(quantity, product.stock),
        stock: product.stock,
        heroImage: product.heroImage,
      };
      return [...prev, newItem];
    });
  }, []);

  const updateQuantity: CartContextValue["updateQuantity"] = useCallback((id, quantity) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.min(Math.max(1, quantity), item.stock) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem: CartContextValue["removeItem"] = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const getTotals: CartContextValue["getTotals"] = useCallback(
    (method = "standard") => computeTotals(items, method),
    [items]
  );

  const placeOrder: CartContextValue["placeOrder"] = useCallback((params) => {
    if (items.length === 0) {
      throw new Error("Coșul este gol");
    }
    const method = params?.shippingMethod ?? "standard";
    const totals = computeTotals(items, method);
    const now = new Date();
    const number = `BK-${now.getFullYear()}-${Math.random().toString(16).slice(-6).toUpperCase()}`;
    const payload = {
      number,
      createdAt: now.toISOString(),
      status: "processing",
      shippingMethod: method,
      userKey,
      note: params?.note,
      customer: params?.customer,
      totals,
      items: items.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        heroImage: item.heroImage,
      })),
    };

    return persistOrderSnapshot(payload)
      .then((dto) => {
        console.log("Order snapshot saved in backend:", dto);
        const record = mapOrderDtoToRecord(dto, items);
        setOrders((prev) => [record, ...prev]);
        setAllOrders((prev) => [record, ...prev]);
        clearCart();
        return record;
      })
      .catch((err) => {
        console.error("Nu am putut salva comanda în baza de date", err);
        const fallback = normalizeOrder({
          id: safeId(),
          number,
          createdAt: now.toISOString(),
          status: "processing",
          shippingMethod: method,
          note: params?.note,
          customer: params?.customer,
          totals,
          items,
          emailHistory: [],
        });
        setOrders((prev) => [fallback, ...prev]);
        setAllOrders((prev) => [fallback, ...prev]);
        clearCart();
        return fallback;
      });
  }, [items, clearCart, userKey]);

  const updateOrderStatus: CartContextValue["updateOrderStatus"] = useCallback(
    async (id, status) => {
      try {
        const updatedDto = await updateOrderStatusApi(id, status);
        const updated = mapOrderDtoToRecord(updatedDto);
        setAllOrders((prev) => prev.map((order) => (order.id === id ? updated : order)));
        setOrders((prev) => prev.map((order) => (order.id === id ? updated : order)));
        // refresh bucket to keep in sync with backend for Postman/API readers
        await loadOrders(userKey);
      } catch (err) {
        console.error("Nu am putut actualiza statusul comenzii", err);
      }
    },
    [loadOrders, userKey]
  );

  const recordEmail: CartContextValue["recordEmail"] = useCallback(
    (id, subject, message) => {
      setAllOrders((prev) =>
        prev.map((order) => {
          if (order.id !== id) return order;
          const log: EmailLog = {
            id: safeId(),
            to: order.customer?.email || "unknown",
            subject,
            message,
            createdAt: new Date().toISOString(),
          };
          return { ...order, emailHistory: [log, ...(order.emailHistory ?? [])] };
        })
      );
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id !== id) return order;
          const log: EmailLog = {
            id: safeId(),
            to: order.customer?.email || "unknown",
            subject,
            message,
            createdAt: new Date().toISOString(),
          };
          return { ...order, emailHistory: [log, ...(order.emailHistory ?? [])] };
        })
      );
    },
    []
  );

  const seedDemoOrders: CartContextValue["seedDemoOrders"] = useCallback(
    (seedOrders, options) => {
      const normalized = seedOrders.map((order) =>
        normalizeOrder({
          ...order,
          id: order.id ?? safeId(),
          createdAt: order.createdAt ?? new Date().toISOString(),
          items: order.items ?? [],
          shippingMethod: order.shippingMethod ?? "standard",
          totals:
            order.totals ??
            computeTotals(order.items ?? [], order.shippingMethod ?? "standard"),
          emailHistory: order.emailHistory ?? [],
        })
      );

      if (options?.includeCurrentUser) {
        const next = options.replaceExisting ? normalized : [...normalized, ...orders];
        setOrders(next.map(normalizeOrder));
        setAllOrders((prev) => [...next.map(normalizeOrder), ...prev]);
      } else {
        setAllOrders((prev) => [...normalized, ...prev]);
      }
    },
    [userKey]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      orders,
      allOrders,
      itemCount,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      getTotals,
      placeOrder,
      updateOrderStatus,
      recordEmail,
      seedDemoOrders,
    }),
    [
      items,
      orders,
      allOrders,
      itemCount,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      getTotals,
      placeOrder,
      updateOrderStatus,
      recordEmail,
      seedDemoOrders,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
