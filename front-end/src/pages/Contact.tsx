import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mesajul tău a fost trimis!", {
      description: "Îți vom răspunde în maximum 24 de ore.",
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-5xl font-bold mb-6">Contactează-ne</h1>
          <p className="text-xl text-muted-foreground">
            Avem întrebări? Suntem aici să te ajutăm!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Trimite-ne un mesaj</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prenume *</Label>
                  <Input id="firstName" required />
                </div>
                <div>
                  <Label htmlFor="lastName">Nume *</Label>
                  <Input id="lastName" required />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" type="tel" />
              </div>
              <div>
                <Label htmlFor="subject">Subiect *</Label>
                <Input id="subject" required />
              </div>
              <div>
                <Label htmlFor="message">Mesaj *</Label>
                <Textarea id="message" rows={5} required />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Trimite mesajul
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a href="mailto:contact@baskit.ro" className="text-muted-foreground hover:text-primary">
                    contact@baskit.ro
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    Răspundem în maximum 24 de ore
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Telefon</h3>
                  <a href="tel:+40721123456" className="text-muted-foreground hover:text-primary">
                    +40 721 123 456
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    Luni - Vineri, 09:00 - 18:00
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Adresă</h3>
                  <p className="text-muted-foreground">
                    Str. Exemplu, nr. 123<br />
                    București, sector 1<br />
                    România
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Program</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Luni - Vineri: 09:00 - 18:00</p>
                    <p>Sâmbătă: 10:00 - 14:00</p>
                    <p>Duminică: Închis</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
