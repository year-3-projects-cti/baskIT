import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Eye,
  Edit,
  Trash2,
  Mail,
  CheckCircle,
  Sparkles,
  BarChart3,
  Activity,
  RefreshCw,
  CircleCheck as CircleCheckIcon,
  Truck,
  Crown,
} from "lucide-react";
import { useBaskets, useBasketMutations } from "@/hooks/useBaskets";
import { BasketSummary, BasketPayload } from "@/types/basket";
import { toast } from "sonner";
import { fetchBasketBySlug } from "@/lib/baskets";
import { Link } from "react-router-dom";
import { slugify } from "@/lib/utils";
import { useCart, type OrderStatus, type OrderRecord, type CartItem, type EmailLog, type ShippingMethod } from "@/lib/cart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type BasketFormValues = Omit<BasketPayload, "tags"> & { tagsInput: string };

const defaultFormValues: BasketFormValues = {
  title: "",
  slug: "",
  category: "",
  prompt: "",
  price: 0,
  stock: 0,
  description: "",
  heroImage: "",
  tagsInput: "",
};

const AdminDashboard = () => {
  const { data: baskets = [], isLoading } = useBaskets();
  const { createMutation, updateMutation, deleteMutation } = useBasketMutations();
  const { allOrders, updateOrderStatus, recordEmail, seedDemoOrders } = useCart();
  const statusLabels: Record<OrderStatus, string> = {
    processing: "În procesare",
    shipped: "Predată curierului",
    delivered: "Livrată",
    canceled: "Anulată",
  };
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingBasket, setEditingBasket] = useState<BasketSummary | null>(null);
  const form = useForm<BasketFormValues>({ defaultValues: defaultFormValues });
  const [isDetailLoading, setDetailLoading] = useState(false);
  const [emailDrafts, setEmailDrafts] = useState<Record<string, { subject: string; message: string }>>({});

  useEffect(() => {
    let active = true;
    if (editingBasket) {
      setDetailLoading(true);
      fetchBasketBySlug(editingBasket.slug)
        .then((detail) => {
          if (!active) return;
          form.reset({
            title: detail.title,
            slug: detail.slug,
            category: detail.category,
            prompt: detail.prompt,
            price: detail.price,
            stock: detail.stock,
            description: detail.descriptionHtml,
            heroImage: detail.heroImage ?? "",
            tagsInput: detail.tags.join(", "),
          });
        })
        .catch(() => {
          toast.error("Nu am putut încărca detaliile coșului.");
        })
        .finally(() => active && setDetailLoading(false));
    } else {
      form.reset(defaultFormValues);
      setDetailLoading(false);
    }
    return () => {
      active = false;
    };
  }, [editingBasket, form]);

  const orders = allOrders;
  const lowStockProducts = baskets.filter((p) => p.stock < 5);
  const totalRevenue = allOrders.reduce((sum, order) => sum + order.totals.total, 0);
  const totalOrders = allOrders.length;
  const uniqueCustomers = useMemo(() => {
    const ids = new Set<string>();
    allOrders.forEach((order) => {
      const key = order.customer?.email || order.customer?.name || order.id;
      ids.add(key);
    });
    return ids.size || 6;
  }, [allOrders]);
  const statusBreakdown = useMemo(() => {
    return allOrders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      { processing: 0, shipped: 0, delivered: 0, canceled: 0 } as Record<OrderStatus, number>
    );
  }, [allOrders]);
  const deliveryRate =
    totalOrders === 0 ? 0 : Math.round((statusBreakdown.delivered / totalOrders) * 100);
  const backlog = statusBreakdown.processing + statusBreakdown.shipped;
  const expressShare =
    totalOrders === 0
      ? 0
      : Math.round(
          (allOrders.filter((order) => order.shippingMethod === "express").length / totalOrders) * 100
        );
  const averageTicket = totalOrders === 0 ? 0 : totalRevenue / totalOrders;
  const recentActivity = useMemo(
    () =>
      allOrders.slice(0, 4).map((order) => ({
        id: order.id,
        number: order.number,
        status: statusLabels[order.status],
        timestamp: new Date(order.createdAt).toLocaleString("ro-RO", {
          dateStyle: "short",
          timeStyle: "short",
        }),
        total: order.totals.total,
      })),
    [allOrders, statusLabels]
  );
  const bestSellers = useMemo(() => {
    const map = new Map<
      string,
      { title: string; revenue: number; units: number; heroImage?: string | null }
    >();
    allOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!map.has(item.id)) {
          map.set(item.id, {
            title: item.title,
            revenue: 0,
            units: 0,
            heroImage: item.heroImage,
          });
        }
        const entry = map.get(item.id)!;
        entry.revenue += item.price * item.quantity;
        entry.units += item.quantity;
      });
    });
    return Array.from(map.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);
  }, [allOrders]);

  const handleStatusChange = (orderId: string, status: string) => {
    updateOrderStatus(orderId, status as OrderStatus);
    toast.success("Status comandă actualizat");
  };

  const updateEmailDraft = (orderId: string, patch: Partial<{ subject: string; message: string }>) => {
    setEmailDrafts((prev) => {
      const order = orders.find((o) => o.id === orderId);
      const base = prev[orderId] ?? buildEmailDraft(order);
      return { ...prev, [orderId]: { ...base, ...patch } };
    });
  };

  const handleSendEmail = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    if (!order.customer?.email) {
      toast.error("Comanda nu are email de contact.");
      return;
    }
    const draft = emailDrafts[orderId] ?? buildEmailDraft(order);
    recordEmail(orderId, draft.subject.trim(), draft.message.trim());
    toast.success(`Email trimis către ${order.customer.email}`);
  };

  return (
    <div className="min-h-screen bg-secondary/20 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Gestionează produsele și comenzile</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Venituri Totale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} RON</div>
              <p className="text-xs text-muted-foreground">
                Bilet mediu: {averageTicket.toFixed(0)} RON
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Comenzi</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">{backlog} în lucru chiar acum</p>
            </CardContent>
          </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Produse Active</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{baskets.length}</div>
            <p className="text-xs text-muted-foreground">{lowStockProducts.length} stoc redus</p>
          </CardContent>
        </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Clienți</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueCustomers}</div>
              <p className="text-xs text-muted-foreground">contacte înregistrate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <CardTitle>Pipeline comenzi</CardTitle>
                <CardDescription>Progress bar pe fiecare status</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BarChart3 className="h-4 w-4" />
                {totalOrders} în ultimele 30 zile
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {(["processing", "shipped", "delivered", "canceled"] as OrderStatus[]).map((status) => {
                const labels: Record<OrderStatus, string> = {
                  processing: "În procesare",
                  shipped: "Predată curierului",
                  delivered: "Livrată",
                  canceled: "Anulată",
                };
                const colors: Record<OrderStatus, string> = {
                  processing: "bg-amber-500",
                  shipped: "bg-blue-500",
                  delivered: "bg-emerald-500",
                  canceled: "bg-destructive",
                };
                const percentage =
                  totalOrders === 0 ? 0 : Math.round((statusBreakdown[status] / totalOrders) * 100);
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <p>{labels[status]}</p>
                      <span className="text-muted-foreground">{statusBreakdown[status]} • {percentage}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary/60 overflow-hidden">
                      <div
                        className={`h-full ${colors[status]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="rounded-2xl border p-4">
                  <p className="text-xs text-muted-foreground uppercase">Rată livrare</p>
                  <p className="text-2xl font-semibold">{deliveryRate}%</p>
                  <p className="text-xs text-muted-foreground mt-1">din total comenzi</p>
                </div>
                <div className="rounded-2xl border p-4">
                  <p className="text-xs text-muted-foreground uppercase">Express share</p>
                  <p className="text-2xl font-semibold">{expressShare}%</p>
                  <p className="text-xs text-muted-foreground mt-1">preferă livrare rapidă</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Activitate live</CardTitle>
              <CardDescription>Ultimele actualizări de status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nu există încă activitate. Încarcă scenariul demo și revino.</p>
              ) : (
                recentActivity.map((event) => (
                  <div key={event.id} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/60 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{event.number}</p>
                      <p className="text-sm text-muted-foreground">{event.status}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.timestamp} • {event.total.toFixed(2)} RON
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Sales mix</CardTitle>
              <CardDescription>Top produse în ultimul demo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {bestSellers.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nu avem încă produse comandate. Folosește scenariul demo pentru a popula această secțiune.</p>
              ) : (
                bestSellers.map((item) => (
                  <div key={item.title} className="flex items-center justify-between border rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-secondary/50 overflow-hidden flex items-center justify-center">
                        {item.heroImage ? (
                          <img src={item.heroImage} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <Crown className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.units} buc. vândute</p>
                      </div>
                    </div>
                    <p className="font-semibold">{item.revenue.toFixed(2)} RON</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="products">Produse</TabsTrigger>
            <TabsTrigger value="orders">Comenzi</TabsTrigger>
            <TabsTrigger value="inventory">Inventar</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Toate Produsele</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={handleGenerateTestBasket}
                    disabled={createMutation.isPending}
                  >
                    Generează coș demo
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingBasket(null);
                      setDialogOpen(true);
                    }}
                  >
                    Adaugă Produs Nou
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-muted-foreground">Se încarcă produsele...</p>
                ) : baskets.length === 0 ? (
                  <p className="text-muted-foreground">Nu există încă produse. Adaugă primul coș!</p>
                ) : (
                  <div className="space-y-4">
                    {baskets.map((product) => (
                      <div key={product.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg">
                        <div className="w-16 h-16 rounded-lg bg-secondary/30 flex items-center justify-center text-2xl">
                          🧺
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{product.title}</h3>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant="outline">{product.category}</Badge>
                            <span className="text-sm text-muted-foreground">
                              Stoc: {product.stock}
                            </span>
                            <span className="text-xs uppercase text-muted-foreground">
                              {product.tags.join(", ")}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{product.price} RON</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" asChild>
                            <Link to={`/product/${product.slug}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingBasket(product);
                              setDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => handleDelete(product.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Comenzi Recente</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-6 text-center text-muted-foreground">
                    Nu există încă comenzi plasate.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => {
                      const statusBadge =
                        order.status === "delivered"
                          ? "bg-emerald-100 text-emerald-800"
                          : order.status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "canceled"
                          ? "bg-destructive/20 text-destructive"
                          : "bg-amber-100 text-amber-800";
                      const draft = emailDrafts[order.id] ?? buildEmailDraft(order);
                      return (
                        <div key={order.id} className="rounded-2xl border p-4 shadow-sm bg-card">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                            <div>
                              <p className="text-xs text-muted-foreground uppercase">Comanda</p>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-lg">{order.number}</span>
                                <Badge className={statusBadge}>{statusLabels[order.status]}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {order.customer?.name || "Client"} • {order.customer?.email || "email nedefinit"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Total</p>
                              <p className="font-bold text-primary">{order.totals.total.toFixed(2)} RON</p>
                            </div>
                          </div>
                          {order.status !== "canceled" && (
                            <div className="flex items-center gap-2 mb-4">
                              {(() => {
                                const stages = ["processing", "shipped", "delivered"] as OrderStatus[];
                                const stageOrder = stages.indexOf(order.status);
                                return stages.map((stage, index) => {
                                  const isCompleted = stageOrder >= index;
                                  return (
                                    <div key={stage} className="flex items-center gap-2">
                                      <span
                                        className={`h-2 w-12 rounded-full ${
                                          isCompleted ? "bg-primary" : "bg-secondary/70"
                                        }`}
                                      />
                                      {index < stages.length - 1 && (
                                        <span className="text-xs text-muted-foreground">›</span>
                                      )}
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                          )}

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Status comandă</Label>
                              <Select
                                value={order.status}
                                onValueChange={(value) => handleStatusChange(order.id, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="processing">În procesare</SelectItem>
                                  <SelectItem value="shipped">Predată curierului</SelectItem>
                                  <SelectItem value="delivered">Livrată</SelectItem>
                                  <SelectItem value="canceled">Anulată</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Trimite email către client</Label>
                              <Input
                                placeholder="Subiect"
                                value={draft.subject}
                                onChange={(e) => updateEmailDraft(order.id, { subject: e.target.value })}
                              />
                              <Textarea
                                rows={3}
                                placeholder="Mesaj"
                                value={draft.message}
                                onChange={(e) => updateEmailDraft(order.id, { message: e.target.value })}
                              />
                              <div className="flex justify-end">
                                <Button
                                  size="sm"
                                  onClick={() => handleSendEmail(order.id)}
                                  disabled={!order.customer?.email}
                                >
                                  <Mail className="h-4 w-4 mr-2" />
                                  Trimite email
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Produse</Label>
                              <div className="rounded-lg border p-3 space-y-2 max-h-40 overflow-auto">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex items-center justify-between text-sm">
                                    <span>{item.title} x{item.quantity}</span>
                                    <span className="font-semibold">{(item.price * item.quantity).toFixed(2)} RON</span>
                                  </div>
                                ))}
                              </div>
                              {order.emailHistory.length > 0 && (
                                <div className="rounded-lg border p-3">
                                  <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
                                    <Mail className="h-4 w-4" />
                                    Ultimele emailuri
                                  </div>
                                  <div className="space-y-1 text-xs text-muted-foreground max-h-24 overflow-auto">
                                    {order.emailHistory.map((log) => (
                                      <div key={log.id} className="flex items-center justify-between">
                                        <span className="truncate">{log.subject}</span>
                                        <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Stocuri Reduse</CardTitle>
              </CardHeader>
              <CardContent>
                {lowStockProducts.length === 0 ? (
                  <div className="text-center p-6 rounded-2xl border border-dashed text-muted-foreground flex flex-col items-center gap-3">
                    <CircleCheckIcon className="h-8 w-8 text-accent" />
                    <p>Toate stocurile sunt sănătoase.</p>
                    <p className="text-sm">Vezi tab-ul &ldquo;Produse&rdquo; pentru a adăuga colecții noi.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lowStockProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg border-destructive/50 bg-destructive/5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-secondary/30 flex items-center justify-center text-xl">
                            🧺
                          </div>
                          <div>
                            <h3 className="font-semibold">{product.title}</h3>
                            <Badge variant="destructive" className="mt-1">
                              Doar {product.stock} în stoc
                            </Badge>
                          </div>
                        </div>
                        <Button>Reaprovizionează</Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingBasket ? "Editează Coșul" : "Adaugă Coș Nou"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Titlu</Label>
                <Input {...form.register("title", { required: true })} />
              </div>
              <div>
                <Label>Slug (opțional)</Label>
                <Input {...form.register("slug")} placeholder="ex: cos-primavara" />
              </div>
              <div>
                <Label>Categorie</Label>
                <Input {...form.register("category", { required: true })} />
              </div>
              <div>
                <Label>Pret (RON)</Label>
                <Input type="number" step="0.01" {...form.register("price", { valueAsNumber: true, min: 0 })} />
              </div>
              <div>
                <Label>Stoc</Label>
                <Input type="number" {...form.register("stock", { valueAsNumber: true, min: 0 })} />
              </div>
              <div>
                <Label>Imagine (URL)</Label>
                <Input {...form.register("heroImage")} placeholder="https://..." />
              </div>
            </div>
            <div>
              <Label>Prompt / scurtă descriere</Label>
              <Textarea {...form.register("prompt", { required: true })} rows={2} />
            </div>
            <div>
              <Label>Etichete (separate prin virgulă)</Label>
              <Input
                {...form.register("tagsInput")}
                placeholder="festiv, premium, corporate"
              />
            </div>
            <div>
              <Label>Descriere HTML</Label>
              <Textarea
                {...form.register("description", { required: true })}
                rows={6}
                placeholder="<p>Text bogat...</p>"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Poți insera HTML complet (imagini, liste, strong, etc.). Este redat exact la client.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  setEditingBasket(null);
                }}
              >
                Anulează
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending || isDetailLoading}>
                {editingBasket ? "Salvează modificările" : "Publică coșul"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );

  async function handleSubmit(values: BasketFormValues) {
    const payload: BasketPayload = {
      title: values.title.trim(),
      slug: values.slug?.trim() || undefined,
      category: values.category.trim(),
      prompt: values.prompt.trim(),
      price: Number(values.price),
      stock: Number(values.stock),
      description: values.description,
      heroImage: values.heroImage?.trim() || undefined,
      tags: values.tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      if (editingBasket) {
        await updateMutation.mutateAsync({ id: editingBasket.id, payload });
        toast.success("Coș actualizat cu succes");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Coș creat cu succes");
      }
      setDialogOpen(false);
      setEditingBasket(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Nu am putut salva coșul.";
      toast.error(message);
    }
  }

  async function handleGenerateTestBasket() {
    const payload = buildDemoBasketPayload();
    try {
      await createMutation.mutateAsync(payload);
      toast.success(`Coș demo "${payload.title}" creat.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Nu am putut crea coșul demo.";
      toast.error(message);
    }
  }

  function handleSeedDemoScenario() {
    const dataset = buildDemoOrders(baskets);
    seedDemoOrders(dataset, { includeCurrentUser: true, replaceExisting: true });
    toast.success("Scenariul demo cu comenzi a fost încărcat.");
  }

  async function handleDelete(id: string) {
    if (!confirm("Sigur vrei să ștergi acest coș?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Coș șters.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Nu am putut șterge coșul.";
      toast.error(message);
    }
  }
};

export default AdminDashboard;

function buildEmailDraft(order?: OrderRecord) {
  const number = order?.number ?? "comanda ta";
  return {
    subject: `Actualizare pentru ${number}`,
    message: `Bună ziua,

Vă mulțumim pentru alegerea Bask IT Up!
Statusul pentru ${number} este acum: ${order?.status ?? "în procesare"}.

Cu drag,
Echipa Bask IT Up`,
  };
}

function buildDemoBasketPayload(): BasketPayload {
  const themes = [
    {
      title: "Coș Demo Crăciun",
      category: "Sărbători",
      prompt: "Selecție festivă cu vin fiert, biscuiți și decorațiuni de sezon.",
      tags: ["Craciun", "Holiday", "Cozy"],
      description: "<p>Include vin roșu aromatizat, biscuiți cu scorțișoară, lumânare parfumată și o decorațiune handmade.</p>",
      price: 249.9,
      heroImage: "https://images.unsplash.com/photo-1481833761820-0509d3217039",
    },
    {
      title: "Coș Demo Valentine",
      category: "Valentine's Day",
      prompt: "Cadou romantic cu prosecco și trufe belgiene.",
      tags: ["Valentine", "Love", "Romantic"],
      description: "<p>Prosecco, trufe cu cacao, lumânări parfumate și un buchet de flori uscate.</p>",
      price: 219.0,
      heroImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85",
    },
    {
      title: "Coș Demo Corporate",
      category: "Corporate",
      prompt: "Pachet premium cu cafea de specialitate și praline pentru clienți business.",
      tags: ["Corporate", "Premium"],
      description: "<p>Conține ceai negru, cafea de specialitate, jurnal din piele ecologică și caramel sărat.</p>",
      price: 289.5,
      heroImage: "https://images.unsplash.com/photo-1487611459768-bd414656ea10",
    },
  ];
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];
  const suffix = Math.random().toString(36).slice(2, 6);
  const title = `${randomTheme.title} #${suffix.toUpperCase()}`;
  return {
    title,
    slug: `${slugify(randomTheme.title)}-${suffix}`,
    category: randomTheme.category,
    prompt: randomTheme.prompt,
    price: Number(randomTheme.price.toFixed(2)),
    stock: 10 + Math.floor(Math.random() * 20),
    tags: randomTheme.tags,
    description: randomTheme.description,
    heroImage: randomTheme.heroImage,
  };
}

function buildDemoOrders(baskets: BasketSummary[]): OrderRecord[] {
  const fallbackTimestamp = new Date().toISOString();
  const fallbackCatalog: BasketSummary[] = [
    {
      id: "demo-craciun",
      slug: "demo-craciun",
      title: "Atelier Demo Crăciun",
      category: "Sărbători",
      prompt: "Vin fiert, biscuiți artizanali și textile nordice.",
      tags: ["holiday", "winter"],
      price: 259,
      stock: 18,
      heroImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
      createdAt: fallbackTimestamp,
      updatedAt: fallbackTimestamp,
    },
    {
      id: "demo-corporate",
      slug: "demo-corporate",
      title: "Corporate Ritual",
      category: "Corporate",
      prompt: "Cafele de specialitate, notes și praline pentru parteneri.",
      tags: ["corporate", "premium"],
      price: 309,
      stock: 25,
      heroImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
      createdAt: fallbackTimestamp,
      updatedAt: fallbackTimestamp,
    },
    {
      id: "demo-spa",
      slug: "demo-spa",
      title: "Spa Slow Morning",
      category: "Wellness",
      prompt: "Lumânări turnate manual, săruri și accesorii spa.",
      tags: ["wellness"],
      price: 279,
      stock: 16,
      heroImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
      createdAt: fallbackTimestamp,
      updatedAt: fallbackTimestamp,
    },
  ];

  const catalog = baskets.length ? baskets : fallbackCatalog;
  const pickBasket = (index: number) => catalog[index % catalog.length];

  const scenarios: Array<{
    status: OrderStatus;
    shippingMethod: ShippingMethod;
    offsetHours: number;
    customer: OrderRecord["customer"];
    note?: string;
    itemIndexes: Array<{ index: number; quantity: number }>;
    emailHistory?: EmailLog[];
  }> = [
    {
      status: "delivered",
      shippingMethod: "express",
      offsetHours: 72,
      customer: {
        name: "Maria Ionescu",
        email: "maria.ionescu@brio.ro",
        address: "Str. Polonă 32, București",
        phone: "0722 123 456",
      },
      note: "Include mesaj personalizat și panglică burgundy.",
      itemIndexes: [
        { index: 0, quantity: 1 },
        { index: 1, quantity: 1 },
      ],
    },
    {
      status: "shipped",
      shippingMethod: "standard",
      offsetHours: 34,
      customer: {
        name: "Corporate Demo SRL",
        email: "demo@corporate.ro",
        address: "Bd. Aviatorilor 12, București",
        phone: "0733 999 111",
      },
      itemIndexes: [
        { index: 1, quantity: 2 },
        { index: 2, quantity: 1 },
      ],
    },
    {
      status: "processing",
      shippingMethod: "express",
      offsetHours: 8,
      customer: {
        name: "Andrei Popa",
        email: "andrei@startup.ro",
        address: "Str. Vasile Lascăr 73, București",
        phone: "0720 555 666",
      },
      itemIndexes: [
        { index: 2, quantity: 1 },
      ],
    },
    {
      status: "canceled",
      shippingMethod: "standard",
      offsetHours: 20,
      customer: {
        name: "Ioana Matei",
        email: "ioana.matei@example.com",
        address: "Str. Paris 4, București",
      },
      note: "Clientul a solicitat reprogramare pentru săptămâna viitoare.",
      itemIndexes: [
        { index: 0, quantity: 1 },
      ],
      emailHistory: [
        {
          id: randomDemoId(),
          to: "ioana.matei@example.com",
          subject: "Confirmare anulare comandă",
          message: "Comanda ta a fost reprogramată conform solicitării.",
          createdAt: new Date().toISOString(),
        },
      ],
    },
  ];

  const labelMap: Record<OrderStatus, string> = {
    processing: "în procesare",
    shipped: "predată curierului",
    delivered: "livrată",
    canceled: "anulată",
  };

  return scenarios.map((scenario, index) => {
    const createdAt = new Date(Date.now() - scenario.offsetHours * 60 * 60 * 1000);
    const items: CartItem[] = scenario.itemIndexes.map(({ index: itemIndex, quantity }) => {
      const basket = pickBasket(itemIndex);
      return {
        id: basket.id,
        slug: basket.slug,
        title: basket.title,
        price: basket.price,
        quantity,
        stock: basket.stock,
        heroImage: basket.heroImage,
      };
    });
    const totals = computeDemoTotals(items, scenario.shippingMethod);
    const number = `BK-${createdAt.getFullYear()}-DEMO${index + 1}`;
    const emailHistory = scenario.emailHistory ?? [];
    if (emailHistory.length === 0 && scenario.customer?.email) {
      emailHistory.push({
        id: randomDemoId(),
        to: scenario.customer.email,
        subject: `Status ${number}`,
        message: `Comanda ${number} este ${labelMap[scenario.status]}`,
        createdAt: new Date(createdAt.getTime() + 60 * 60 * 1000).toISOString(),
      });
    }
    return {
      id: randomDemoId(),
      number,
      createdAt: createdAt.toISOString(),
      status: scenario.status,
      shippingMethod: scenario.shippingMethod,
      customer: scenario.customer,
      note: scenario.note,
      totals,
      items,
      emailHistory,
    };
  });
}

const randomDemoId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `demo-${Math.random().toString(16).slice(2)}`;

const computeDemoTotals = (items: CartItem[], method: ShippingMethod) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = method === "express" ? 35 : 25;
  const vat = (subtotal + shipping) * 0.19;
  return {
    subtotal,
    shipping,
    vat,
    total: subtotal + shipping + vat,
  };
};
