import { UserDropdown } from "@/components/ui/UserDropdown";
import { ShoppingCart, Search, Menu, Sparkles, Shield, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

const navLinks = [
  { label: "Coșuri Cadou", to: "/catalog" },
  { label: "Crăciun", to: "/catalog?category=craciun" },
  { label: "Valentine's", to: "/catalog?category=valentines" },
  { label: "Corporate", to: "/catalog?category=corporate" },
];

export const Header = () => {
  const [cartCount] = useState(0);
  const navigate = useNavigate();
  const promoDetails = useMemo(
    () => [
      { icon: <Sparkles className="h-3.5 w-3.5" />, text: "Colecții noi în fiecare lună" },
      { icon: <Shield className="h-3.5 w-3.5" />, text: "Plată sigură & protejată" },
      { icon: <PhoneCall className="h-3.5 w-3.5" />, text: "Consultanță cadouri 09-18" },
    ],
    []
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-card/85 backdrop-blur-xl shadow-soft supports-[backdrop-filter]:bg-card/70">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-16 left-0 h-40 w-40 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -bottom-16 right-10 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        <div className="hidden md:flex h-10 items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground/80">
          <span>Livrări rapide 24-48h în toată țara</span>
          <div className="flex items-center gap-6 text-[11px] tracking-normal normal-case">
            {promoDetails.map(({ icon, text }) => (
              <span key={text} className="flex items-center gap-2 text-muted-foreground">
                {icon}
                {text}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 py-3 md:flex-row md:items-center md:justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light text-white shadow-medium">
              <span className="text-xl font-black">BI</span>
              <div className="absolute inset-0 rounded-2xl border border-white/30" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-wider text-muted-foreground">Bask IT Up!</span>
              <span className="text-sm text-muted-foreground">Cadouri atent alese</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2 rounded-full border border-white/20 bg-white/70 px-1 py-1 text-sm shadow-soft backdrop-blur">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-full px-4 py-1.5 font-medium text-muted-foreground hover:bg-gradient-hero hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search + CTA */}
          <div className="flex flex-1 items-center gap-3 md:max-w-md">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Caută coșul perfect..."
                className="h-11 rounded-full border-none bg-secondary/60 pl-12 text-sm shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>
            <Button asChild className="hidden md:inline-flex rounded-full bg-gradient-hero px-6 shadow-medium hover:opacity-90">
              <Link to="/catalog">Vezi catalogul</Link>
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <UserDropdown />
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full border border-transparent hover:border-primary/30"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden space-y-3 pb-4">
          <div className="flex flex-wrap gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-full border border-white/30 px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Caută coșuri cadou..."
              className="h-11 rounded-full border-none bg-secondary/60 pl-12 text-sm shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
