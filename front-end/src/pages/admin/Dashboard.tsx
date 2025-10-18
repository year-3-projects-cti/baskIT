import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products, mockOrders } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, TrendingUp, Users, Eye, Edit, Trash2 } from "lucide-react";

const AdminDashboard = () => {
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = mockOrders.length;
  const lowStockProducts = products.filter(p => p.stock < 5);

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
              <p className="text-xs text-muted-foreground">2 în așteptare</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Produse Active</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
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
                <Button>Adaugă Produs Nou</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 rounded-lg bg-secondary/30 flex items-center justify-center text-2xl">
                        🧺
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{product.category}</Badge>
                          <span className="text-sm text-muted-foreground">
                            Stoc: {product.stock}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{product.price} RON</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{order.orderNumber}</h3>
                        <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{order.date}</p>
                      </div>
                      <div className="text-center">
                        <Badge
                          variant={order.status === "delivered" ? "default" : "secondary"}
                        >
                          {order.status === "delivered" ? "Livrat" : "În procesare"}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{order.total.toFixed(2)} RON</p>
                        <Button size="sm" variant="outline" className="mt-2">
                          Vezi detalii
                        </Button>
                      </div>
                    </div>
                  ))}
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
                          <h3 className="font-semibold">{product.name}</h3>
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
    </div>
  );
};

export default AdminDashboard;
