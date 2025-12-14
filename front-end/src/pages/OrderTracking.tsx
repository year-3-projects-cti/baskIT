import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, CheckCircle, Clock, ShoppingBag, XCircle } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Link, useLocation } from "react-router-dom";

const statusConfig: Record<string, { label: string; color: string }> = {
  processing: { label: "În procesare", color: "bg-amber-100 text-amber-800" },
  shipped: { label: "Predată curierului", color: "bg-blue-100 text-blue-800" },
  delivered: { label: "Livrată", color: "bg-emerald-100 text-emerald-800" },
  canceled: { label: "Anulată", color: "bg-destructive/20 text-destructive" },
};

const formatDate = (input: string) =>
  new Intl.DateTimeFormat("ro-RO", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(input)
  );

const OrderTracking = () => {
  const { orders } = useCart();
  const location = useLocation();
  const highlightId = (location.state as { highlight?: string } | null)?.highlight;
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (highlightId) {
      setSelectedOrderId(highlightId);
    }
  }, [highlightId]);

  useEffect(() => {
    if (!selectedOrderId && orders.length) {
      setSelectedOrderId(orders[0].id);
    }
  }, [orders, selectedOrderId]);

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) ?? orders[0],
    [orders, selectedOrderId]
  );

  const timeline = useMemo(() => {
    if (!selectedOrder) return [];
    if (selectedOrder.status === "canceled") {
      return [
        {
          key: "processing",
          title: "Comandă plasată",
          description: "Comanda a fost înregistrată",
          date: formatDate(selectedOrder.createdAt),
          completed: true,
        },
        {
          key: "canceled",
          title: "Anulată",
          description: "Comanda a fost anulată la cerere",
          date: formatDate(selectedOrder.createdAt),
          completed: true,
        },
      ];
    }

    const baseDate = new Date(selectedOrder.createdAt);
    const statusOrder = ["processing", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(selectedOrder.status);
    const datePlusHours = (hours: number) =>
      new Date(baseDate.getTime() + hours * 60 * 60 * 1000);

    return [
      {
        key: "processing",
        title: "Comandă plasată",
        description: "Pregătim cadoul cu grijă",
        date: formatDate(baseDate.toISOString()),
        completed: true,
      },
      {
        key: "shipped",
        title: "Predată curierului",
        description: "Curierul a preluat coletul",
        date: formatDate(datePlusHours(12).toISOString()),
        completed: currentIndex >= 1,
      },
      {
        key: "delivered",
        title: "Livrată",
        description: "Coletul a ajuns la destinație",
        date:
          currentIndex >= 2
            ? formatDate(datePlusHours(24).toISOString())
            : "Estimare 24-48h",
        completed: currentIndex >= 2,
      },
    ];
  }, [selectedOrder]);

  if (!orders.length) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16">
        <div className="text-center max-w-md">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Nu ai comenzi încă</h1>
          <p className="text-muted-foreground mb-6">
            Adaugă produse în coș și finalizează comanda pentru a le vedea aici.
          </p>
          <Button asChild>
            <Link to="/catalog">Începe cumpărăturile</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-8">
          <div>
            <p className="text-sm uppercase text-muted-foreground tracking-[0.3em]">Contul meu</p>
            <h1 className="text-4xl font-bold">Comenzile mele</h1>
          </div>
          <Button asChild variant="outline">
            <Link to="/catalog">Continuă cumpărăturile</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="space-y-3">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.processing;
              const isActive = order.id === selectedOrder?.id;
              return (
                <button
                  key={order.id}
                  className={`w-full rounded-2xl border p-4 text-left transition-all ${
                    isActive
                      ? "border-primary/50 bg-primary/5 shadow-medium"
                      : "border-border hover:border-primary/30 hover:bg-secondary/40"
                  }`}
                  onClick={() => setSelectedOrderId(order.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Comanda</p>
                      <p className="font-semibold">{order.number}</p>
                    </div>
                    <Badge className={status.color}>{status.label}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                    <span>{formatDate(order.createdAt)}</span>
                    <span className="font-semibold text-primary">{order.totals.total.toFixed(2)} RON</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Order Details */}
          {selectedOrder && (
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Număr comandă</p>
                    <h2 className="text-2xl font-bold">{selectedOrder.number}</h2>
                    <p className="text-muted-foreground">Plasată pe {formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <Badge variant="secondary">
                    {statusConfig[selectedOrder.status]?.label ?? "În procesare"}
                  </Badge>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6">Status livrare</h3>
                <div className="space-y-6">
                  {timeline.map((step, index) => (
                    <div key={step.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.completed
                              ? "bg-accent text-accent-foreground"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {step.key === "delivered" && <CheckCircle className="h-5 w-5" />}
                          {step.key === "shipped" && <Truck className="h-5 w-5" />}
                          {step.key === "processing" && <Package className="h-5 w-5" />}
                          {step.key === "canceled" && <XCircle className="h-5 w-5" />}
                        </div>
                        {index < timeline.length - 1 && (
                          <div
                            className={`w-0.5 h-12 ${
                              step.completed ? "bg-accent" : "bg-border"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold">{step.title}</p>
                          <p className="text-sm text-muted-foreground">{step.date}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Informații livrare</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Adresă</p>
                    <p className="font-medium">{selectedOrder.customer?.address || "Adresă necompletată"}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground">Metodă livrare</p>
                    <p className="font-medium">
                      {selectedOrder.shippingMethod === "express" ? "Express (12-24h)" : "Standard (24-48h)"}
                    </p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-muted-foreground">Client</p>
                      <p className="font-medium">{selectedOrder.customer?.name || "Client BaskIT"}</p>
                      {selectedOrder.customer?.email && (
                        <p className="text-sm text-muted-foreground">{selectedOrder.customer.email}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-muted-foreground">Telefon</p>
                      <p className="font-medium">{selectedOrder.customer?.phone || "Nespecificat"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Produse comandate</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-secondary/30 flex items-center justify-center text-xl overflow-hidden">
                          {item.heroImage ? (
                            <img src={item.heroImage} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <span>🧺</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Cantitate: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold">
                        {(item.price * item.quantity).toFixed(2)} RON
                      </p>
                    </div>
                  ))}
                  <Separator />
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-foreground">{selectedOrder.totals.subtotal.toFixed(2)} RON</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Livrare</span>
                      <span className="font-medium text-foreground">{selectedOrder.totals.shipping.toFixed(2)} RON</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TVA</span>
                      <span className="font-medium text-foreground">{selectedOrder.totals.vat.toFixed(2)} RON</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg pt-2">
                    <span className="font-bold">Total plătit</span>
                    <span className="font-bold text-primary">
                      {selectedOrder.totals.total.toFixed(2)} RON
                    </span>
                  </div>
                </div>
              </div>

              {selectedOrder.note && (
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-2">Mesaj către destinatar</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{selectedOrder.note}</p>
                </div>
              )}

              <div className="glass-card rounded-2xl p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Ai întrebări despre comanda ta?
                </p>
                <Button variant="outline">Contactează-ne</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
