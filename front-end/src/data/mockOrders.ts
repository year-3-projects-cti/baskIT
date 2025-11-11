export type Order = {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
  };
  total: number;
  status: "processing" | "delivered";
  date: string;
};

export const mockOrders: Order[] = [
  {
    id: "ord-1",
    orderNumber: "#BASK-1042",
    customer: { name: "Maria Popescu" },
    total: 389.5,
    status: "delivered",
    date: "2024-11-02",
  },
  {
    id: "ord-2",
    orderNumber: "#BASK-1043",
    customer: { name: "Alex Ionescu" },
    total: 249.99,
    status: "processing",
    date: "2024-11-05",
  },
  {
    id: "ord-3",
    orderNumber: "#BASK-1044",
    customer: { name: "Andreea Mihai" },
    total: 512.0,
    status: "delivered",
    date: "2024-11-06",
  },
];
