import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { products, categories } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

const Catalog = () => {
  const [priceRange, setPriceRange] = useState([0, 400]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const filteredProducts = products.filter(product => {
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesCategory = !selectedCategory || selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesPrice && matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setPriceRange([0, 400]);
    setSelectedCategory("all");
    setSearchQuery("");
  };

  const hasActiveFilters = priceRange[0] > 0 || priceRange[1] < 400 || (selectedCategory && selectedCategory !== "all") || searchQuery;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Coșuri Cadou</h1>
          <p className="text-muted-foreground">
            Descoperă {products.length} coșuri cadou unice pentru orice ocazie
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
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Toate categoriile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toate categoriile</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
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
                  max={400}
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
                  {["Crăciun", "Valentine's Day", "Naștere", "Corporate"].map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => setSelectedCategory(tag)}
                    >
                      {tag}
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
            {sortedProducts.length > 0 ? (
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
