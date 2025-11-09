import { UserDropdown } from "@/components/ui/UserDropdown";
import { ShoppingCart, Search, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export const Header = () => {
  const [cartCount] = useState(0);
  const navigate = useNavigate();
  

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              BaskIT
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/catalog" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Coșuri Cadou
            </Link>
            <Link to="/catalog?category=craciun" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Crăciun
            </Link>
            <Link to="/catalog?category=valentines" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Valentine's
            </Link>
            <Link to="/catalog?category=corporate" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Corporate
            </Link>
          </nav>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Caută coșuri cadou..."
                className="pl-10 bg-secondary/50"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <UserDropdown />
            
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Caută coșuri cadou..."
              className="pl-10 bg-secondary/50"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
