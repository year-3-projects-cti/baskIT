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
import { Package, ShoppingCart, TrendingUp, Users, Eye, Edit, Trash2 } from "lucide-react";
import { useBaskets, useBasketMutations } from "@/hooks/useBaskets";
import { BasketSummary, BasketPayload } from "@/types/basket";
import { toast } from "sonner";
import { fetchBasketBySlug } from "@/lib/baskets";
import { Link } from "react-router-dom";

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
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingBasket, setEditingBasket] = useState<BasketSummary | null>(null);
  const form = useForm<BasketFormValues>({ defaultValues: defaultFormValues });
  const [isDetailLoading, setDetailLoading] = useState(false);

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

  const lowStockProducts = baskets.filter((p) => p.stock < 5);
  const totalRevenue = baskets.reduce((sum, basket) => sum + basket.price * Math.max(basket.stock, 0), 0);
  const totalOrders = 0;

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
                <Button
                  onClick={() => {
                    setEditingBasket(null);
                    setDialogOpen(true);
                  }}
                >
                  Adaugă Produs Nou
                </Button>
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
                <div className="rounded-xl border border-dashed p-6 text-center text-muted-foreground">
                  Fluxul de comenzi va fi conectat după implementarea checkout-ului real.
                </div>
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
