import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import {
  ArrowRight,
  Camera,
  Gift,
  Truck,
  Heart,
  Shield,
  ShoppingBag,
  Palette,
  Sparkles,
  Map as MapIcon,
  Star,
  HandHeart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useBaskets, useFeaturedBaskets } from "@/hooks/useBaskets";
import { useMemo } from "react";
import { slugify } from "@/lib/utils";
import { HeroVisual } from "@/components/HeroVisual";

const lookbookShots = [
  {
    title: "Atelierul de Crăciun",
    description: "Vin fiert, scorțișoară și textile nordice în nuanțe calde.",
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80",
    tag: "Holiday limited",
  },
  {
    title: "Brunch Urban",
    description: "Cafele de specialitate, ceramică minimalistă și textile nude.",
    image: "https://images.unsplash.com/photo-1455853659719-4b521eebc76d?auto=format&fit=crop&w=1200&q=80",
    tag: "Corporate love",
  },
  {
    title: "Spa la tine acasă",
    description: "Săruri aromate, lumânări turnate manual și accesorii din lemn.",
    image: "https://images.unsplash.com/photo-1501117716987-c8e1ecb210cc?auto=format&fit=crop&w=1200&q=80",
    tag: "New collection",
  },
];

const processSteps = [
  {
    icon: ShoppingBag,
    title: "Selectezi vibe-ul",
    description: "Colecții tematice actualizate lunar și filtre rapide pentru bugete.",
    stat: "12+ colecții",
  },
  {
    icon: Palette,
    title: "Personalizezi detaliile",
    description: "Mesaje, accesorii extra și preferințe alimentare într-un singur formular.",
    stat: "4 opțiuni extra",
  },
  {
    icon: Sparkles,
    title: "Plătești sigur",
    description: "Stripe, Apple Pay și facturi instant pentru clienții corporate.",
    stat: "PCI compliant",
  },
  {
    icon: MapIcon,
    title: "Track & share",
    description: "Timeline live, emailuri automate și link public pentru destinatar.",
    stat: "24-48h",
  },
];

const testimonials = [
  {
    quote:
      "În demo am reușit să arăt clar pipeline-ul: storefront → plată → fulfilment. Clienții corporate reacționează imediat când văd timeline-ul vizual.",
    persona: "Partener HR Corporate",
    context: "Demo enterprise",
    metric: "58 coșuri corporate",
  },
  {
    quote:
      "Butonul de „generează coș demo” ne salvează minute bune înainte de fiecare prezentare. Avem tot timpul imagini, stoc și descrieri gata.",
    persona: "Echipă internă Bask IT",
    context: "Pregătire demo",
    metric: "Demo ready în 30s",
  },
  {
    quote:
      "Timeline-ul din admin plus istoricul emailurilor le arată investitorilor că am gândit procese reale, nu doar un catalog static.",
    persona: "Advisor Operațional",
    context: "Pitch investitori",
    metric: "NPS 4.9/5",
  },
];

const journeyCards = [
  {
    title: "Storefront captivant",
    description:
      "Începe turul cu o secțiune hero cinematică, lookbook foto și produse reale. Link direct către catalogul filtrat pe campanie.",
    action: "Deschide catalogul",
    to: "/catalog",
    icon: Camera,
  },
  {
    title: "Checkout & Stripe live",
    description:
      "Arată cum completăm datele, alegem livrarea și trimitem mesaje personalizate. Stripe se încarcă în mod test cu confirmare rapidă.",
    action: "Simulează checkout",
    to: "/checkout",
    icon: Sparkles,
  },
  {
    title: "Admin & livrare",
    description:
      "Încheie demo-ul cu dashboard-ul ce afișează veniturile, backlog-ul și timeline-uri reale. Include butonul de reset demo data.",
    action: "Intră în Admin",
    to: "/admin",
    icon: HandHeart,
  },
];

const categoryVisuals: Record<
  string,
  { emoji: string; gradient: string; image: string; subtitle: string }
> = {
  sarbatori: {
    emoji: "🎄",
    gradient: "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.65))",
    image:
      "https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=900&q=80",
    subtitle: "Note de scorțișoară și textile nordice",
  },
  corporate: {
    emoji: "💼",
    gradient: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.75))",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
    subtitle: "Perfect pentru onboarding sau conferințe",
  },
  gourmet: {
    emoji: "🍫",
    gradient: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
    image:
      "https://images.unsplash.com/photo-1484344597163-9347fc0c72dc?auto=format&fit=crop&w=900&q=80",
    subtitle: "Artizanat local și pairinguri surprinzătoare",
  },
  baby: {
    emoji: "🍼",
    gradient: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
    image:
      "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=900&q=80",
    subtitle: "Textile organice și jucării sigure",
  },
  wellness: {
    emoji: "🧖",
    gradient: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    subtitle: "Spa de acasă și ritualuri mindful",
  },
  valentines: {
    emoji: "💌",
    gradient: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80",
    subtitle: "Note florale și prosecco rosé",
  },
};

