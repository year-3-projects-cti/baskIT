import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { products, categories } from "@/data/mockData";
import { ArrowRight, Gift, Truck, Heart, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const featuredProducts = products.filter(p => p.isBestseller).slice(0, 4);
  const newProducts = products.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/patterns/basket-pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              🎁 Bask It Up!
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Coșuri Cadou Curate Pentru Fiecare Moment Special
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Descoperă colecții unice de coșuri cadou personalizate, livrate direct la ușa ta în România.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong">
                <Link to="/catalog">
                  Explorează Coșurile <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/about">Despre Noi</Link>
              </Button>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
