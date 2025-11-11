import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, Gift, Truck, Heart, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useBaskets } from "@/hooks/useBaskets";
import { useMemo } from "react";
import { slugify } from "@/lib/utils";

const Home = () => {
  const { data: baskets = [], isLoading } = useBaskets();

  const categoryStats = useMemo(() => {
    const map = new Map<string, number>();
    baskets.forEach((basket) => {
      const key = basket.category;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({
      id: slugify(name),
      name,
      slug: slugify(name),
      count,
    }));
  }, [baskets]);

  const featuredProducts = baskets.slice(0, 4);
  const newProducts = baskets.slice(4, 8);
  const heroStats = [
    { icon: Gift, label: "Coșuri active", value: `${baskets.length}` },
    { icon: Truck, label: "Livrare rapidă", value: "24-48h" },
    {
      icon: Heart,
      label: "Clienți fericiți",
      value: "4.9/5",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32 text-white">
        <div className="absolute inset-0 hero-grid opacity-25"></div>
        <div className="hero-blob bg-white/25 w-72 h-72 -top-20 left-4"></div>
        <div className="hero-blob hero-blob-delayed bg-accent/40 w-96 h-96 -bottom-32 right-6"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-primary/40 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 border-white/40 bg-white/10 text-white shadow-soft">
              🎁 Bask IT Up! – Artizanați în București
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              Coșuri Cadou Curate Pentru Fiecare Moment Special
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/85">
              Descoperă colecții unice de coșuri cadou personalizate, livrate direct la ușa ta oriunde în România.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong">
                <Link to="/catalog">
                  Explorează Coșurile <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/60 text-white hover:bg-white/10">
                <Link to="/about">Despre Noi</Link>
              </Button>
            </div>
            <div className="mt-12 grid gap-4 text-left sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-wide text-white/70">{stat.label}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Curate cu Grijă</h3>
              <p className="text-sm text-muted-foreground">
                Fiecare coș este creat cu atenție la detalii
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Personalizabile</h3>
              <p className="text-sm text-muted-foreground">
                Adaugă mesaje și accesorii speciale
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Livrare Rapidă</h3>
              <p className="text-sm text-muted-foreground">
                Livrăm în toată România în 24-48h
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Garanție Calitate</h3>
              <p className="text-sm text-muted-foreground">
                Produse premium 100% garantate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Coșuri Pentru Orice Ocazie</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              De la sărbători tradiționale la momente personale speciale
            </p>
          </div>
          {categoryStats.length === 0 ? (
            <div className="text-muted-foreground">
              Adăugă primul coș pentru a popula categoriile afișate aici.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categoryStats.slice(0, 8).map((category) => (
                <Link
                  key={category.id}
                  to={`/catalog?category=${category.slug}`}
                  className="glass-card rounded-2xl p-6 text-center hover-lift group"
                >
                  <div className="text-4xl mb-3">🧺</div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.count} produse
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Cele Mai Populare</h2>
              <p className="text-muted-foreground">Preferate de clienții noștri</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/catalog?filter=bestsellers">
                Vezi toate <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {isLoading ? (
            <p className="text-muted-foreground">Se încarcă produsele...</p>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              Nu avem încă produse de afișat. Revino în curând!
            </div>
          )}
        </div>
      </section>

      {/* New Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Noutăți</h2>
              <p className="text-muted-foreground">Ultimele adăugări în colecție</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/catalog?filter=new">
                Vezi toate <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {isLoading ? (
            <p className="text-muted-foreground">Se încarcă produsele...</p>
          ) : newProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              Nu există produse noi momentan.
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/gift-pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Creăm Momente Memorabile
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Fiecare coș BaskIT este o experiență unică, creată cu pasiune pentru a aduce bucurie celor dragi.
            </p>
            <Button asChild size="lg" className="bg-white text-accent hover:bg-white/90">
              <Link to="/contact">
                Contactează-ne
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
