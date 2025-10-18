import { Heart, Users, Award, Leaf } from "lucide-react";

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
