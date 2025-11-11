import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { BasketSummary } from "@/types/basket";

interface ProductCardProps {
  product: BasketSummary;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const lowStock = product.stock < 5;
  const cover = product.heroImage;

  return (
    <Link to={`/product/${product.slug}`}>
      <div className="glass-card rounded-2xl overflow-hidden hover-lift group">
        {/* Image Container */}
        <div className="relative aspect-square bg-secondary/30 overflow-hidden">
          {cover ? (
            <img
              src={cover}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              🧺
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {lowStock && (
              <Badge variant="outline" className="bg-card/90">
                Stoc redus
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {product.category}
            </p>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
              {product.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {product.prompt}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <p className="text-xl font-bold text-primary">
                {product.price} RON
              </p>
            </div>

            <Button
              size="icon"
              className="rounded-full shadow-soft hover:shadow-medium transition-all"
              onClick={(e) => {
                e.preventDefault();
                // Add to cart logic
              }}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};
