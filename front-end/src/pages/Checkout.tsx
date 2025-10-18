import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Truck, CheckCircle } from "lucide-react";

const romanianCounties = [
  "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani", "Brașov",
  "Brăila", "București", "Buzău", "Caraș-Severin", "Călărași", "Cluj", "Constanța",
  "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu", "Gorj", "Harghita", "Hunedoara",
  "Ialomița", "Iași", "Ilfov", "Maramureș", "Mehedinți", "Mureș", "Neamț", "Olt",
  "Prahova", "Satu Mare", "Sălaj", "Sibiu", "Suceava", "Teleorman", "Timiș",
  "Tulcea", "Vaslui", "Vâlcea", "Vrancea"
];

const Checkout = () => {
  const [shippingMethod, setShippingMethod] = useState("standard");

  const subtotal = 799.97;
  const shipping = shippingMethod === "express" ? 35.00 : 25.00;
  const vat = (subtotal + shipping) * 0.19;
  const total = subtotal + shipping + vat;

  return (
    <div className="min-h-screen py-12 bg-secondary/20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Finalizare comandă</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">Date de contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prenume *</Label>
                  <Input id="firstName" placeholder="Prenumele tău" required />
                </div>
                <div>
                  <Label htmlFor="lastName">Nume *</Label>
                  <Input id="lastName" placeholder="Numele tău" required />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="exemplu@email.ro" required />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon *</Label>
                  <Input id="phone" type="tel" placeholder="+40 7XX XXX XXX" required />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">Adresă de livrare</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Adresă (stradă, număr, bloc, etc.) *</Label>
                    <Input id="address" placeholder="Str. Exemplu, nr. 123, bl. A, sc. 1, et. 2, ap. 4" required />
                  </div>
                  <div>
                    <Label htmlFor="city">Oraș *</Label>
                    <Input id="city" placeholder="București" required />
                  </div>
                  <div>
                    <Label htmlFor="county">Județ *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează județul" />
                      </SelectTrigger>
                      <SelectContent>
                        {romanianCounties.map((county) => (
                          <SelectItem key={county} value={county.toLowerCase()}>
                            {county}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Cod poștal *</Label>
                    <Input id="postalCode" placeholder="012345" required />
                  </div>
                  <div>
                    <Label htmlFor="deliveryNotes">Indicații suplimentare (opțional)</Label>
                    <Textarea
                      id="deliveryNotes"
                      placeholder="Detalii pentru curier (interfon, etc.)"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Company Details (Optional) */}
                <div className="pt-4 border-t">
                  <Label className="mb-3 block">Persoană juridică (opțional)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Nume companie</Label>
                      <Input id="companyName" placeholder="S.C. Exemplu S.R.L." />
                    </div>
                    <div>
                      <Label htmlFor="cui">CUI</Label>
                      <Input id="cui" placeholder="RO12345678" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Truck className="h-6 w-6 mr-2" />
                Metodă de livrare
              </h2>
              <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                <div className="flex items-center space-x-3 p-4 border rounded-xl mb-3 cursor-pointer hover:bg-secondary/50 transition-colors">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Livrare standard</p>
                        <p className="text-sm text-muted-foreground">24-48 ore lucrătoare</p>
                      </div>
                      <p className="font-bold">25.00 RON</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                  <RadioGroupItem value="express" id="express" />
                  <Label htmlFor="express" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Livrare express</p>
                        <p className="text-sm text-muted-foreground">12-24 ore (orașe mari)</p>
                      </div>
                      <p className="font-bold">35.00 RON</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Gift Note */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4">Mesaj cadou (opțional)</h2>
              <Textarea
                placeholder="Scrie un mesaj personalizat pentru destinatar..."
                rows={4}
              />
            </div>

            {/* Payment Method */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <CreditCard className="h-6 w-6 mr-2" />
                Plată securizată
              </h2>
              <div className="bg-secondary/30 rounded-xl p-4 mb-4">
                <p className="text-sm text-muted-foreground">
                  Plata este procesată securizat prin Stripe. Acceptăm carduri Visa, Mastercard și alte metode de plată.
                </p>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm">
                  Accept{" "}
                  <a href="/terms" className="text-primary hover:underline">
                    Termenii și condițiile
                  </a>{" "}
                  și{" "}
                  <a href="/privacy" className="text-primary hover:underline">
                    Politica de confidențialitate
                  </a>
                </Label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Rezumat comandă</h2>

              {/* Cart Items Preview */}
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-secondary/30 flex items-center justify-center text-xl">
                    🧺
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Crăciun Clasic</p>
                    <p className="text-xs text-muted-foreground">Qty: 2</p>
                  </div>
                  <p className="font-semibold">499.98 RON</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-secondary/30 flex items-center justify-center text-xl">
                    🧺
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Love & Roses</p>
                    <p className="text-xs text-muted-foreground">Qty: 1</p>
                  </div>
                  <p className="font-semibold">299.99 RON</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
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

                <div className="flex justify-between text-lg pt-2">
                  <span className="font-bold">Total de plată</span>
                  <span className="font-bold text-primary text-2xl">
                    {total.toFixed(2)} RON
                  </span>
                </div>
              </div>

              <Button size="lg" className="w-full shadow-strong mb-4">
                <CheckCircle className="h-5 w-5 mr-2" />
                Plasează comanda
              </Button>

              <div className="space-y-2 text-xs text-muted-foreground text-center">
                <p className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-3 w-3" />
                  Plată 100% securizată
                </p>
                <p>Vei primi email de confirmare imediat după plasarea comenzii</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
