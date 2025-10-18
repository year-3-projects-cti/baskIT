import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ShoppingCart, Heart, Share2, Check, Truck, Shield } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);
  const [quantity, setQuantity] = useState(1);
  const [giftNote, setGiftNote] = useState("");

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Produsul nu a fost găsit</h2>
          <Button asChild>
            <Link to="/catalog">Înapoi la catalog</Link>
          </Button>
        </div>
      </div>
    );
  }

  const addToCart = () => {
    toast.success("Adăugat în coș!", {
      description: `${product.name} x${quantity}`,
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Acasă</Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-primary">Catalog</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <Button variant="ghost" asChild className="mb-6">
          <Link to="/catalog">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Înapoi la catalog
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl overflow-hidden aspect-square">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-9xl">
                  🧺
                </div>
              )}
            </div>
            {product.gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {product.gallery.map((img, i) => (
                  <div key={i} className="glass-card rounded-xl overflow-hidden aspect-square cursor-pointer hover-lift">
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                {product.category}
              </p>
              <h1 className="text-4xl font-bold mb-3">{product.name}</h1>
              <p className="text-lg text-muted-foreground">{product.description}</p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.isNew && <Badge className="bg-accent">Nou</Badge>}
              {product.isBestseller && <Badge className="bg-primary">Bestseller</Badge>}
              {product.stock < 5 && <Badge variant="outline">Doar {product.stock} în stoc</Badge>}
              {product.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>

            {/* Price */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-baseline gap-3 mb-4">
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {product.originalPrice} RON
                  </span>
                )}
                <span className="text-4xl font-bold text-primary">
                  {product.price} RON
                </span>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
                <Button className="flex-1" size="lg" onClick={addToCart}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Adaugă în coș
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Favorite
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 glass-card rounded-xl">
                <Truck className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs font-medium">Livrare 24-48h</p>
              </div>
              <div className="text-center p-4 glass-card rounded-xl">
                <Shield className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="text-xs font-medium">Garanție calitate</p>
              </div>
              <div className="text-center p-4 glass-card rounded-xl">
                <Check className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs font-medium">100% Fresh</p>
              </div>
            </div>

            {/* Gift Note */}
            <div className="glass-card rounded-2xl p-6">
              <Label htmlFor="gift-note" className="text-base font-semibold mb-3 block">
                Mesaj cadou (opțional)
              </Label>
              <Textarea
                id="gift-note"
                placeholder="Scrie un mesaj personalizat pentru persoana specială..."
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Mesajul tău va fi inclus într-o carte elegantă
              </p>
            </div>
          </div>
        </div>

        {/* Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl">
              <TabsTrigger value="description">Descriere</TabsTrigger>
              <TabsTrigger value="components">Conținut</TabsTrigger>
              <TabsTrigger value="shipping">Livrare</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-8">
              <div className="glass-card rounded-2xl p-8 prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {product.longDescription}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="components" className="mt-8">
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-6">Ce conține coșul:</h3>
                <ul className="space-y-3">
                  {product.components.map((component, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{component}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="mt-8">
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-6">Informații livrare</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Livrare standard:</strong> 24-48 ore lucrătoare în toată România
                  </p>
                  <p>
                    <strong className="text-foreground">Livrare express:</strong> Disponibilă în orașele mari (București, Cluj, Timișoara, Brașov, Iași)
                  </p>
                  <p>
                    <strong className="text-foreground">Cost livrare:</strong> 20-25 RON în funcție de destinație
                  </p>
                  <p>
                    Comenzile plasate până la ora 12:00 sunt procesate în aceeași zi.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
