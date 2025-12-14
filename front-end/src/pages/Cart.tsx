import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

const Cart = () => {
  const { items, updateQuantity, removeItem, getTotals } = useCart();
  const { subtotal, shipping, vat, total } = getTotals("standard");

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Coșul tău este gol</h2>
          <p className="text-muted-foreground mb-8">
            Descoperă coșurile noastre cadou și alege cadoul perfect!
          </p>
          <Button asChild size="lg">
            <Link to="/catalog">
              Explorează catalogul
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Coșul tău</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="glass-card rounded-2xl p-6">
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="w-24 h-24 rounded-xl bg-secondary/30 flex-shrink-0 overflow-hidden">
                    {item.heroImage ? (
                      <img src={item.heroImage} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        🧺
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.slug}`} className="font-semibold text-lg hover:text-primary transition-colors block mb-2">
                      {item.title}
                    </Link>
                    <p className="text-sm text-muted-foreground mb-4">
                      În stoc: {item.stock} bucăți
                    </p>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-bold text-primary">
                          {(item.price * item.quantity).toFixed(2)} RON
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            removeItem(item.id);
                            toast.success("Produs eliminat din coș");
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Button asChild variant="outline" className="w-full">
              <Link to="/catalog">
                Continuă cumpărăturile
              </Link>
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Sumar comandă</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{subtotal.toFixed(2)} RON</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Livrare</span>
                  <span className="font-semibold">{shipping.toFixed(2)} RON</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TVA (19%)</span>
                  <span className="font-semibold">{vat.toFixed(2)} RON</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-primary text-2xl">
                    {total.toFixed(2)} RON
                  </span>
                </div>
              </div>

              {/* Discount Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <Input placeholder="Cod reducere" />
                  <Button variant="outline">Aplică</Button>
                </div>
              </div>

              <Button asChild size="lg" className="w-full shadow-strong">
                <Link to="/checkout">
                  Finalizează comanda
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  ✓ Livrare în 24-48h
                </div>
                <div className="flex items-center gap-2">
                  ✓ Plată securizată Stripe
                </div>
                <div className="flex items-center gap-2">
                  ✓ Drept de retur 14 zile
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
