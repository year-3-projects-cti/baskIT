import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  Check,
  Sparkles,
  Gift,
  Leaf,
  Coffee,
  Crown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { useBasketDetail } from "@/hooks/useBaskets";
import { useCart } from "@/lib/cart";

const contentIconMap: Array<{ matcher: RegExp; icon: LucideIcon }> = [
  { matcher: /(cafea|espresso|ceai|coffee|tea)/i, icon: Coffee },
  { matcher: /(vin|prosecco|champagne|whisky|gin|băutur|drink|bautur)/i, icon: Gift },
  { matcher: /(spa|relaxare|lumânar|arom|wellness|ulei)/i, icon: Leaf },
  { matcher: /(ciocol|dulce|trufe|dessert|praline|biscui)/i, icon: Sparkles },
  { matcher: /(premium|artizan|signature|deluxe|lux)/i, icon: Crown },
];

const pickIconForContent = (text: string): LucideIcon => {
  const match = contentIconMap.find((entry) => entry.matcher.test(text));
  return match?.icon ?? Sparkles;
};

const extractContentSummary = (html: string, tags: string[]): string[] => {
  const listMatches = Array.from(html.matchAll(/<li[^>]*>(.*?)<\/li>/gis)).map((match) =>
    match[1]?.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim()
  );
  const merged = [...listMatches, ...tags]
    .map((entry) => entry?.trim())
    .filter(Boolean) as string[];
  return Array.from(new Set(merged));
};

const ProductDetail = () => {
  const { slug } = useParams();
  const { data: product, isLoading, isError } = useBasketDetail(slug);
  const [quantity, setQuantity] = useState(1);
  const [giftNote, setGiftNote] = useState("");
  const [showBasketAnimation, setShowBasketAnimation] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const addToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    toast.success("Adăugat în coș!", {
      description: `${product.title} x${quantity}`,
    });
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowBasketAnimation(true);
    timeoutRef.current = setTimeout(() => {
      setShowBasketAnimation(false);
    }, 2200);
  };

  const basketContents = useMemo(() => {
    const html = product?.descriptionHtml ?? "";
    const tags = product?.tags ?? [];
    const summary = extractContentSummary(html, tags);
    const fallback = summary.length > 0 ? summary : ["Selecție gourmet curată manual"];
    return fallback.slice(0, 6).map((label) => ({
      label,
      icon: pickIconForContent(label),
    }));
  }, [product?.descriptionHtml, product?.tags]);

  const outOfStock = (product?.stock ?? 0) <= 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Se încarcă produsul...
      </div>
    );
  }

  if (isError || !product) {
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

  return (
    <div className="min-h-screen py-8">
      {showBasketAnimation && (
        <div className="cart-animation-overlay">
          <div className="cart-animation-visual">
            <model-viewer
              className="cart-animation-model"
              src="/models/basket.glb"
              alt="Model 3D coș cadou"
              auto-rotate
              autoplay
              disable-zoom
              camera-controls
              exposure="1"
            />
          </div>
        </div>
      )}
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Acasă</Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-primary">Catalog</Link>
          <span>/</span>
          <span className="text-foreground">{product.title}</span>
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
              {product.heroImage ? (
                <img
                  src={product.heroImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-9xl">
                  🧺
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                {product.category}
              </p>
              <h1 className="text-4xl font-bold mb-3">{product.title}</h1>
              <p className="text-lg text-muted-foreground">{product.prompt}</p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.stock < 5 && <Badge variant="outline">Doar {product.stock} în stoc</Badge>}
              {product.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>

            {/* Price */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-baseline gap-3 mb-4">
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
                    disabled={outOfStock}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-semibold">{outOfStock ? 0 : quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={outOfStock || quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
                <Button className="flex-1" size="lg" onClick={addToCart} disabled={outOfStock}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {outOfStock ? "Stoc epuizat" : "Adaugă în coș"}
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

            {/* What's inside */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">Ce conține coșul</p>
                  <h3 className="text-xl font-bold">What's inside</h3>
                </div>
                <Badge variant="outline">{basketContents.length} elemente</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {basketContents.map((entry) => (
                  <div key={entry.label} className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center text-primary">
                      <entry.icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm text-muted-foreground">{entry.label}</p>
                  </div>
                ))}
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
            <TabsList className="grid w-full grid-cols-2 max-w-2xl">
              <TabsTrigger value="description">Descriere</TabsTrigger>
              <TabsTrigger value="shipping">Livrare</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-8">
              <div className="glass-card rounded-2xl p-8 prose prose-lg max-w-none text-foreground">
                <div
                  className="prose prose-lg max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
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
