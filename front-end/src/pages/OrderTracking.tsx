import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState("BK-2025-001");
  const [email, setEmail] = useState("");

  // Mock order data
  const order = {
    orderNumber: "BK-2025-001",
    date: "15 ianuarie 2025",
    status: "delivered",
    customer: {
      name: "Maria Popescu",
      email: "maria.popescu@email.ro",
      phone: "+40721123456",
    },
    shipping: {
      address: "Str. Exemplu, nr. 123, București, sector 1",
      method: "Standard (24-48h)",
      trackingNumber: "FAN123456789",
    },
    items: [
      {
        id: "1",
        name: "Crăciun Clasic",
        quantity: 2,
        price: 249.99,
      },
    ],
    timeline: [
      {
        status: "created",
        title: "Comandă plasată",
        description: "Comanda ta a fost înregistrată cu succes",
        date: "15 ian, 10:30",
        completed: true,
      },
      {
        status: "paid",
        title: "Plată confirmată",
        description: "Plata a fost procesată cu succes prin Stripe",
        date: "15 ian, 10:31",
        completed: true,
      },
      {
        status: "fulfilled",
        title: "Pregătit pentru livrare",
        description: "Coșul tău a fost ambalat și predat curierului",
        date: "15 ian, 14:45",
        completed: true,
      },
      {
        status: "in_transit",
        title: "În tranzit",
        description: "Coletul este în drum către tine",
        date: "16 ian, 08:15",
        completed: true,
      },
      {
        status: "delivered",
        title: "Livrat",
        description: "Coletul a fost livrat cu succes",
        date: "16 ian, 16:30",
        completed: true,
      },
    ],
    total: 624.93,
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      created: { label: "Comandă nouă", variant: "secondary" as const },
      paid: { label: "Plătit", variant: "default" as const },
      fulfilled: { label: "Pregătit", variant: "default" as const },
      in_transit: { label: "În tranzit", variant: "default" as const },
      delivered: { label: "Livrat", variant: "default" as const },
      cancelled: { label: "Anulat", variant: "destructive" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.created;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Urmărește comanda</h1>
          <p className="text-muted-foreground">
            Verifică statusul comenzii tale în timp real
          </p>
        </div>

        {/* Search Form */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="orderNumber">Număr comandă</Label>
              <Input
                id="orderNumber"
                placeholder="BK-2025-XXX"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemplu@email.ro"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <Button className="w-full">Caută comanda</Button>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Header */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Comanda {order.orderNumber}</h2>
                <p className="text-muted-foreground">Plasată pe {order.date}</p>
              </div>
              {getStatusBadge(order.status)}
            </div>
          </div>

          {/* Timeline */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6">Status livrare</h3>
            <div className="space-y-6">
              {order.timeline.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.completed
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {step.status === "delivered" && <CheckCircle className="h-5 w-5" />}
                      {step.status === "in_transit" && <Truck className="h-5 w-5" />}
                      {step.status === "fulfilled" && <Package className="h-5 w-5" />}
                      {(step.status === "paid" || step.status === "created") && (
                        <Clock className="h-5 w-5" />
                      )}
                    </div>
                    {index < order.timeline.length - 1 && (
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

          {/* Shipping Info */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Informații livrare</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Adresă</p>
                <p className="font-medium">{order.shipping.address}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Metodă livrare</p>
                <p className="font-medium">{order.shipping.method}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Număr urmărire</p>
                <p className="font-medium font-mono">{order.shipping.trackingNumber}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Produse comandate</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-secondary/30 flex items-center justify-center text-xl">
                      🧺
                    </div>
                    <div>
                      <p className="font-semibold">{item.name}</p>
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
              <div className="flex justify-between text-lg pt-2">
                <span className="font-bold">Total plătit</span>
                <span className="font-bold text-primary">
                  {order.total.toFixed(2)} RON
                </span>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Ai întrebări despre comanda ta?
            </p>
            <Button variant="outline">Contactează-ne</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
