import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

export const UserDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Cont">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Nu ești conectat</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/login")}>Conectează-te</DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/register")}>Creează cont</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const canAccessAdmin = user.role === "ADMIN" || user.role === "CONTENT_MANAGER";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Profil">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <span className="block text-sm font-semibold">{user.name || user.email}</span>
          <span className="text-xs text-muted-foreground capitalize">{user.role.toLowerCase().replace(/_/g, " ")}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/track")}>Comenzile mele</DropdownMenuItem>
        {canAccessAdmin && (
          <DropdownMenuItem onClick={() => navigate("/admin")}>Zona administrativă</DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Deconectare</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

