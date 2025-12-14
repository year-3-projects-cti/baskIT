import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package, ShoppingCart, TrendingUp, Users, Eye, Edit, Trash2, Mail, CheckCircle } from "lucide-react";
import { useBaskets, useBasketMutations } from "@/hooks/useBaskets";
import { BasketSummary, BasketPayload } from "@/types/basket";
import { toast } from "sonner";
import { fetchBasketBySlug } from "@/lib/baskets";
import { Link } from "react-router-dom";
import { slugify } from "@/lib/utils";
import { useCart, type OrderStatus, type OrderRecord } from "@/lib/cart";
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
  const { allOrders, updateOrderStatus, recordEmail } = useCart();
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
              <p className="text-xs text-muted-foreground">+12% față de luna trecută</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Comenzi</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">Integrarea comenzilor urmează</p>
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
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">+3 săptămâna aceasta</p>
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
