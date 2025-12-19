import { API_BASE_URL, apiRequest } from "@/lib/api";

const ORDERS_API_URL =
  import.meta.env.VITE_ORDERS_API_URL ?? import.meta.env.VITE_API_URL ?? API_BASE_URL;

export type OrderDto = {
  id: string;
  number: string;
  createdAt: string;
  status: string;
  shippingMethod: string;
  note?: string | null;
  clientKey?: string | null;
  userKey?: string | null;
  customer?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
  } | null;
  totals?: {
    subtotal?: number;
    shipping?: number;
    vat?: number;
    total?: number;
  } | null;
  items?: Array<{
    id: string;
    slug?: string | null;
    title: string;
    price: number;
    quantity: number;
    heroImage?: string | null;
  }>;
};

export type OrderSnapshotPayload = {
  number: string;
  createdAt: string;
  status: string;
  shippingMethod: string;
  userKey: string;
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
  items: Array<{
    id: string;
    slug?: string;
    title: string;
    price: number;
    quantity: number;
    heroImage?: string | null;
  }>;
};

export async function persistOrderSnapshot(payload: OrderSnapshotPayload) {
  return apiRequest<OrderDto>(
    "/orders",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    undefined,
    ORDERS_API_URL
  );
}

export async function fetchOrderBuckets() {
  return apiRequest<Record<string, OrderDto[]>>("/orders", {}, undefined, ORDERS_API_URL);
}

export async function updateOrderStatusApi(id: string, status: string) {
  return apiRequest<OrderDto>(
    `/orders/${id}/status`,
    {
      method: "POST",
      body: JSON.stringify({ status }),
    },
    undefined,
    ORDERS_API_URL
  );
}
