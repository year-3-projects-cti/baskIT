import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { useBaskets } from "@/hooks/useBaskets";
import { slugify } from "@/lib/utils";

const defaultPriceRange: [number, number] = [0, 400];

const Catalog = () => {
  const { data: baskets = [], isLoading } = useBaskets();
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState<[number, number]>(defaultPriceRange);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") ?? "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const maxPrice = useMemo(() => {
    if (!baskets.length) return defaultPriceRange[1];
    const highest = Math.max(...baskets.map((b) => b.price));
    return Math.ceil(highest / 50) * 50;
  }, [baskets]);

  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  const categories = useMemo(() => {
    const map = new Map<string, { count: number; label: string }>();
    baskets.forEach((basket) => {
      const slug = slugify(basket.category);
      map.set(slug, { count: (map.get(slug)?.count || 0) + 1, label: basket.category });
    });
    return Array.from(map.entries()).map(([slug, info]) => ({
      slug,
      name: info.label,
      count: info.count,
    }));
  }, [baskets]);

  const filteredProducts = useMemo(() => {
    return baskets.filter((product) => {
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesCategory =
        !selectedCategory || selectedCategory === "all" || slugify(product.category) === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.prompt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPrice && matchesCategory && matchesSearch;
    });
  }, [baskets, priceRange, selectedCategory, searchQuery]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortBy]);

  const clearFilters = () => {
    setPriceRange([0, maxPrice]);
    setSelectedCategory("all");
    setSearchQuery("");
    setSearchParams({});
  };

  const hasActiveFilters =
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice ||
    (selectedCategory && selectedCategory !== "all") ||
    Boolean(searchQuery);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value === "all") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      searchParams.set("category", value);
      setSearchParams(searchParams);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Coșuri Cadou</h1>
          <p className="text-muted-foreground">
            Descoperă {baskets.length} coșuri cadou unice pentru orice ocazie
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtre
                </h2>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Resetează
                  </Button>
                )}
              </div>

              {/* Search */}
              <div className="space-y-2">
                <Label>Caută</Label>
                <Input
                  placeholder="Nume sau cuvânt cheie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <Label>Categorie</Label>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Toate categoriile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toate categoriile</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.name} ({cat.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <Label>Preț (RON)</Label>
                <Slider
                  min={0}
                  max={maxPrice}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="py-4"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{priceRange[0]} RON</span>
                  <span className="text-muted-foreground">{priceRange[1]} RON</span>
                </div>
              </div>

              {/* Occasion Tags */}
              <div className="space-y-2">
                <Label>Ocazii Populare</Label>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 6).map((cat) => (
                    <Badge
                      key={cat.slug}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => handleCategoryChange(cat.slug)}
                    >
                      {cat.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort & Results Count */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <p className="text-muted-foreground">
                {sortedProducts.length} {sortedProducts.length === 1 ? 'produs găsit' : 'produse găsite'}
              </p>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Sortează:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Recomandate</SelectItem>
                    <SelectItem value="price-asc">Preț crescător</SelectItem>
                    <SelectItem value="price-desc">Preț descrescător</SelectItem>
                    <SelectItem value="name">Nume (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products */}
            {isLoading ? (
              <div className="text-muted-foreground py-16">Se încarcă produsele...</div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">
                  Nu am găsit produse care să corespundă criteriilor tale.
                </p>
                <Button onClick={clearFilters}>Resetează filtrele</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
