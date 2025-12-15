import { Heart, Users, Award, Leaf, TrendingUp, Clock3, ShieldCheck, Sparkles } from "lucide-react";

const impactMetrics = [
  {
    label: "Comenzi procesate în demo",
    value: "1.2k",
    description: "Simulări Stripe + timeline complet",
    icon: TrendingUp,
  },
  {
    label: "Timp mediu demo complet",
    value: "08:30",
    description: "De la storefront la fulfilment",
    icon: Clock3,
  },
  {
    label: "Automatizări acoperite",
    value: "7 fluxuri",
    description: "Catalogue, checkout, livrare, audit",
    icon: ShieldCheck,
  },
];

const roadmap = [
  {
    year: "2022",
    title: "MVP & validare",
    description: "Primele colecții + integrare Stripe pentru plăți sigure.",
  },
  {
    year: "2023",
    title: "Automatizare fulfilment",
    description: "State machine pe comenzi și webhook-uri pentru livrare.",
  },
  {
    year: "2024",
    title: "Experiență demo + analytics",
    description: "Seed demo data cu un click și dashboard operațional.",
  },
  {
    year: "2025",
    title: "Build-your-own & abonamente",
    description: "Roadmap public pentru următoarea etapă.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-6">Despre BaskIT</h1>
          <p className="text-xl text-muted-foreground">
            Creăm momente memorabile prin coșuri cadou curate cu grijă, pasiune și atenție la detalii
          </p>
        </div>

        {/* Story */}
        <div className="glass-card rounded-2xl p-8 md:p-12 mb-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Povestea noastră</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p>
              BaskIT a luat naștere din dorința de a face cadourile cu adevărat speciale. Am observat că adesea, 
              găsirea cadoului perfect poate fi o provocare - vrei ceva personalizat, de calitate și care să 
              transmită exact sentimentele tale.
            </p>
            <p>
              De aceea am creat BaskIT - un loc unde fiecare coș cadou este curate cu grijă, folosind numai 
              produse premium de la producători locali și internaționali verificați. Fie că este vorba despre 
              o sărbătoare tradițională, un eveniment corporate sau un moment personal special, avem coșul 
              perfect pentru tine.
            </p>
            <p>
              <strong>Misiunea noastră</strong> este simplă: să aducem bucurie prin cadouri care vorbesc de la 
              sine. Fiecare coș BaskIT este mai mult decât o colecție de produse - este o experiență curată 
              pentru a crea amintiri de neuitat.
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="max-w-5xl mx-auto mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {impactMetrics.map((metric) => (
            <div key={metric.label} className="glass-card rounded-2xl p-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <metric.icon className="h-5 w-5" />
              </div>
              <p className="text-sm uppercase tracking-wide text-muted-foreground">{metric.label}</p>
              <p className="text-4xl font-bold text-primary mt-2">{metric.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{metric.description}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Valorile noastre</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Pasiune</h3>
              <p className="text-sm text-muted-foreground">
                Fiecare coș este creat cu dragoste și atenție la detalii
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Calitate</h3>
              <p className="text-sm text-muted-foreground">
                Selectăm numai produse premium de la furnizori de încredere
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Relații</h3>
              <p className="text-sm text-muted-foreground">
                Construim legături autentice cu clienții și partenerii noștri
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Sustenabilitate</h3>
              <p className="text-sm text-muted-foreground">
                Preferăm producători locali și ambalaje eco-friendly
              </p>
            </div>
          </div>
        </div>

        {/* Roadmap */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Roadmap</p>
            <h2 className="text-3xl font-bold">Evoluție și ce urmează</h2>
          </div>
          <div className="glass-card rounded-3xl p-8 space-y-6">
            {roadmap.map((entry, index) => (
              <div key={entry.year} className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3 min-w-[120px]">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/60 flex items-center justify-center font-bold">
                    {entry.year}
                  </div>
                  <Sparkles className="h-5 w-5 text-accent hidden md:block" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{entry.title}</h3>
                  <p className="text-muted-foreground">{entry.description}</p>
                </div>
                {index < roadmap.length - 1 && <div className="hidden md:block w-px h-10 bg-border" />}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-xl font-semibold mb-4">Vrei să afli mai multe?</p>
          <a
            href="/contact"
            className="text-primary hover:underline text-lg"
          >
            Contactează-ne →
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