const Home = () => {
  const { data: baskets = [], isLoading } = useBaskets();
  const { data: featuredProducts = [], isLoading: featuredLoading } = useFeaturedBaskets();

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

  const newProducts = baskets.slice(0, 4);
  const heroStats = [
    { icon: Gift, label: "Coșuri active", value: `${baskets.length || 12}+` },
    { icon: Truck, label: "Livrare rapidă", value: "24-48h" },
    {
      icon: Star,
      label: "Scor satisfacție",
      value: "4.9/5",
    },
  ];

  const getCategoryVisual = (slug: string) =>
    categoryVisuals[slug] ?? {
      emoji: "🧺",
      gradient: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
      subtitle: "Colecții limitate cu livrare rapidă",
    };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-backdrop" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <Badge className="mb-6 border-white/40 bg-white/10 text-white shadow-soft">
                🎁 Bask IT Up! – Artizanați în București
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight text-white">
                Coșuri Cadou Curate Pentru Fiecare Moment Special
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/85">
                Descoperă colecții unice de coșuri cadou personalizate, livrate direct la ușa ta oriunde în România. Perfect pentru demo-uri live și prezentări corporate.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong">
                  <Link to="/catalog">
                    Explorează Coșurile <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/60 text-primary hover:bg-white/10">
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
                      <p className="text-sm uppercase tracking-wide text-primary">{stat.label}</p>
                      <p className="text-2xl font-semibold">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex justify-center">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center px-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Curate cu Grijă</h3>
              <p className="text-sm text-muted-foreground">
                Fiecare coș este creat cu atenție la detalii
              </p>
            </div>
            <div className="text-center px-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Personalizabile</h3>
              <p className="text-sm text-muted-foreground">
                Adaugă mesaje și accesorii speciale
              </p>
            </div>
            <div className="text-center px-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Livrare Rapidă</h3>
              <p className="text-sm text-muted-foreground">
                Livrăm în toată România în 24-48h
              </p>
            </div>
            <div className="text-center px-3">
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

      {/* Lookbook */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Lookbook</p>
              <h2 className="text-3xl md:text-4xl font-bold">Scene pentru prezentări</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Folosește cadre reale pentru a crea o poveste coerentă: de la atelierul de Crăciun până la spa-ul urban.
              </p>
            </div>
            <Button asChild variant="outline">
              <a href="#journey">Planifică demo-ul</a>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lookbookShots.map((shot) => (
              <div
                key={shot.title}
                className="lookbook-card rounded-3xl overflow-hidden relative"
                style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.6)), url(${shot.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="relative z-10 p-6 flex flex-col justify-end h-full text-white space-y-3">
                  <Badge variant="secondary" className="w-fit bg-white/80 text-primary">
                    {shot.tag}
                  </Badge>
                  <h3 className="text-2xl font-semibold">{shot.title}</h3>
                  <p className="text-sm text-white/80">{shot.description}</p>
                </div>
              </div>
            ))}
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
            <div className="text-muted-foreground text-center glass-card p-8 rounded-3xl max-w-xl mx-auto">
              Adăugă primul coș pentru a popula categoriile afișate aici. Acest grid folosește imagini dinamice pentru prezentări.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categoryStats.slice(0, 8).map((category) => {
                const visual = getCategoryVisual(category.slug);
                return (
                  <Link
                    key={category.id}
                    to={`/catalog?category=${category.slug}`}
                    className="relative rounded-3xl overflow-hidden text-white hover-lift group min-h-[220px]"
                    style={{
                      backgroundImage: `${visual.gradient}, url(${visual.image})`,
                      backgroundSize: "cover",
                    }}
                  >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <div className="relative z-10 h-full flex flex-col justify-between p-6">
                    <div className="text-4xl">{visual.emoji}</div>
                    <div>
                      <h3 className="font-semibold text-2xl">{category.name}</h3>
                      <p className="text-sm text-white/80">{visual.subtitle}</p>
                      <p className="text-xs uppercase tracking-wide mt-2">
                        {category.count} produse
                      </p>
                    </div>
                  </div>
                </Link>
                );
              })}
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
          {featuredLoading ? (
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

      {/* Process */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Proces live</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Cum arătăm fluxul în prezentare</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Acoperim toate etapele din 90 de secunde: selecție, personalizare, plată sigură și livrare track-uită.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step) => (
              <div key={step.title} className="glass-card rounded-3xl p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <step.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wide text-muted-foreground">{step.stat}</p>
                  <h3 className="font-semibold text-xl">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Journey */}
      <section id="journey" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Storyline</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Tur ghidat în 3 pași</h2>
              <p className="text-muted-foreground max-w-2xl">
                Urmează același scenariu la fiecare demo și arată valoarea atât pentru clienți cât și pentru echipa operațională.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/about">Vezi impactul</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {journeyCards.map((card) => (
              <div key={card.title} className="glass-card rounded-3xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                </div>
                <p className="text-muted-foreground flex-1">{card.description}</p>
                <Button asChild>
                  <Link to={card.to}>
                    {card.action} <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Social proof</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Ce spun partenerii după demo</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Folosește aceste testimoniale sau înlocuiește-le cu referințele tale pentru a ancora discuția în rezultate.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div key={item.metric} className="glass-card rounded-3xl p-6 flex flex-col gap-4">
                <Star className="h-8 w-8 text-accent" />
                <p className="text-lg font-medium leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
                <div className="pt-4 border-t border-border/60">
                  <p className="font-semibold">{item.persona}</p>
                  <p className="text-sm text-muted-foreground">{item.context}</p>
                  <Badge variant="outline" className="mt-2">{item.metric}</Badge>
                </div>
              </div>
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
