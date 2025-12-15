import { BasketDetail, BasketSummary } from "@/types/basket";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";

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

type SeedOptions = {
  includeCurrentUser?: boolean;
  replaceExisting?: boolean;
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
  }) => OrderRecord;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  recordEmail: (id: string, subject: string, message: string) => void;
  seedDemoOrders: (orders: OrderRecord[], options?: SeedOptions) => void;
};

const CART_KEY = "baskit.cart.v3";
const ORDER_KEY = "baskit.orders.v3";

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

const aggregateOrders = (bucket: { byUser: Record<string, OrderRecord[]> }): OrderRecord[] => {
  return Object.values(bucket.byUser ?? {})
    .flat()
    .map(normalizeOrder)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const userKey = user?.id || user?.email || "guest";

  type Bucket<T> = { byUser: Record<string, T>; lastUserId?: string };
  const readBucket = <T,>(key: string): Bucket<T> => {
    if (typeof localStorage === "undefined") return { byUser: {} };
    const raw = localStorage.getItem(key);
    if (!raw) return { byUser: {} };
    try {
      const parsed = JSON.parse(raw) as Bucket<T>;
      return parsed?.byUser ? parsed : { byUser: {} };
    } catch {
      return { byUser: {} };
    }
  };
  const writeBucket = <T,>(key: string, bucket: Bucket<T>) => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(key, JSON.stringify(bucket));
  };

  const [items, setItems] = useState<CartItem[]>(() => {
    const bucket = readBucket<CartItem[]>(CART_KEY);
    return bucket.byUser[userKey] ?? [];
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    const bucket = readBucket<OrderRecord[]>(ORDER_KEY);
    const stored = bucket.byUser[userKey] ?? [];
    return stored.map(normalizeOrder);
  });
  const [allOrders, setAllOrders] = useState<OrderRecord[]>(() => {
    const bucket = readBucket<OrderRecord[]>(ORDER_KEY);
    return aggregateOrders(bucket);
  });

  const [hydratedUserKey, setHydratedUserKey] = useState(userKey);

  useEffect(() => {
    if (hydratedUserKey !== userKey) return;
    const bucket = readBucket<CartItem[]>(CART_KEY);
    bucket.byUser[userKey] = items;
    bucket.lastUserId = userKey;
    writeBucket(CART_KEY, bucket);
  }, [items, userKey, hydratedUserKey]);

  useEffect(() => {
    if (hydratedUserKey !== userKey) return;
    const bucket = readBucket<OrderRecord[]>(ORDER_KEY);
    bucket.byUser[userKey] = orders;
    bucket.lastUserId = userKey;
    writeBucket(ORDER_KEY, bucket);
    setAllOrders(aggregateOrders(bucket));
  }, [orders, userKey, hydratedUserKey]);

  useEffect(() => {
    // Reload data when user changes
    const bucketItems = readBucket<CartItem[]>(CART_KEY);
    setItems(bucketItems.byUser[userKey] ?? []);
    const bucketOrders = readBucket<OrderRecord[]>(ORDER_KEY);
    setOrders((bucketOrders.byUser[userKey] ?? []).map(normalizeOrder));
    setAllOrders(aggregateOrders(bucketOrders));
    setHydratedUserKey(userKey);
  }, [userKey]);

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
    const id = safeId();
    const number = `BK-${now.getFullYear()}-${id.slice(-6).toUpperCase()}`;
    const order: OrderRecord = {
      id,
      number,
      createdAt: now.toISOString(),
      status: "processing",
      shippingMethod: method,
      note: params?.note,
      customer: params?.customer,
      totals,
      items,
      emailHistory: [],
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
    return order;
  }, [items, clearCart]);

  const updateOrderStatus: CartContextValue["updateOrderStatus"] = useCallback(
    (id, status) => {
      const bucket = readBucket<OrderRecord[]>(ORDER_KEY);
      const nextBucket: Bucket<OrderRecord[]> = { ...bucket, byUser: { ...bucket.byUser } };
      let changed = false;

      for (const key of Object.keys(nextBucket.byUser)) {
        const currentOrders = nextBucket.byUser[key] ?? [];
        const updated = currentOrders.map((order) => (order.id === id ? { ...order, status } : order));
        if (updated.some((order, idx) => order !== currentOrders[idx])) {
          nextBucket.byUser[key] = updated;
          changed = true;
        }
      }
      if (!changed) return;
      writeBucket(ORDER_KEY, nextBucket);
      setAllOrders(aggregateOrders(nextBucket));
      setOrders((nextBucket.byUser[userKey] ?? []).map(normalizeOrder));
    },
    [userKey]
  );

  const recordEmail: CartContextValue["recordEmail"] = useCallback(
    (id, subject, message) => {
      const bucket = readBucket<OrderRecord[]>(ORDER_KEY);
      const nextBucket: Bucket<OrderRecord[]> = { ...bucket, byUser: { ...bucket.byUser } };
      let changed = false;

      for (const key of Object.keys(nextBucket.byUser)) {
        const currentOrders = nextBucket.byUser[key] ?? [];
        const updated = currentOrders.map((order) => {
          if (order.id !== id) return order;
          const log: EmailLog = {
            id: safeId(),
            to: order.customer?.email || "unknown",
            subject,
            message,
            createdAt: new Date().toISOString(),
          };
          return { ...order, emailHistory: [log, ...(order.emailHistory ?? [])] };
        });
        if (updated.some((order, idx) => order !== currentOrders[idx])) {
          nextBucket.byUser[key] = updated;
          changed = true;
        }
      }

      if (!changed) return;
      writeBucket(ORDER_KEY, nextBucket);
      setAllOrders(aggregateOrders(nextBucket));
      setOrders((nextBucket.byUser[userKey] ?? []).map(normalizeOrder));
    },
    [userKey]
  );

  const seedDemoOrders: CartContextValue["seedDemoOrders"] = useCallback(
    (orders, options) => {
      const normalized = orders.map((order) =>
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

      const bucket = readBucket<OrderRecord[]>(ORDER_KEY);
      const nextBucket: Bucket<OrderRecord[]> = {
        ...bucket,
        byUser: { ...bucket.byUser, __demo__: normalized },
      };

      if (options?.includeCurrentUser) {
        nextBucket.byUser[userKey] = options.replaceExisting
          ? normalized
          : [...normalized, ...(nextBucket.byUser[userKey] ?? [])];
      }

      writeBucket(ORDER_KEY, nextBucket);
      setAllOrders(aggregateOrders(nextBucket));
      if (options?.includeCurrentUser) {
        setOrders((nextBucket.byUser[userKey] ?? []).map(normalizeOrder));
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
