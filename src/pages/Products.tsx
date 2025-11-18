import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useFilter } from "@/contexts/FilterContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  sizes: string[];
  colors: string[];
  brand: string;
};

const allProducts: Product[] = [
  // Shirts
  {
    id: 1,
    name: "Classic Cotton Shirt",
    category: "Shirts",
    price: 1299,
    originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80",
    rating: 4.5,
    reviews: 128,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Blue", "Black"],
    brand: "Metro Classic",
  },
  {
    id: 2,
    name: "Premium Formal Shirt",
    category: "Shirts",
    price: 1799,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80",
    rating: 4.7,
    reviews: 95,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["White", "Light Blue", "Pink"],
    brand: "Metro Premium",
  },
  {
    id: 3,
    name: "Casual Check Shirt",
    category: "Shirts",
    price: 999,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80",
    rating: 4.3,
    reviews: 76,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Red", "Blue", "Green"],
    brand: "Metro Casual",
  },
  {
    id: 4,
    name: "Slim Fit Shirt",
    category: "Shirts",
    price: 1499,
    originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80",
    rating: 4.6,
    reviews: 112,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy", "White"],
    brand: "Metro Fit",
  },
  // T-Shirts
  {
    id: 5,
    name: "Basic Cotton T-Shirt",
    category: "T-Shirts",
    price: 499,
    originalPrice: 799,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    rating: 4.4,
    reviews: 203,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Navy", "Red"],
    brand: "Metro Basic",
  },
  {
    id: 6,
    name: "Graphic Print T-Shirt",
    category: "T-Shirts",
    price: 699,
    originalPrice: 999,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80",
    rating: 4.5,
    reviews: 156,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Navy"],
    brand: "Metro Graphics",
  },
  {
    id: 7,
    name: "V-Neck T-Shirt",
    category: "T-Shirts",
    price: 599,
    originalPrice: 899,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    rating: 4.3,
    reviews: 87,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Grey"],
    brand: "Metro Casual",
  },
  // Pants
  {
    id: 8,
    name: "Formal Trousers",
    category: "Pants",
    price: 1599,
    originalPrice: 2299,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80",
    rating: 4.6,
    reviews: 142,
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Black", "Navy", "Grey", "Beige"],
    brand: "Metro Formal",
  },
  {
    id: 9,
    name: "Casual Chinos",
    category: "Pants",
    price: 1299,
    originalPrice: 1899,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80",
    rating: 4.5,
    reviews: 178,
    sizes: ["30", "32", "34", "36"],
    colors: ["Beige", "Navy", "Olive", "Black"],
    brand: "Metro Casual",
  },
  {
    id: 10,
    name: "Cargo Pants",
    category: "Pants",
    price: 1499,
    originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80",
    rating: 4.4,
    reviews: 95,
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Black", "Olive", "Beige"],
    brand: "Metro Adventure",
  },
  // Shorts
  {
    id: 11,
    name: "Cotton Shorts",
    category: "Shorts",
    price: 799,
    originalPrice: 1199,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80",
    rating: 4.4,
    reviews: 134,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Black", "Grey", "Beige"],
    brand: "Metro Summer",
  },
  {
    id: 12,
    name: "Cargo Shorts",
    category: "Shorts",
    price: 999,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80",
    rating: 4.3,
    reviews: 89,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Black", "Olive", "Beige"],
    brand: "Metro Adventure",
  },
  {
    id: 13,
    name: "Denim Shorts",
    category: "Shorts",
    price: 1099,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80",
    rating: 4.5,
    reviews: 112,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Black"],
    brand: "Metro Denim",
  },
  // Footwears
  {
    id: 14,
    name: "Casual Sneakers",
    category: "Footwears",
    price: 2499,
    originalPrice: 3499,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    rating: 4.7,
    reviews: 234,
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["White", "Black", "Navy"],
    brand: "Metro Sports",
  },
  {
    id: 15,
    name: "Formal Shoes",
    category: "Footwears",
    price: 2999,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500&q=80",
    rating: 4.6,
    reviews: 167,
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Black", "Brown"],
    brand: "Metro Formal",
  },
  {
    id: 16,
    name: "Sports Shoes",
    category: "Footwears",
    price: 2799,
    originalPrice: 3799,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    rating: 4.8,
    reviews: 289,
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["Black", "White", "Red"],
    brand: "Metro Sports",
  },
  // Accessories
  {
    id: 17,
    name: "Leather Belt",
    category: "Accessories",
    price: 699,
    originalPrice: 999,
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583bd?w=500&q=80",
    rating: 4.5,
    reviews: 145,
    sizes: ["32", "34", "36", "38"],
    colors: ["Black", "Brown"],
    brand: "Metro Leather",
  },
  {
    id: 18,
    name: "Wallet",
    category: "Accessories",
    price: 899,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80",
    rating: 4.6,
    reviews: 198,
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Navy"],
    brand: "Metro Leather",
  },
  {
    id: 19,
    name: "Watch",
    category: "Accessories",
    price: 1999,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&q=80",
    rating: 4.7,
    reviews: 267,
    sizes: ["One Size"],
    colors: ["Black", "Silver", "Gold"],
    brand: "Metro Time",
  },
  {
    id: 20,
    name: "Sunglasses",
    category: "Accessories",
    price: 1299,
    originalPrice: 1899,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
    rating: 4.4,
    reviews: 134,
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Blue"],
    brand: "Metro Vision",
  },
];

const Products = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get("category") || "All";
  const { searchQuery } = useFilter();

  const [sortBy, setSortBy] = useState("recommended");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [showFilters, setShowFilters] = useState(false);

  const sizes = ["S", "M", "L", "XL", "XXL", "30", "32", "34", "36", "38", "7", "8", "9", "10", "11", "12", "One Size"];
  const colors = ["White", "Black", "Blue", "Red", "Green", "Pink", "Beige", "Navy", "Grey", "Olive", "Brown", "Silver", "Gold"];
  const brands = ["Metro Classic", "Metro Premium", "Metro Casual", "Metro Fit", "Metro Summer", "Metro Denim", "Metro Basic", "Metro Graphics", "Metro Formal", "Metro Adventure", "Metro Sports", "Metro Leather", "Metro Time", "Metro Vision"];
  const priceRanges = [
    { label: "All", value: "all" },
    { label: "Under ₹1000", value: "0-1000" },
    { label: "₹1000 - ₹1500", value: "1000-1500" },
    { label: "₹1500 - ₹2000", value: "1500-2000" },
    { label: "Above ₹2000", value: "2000-999999" },
  ];

  useEffect(() => {
    let products = [...allProducts];

    // Filter by search query
    if (searchQuery.trim()) {
      products = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (category !== "All") {
      products = products.filter((p) => p.category === category);
    }

    // Filter by size
    if (selectedSizes.length > 0) {
      products = products.filter((p) =>
        p.sizes.some((s) => selectedSizes.includes(s))
      );
    }

    // Filter by color
    if (selectedColors.length > 0) {
      products = products.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c))
      );
    }

    // Filter by brand
    if (selectedBrands.length > 0) {
      products = products.filter((p) => selectedBrands.includes(p.brand));
    }

    // Filter by price range
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      products = products.filter((p) => p.price >= min && p.price <= max);
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        products.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
      case "new":
        products.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    setFilteredProducts(products);
  }, [category, sortBy, selectedSizes, selectedColors, selectedBrands, priceRange, searchQuery]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setPriceRange("all");
  };

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Clear Filters */}
      {(selectedSizes.length > 0 ||
        selectedColors.length > 0 ||
        selectedBrands.length > 0 ||
        priceRange !== "all") && (
        <Button variant="outline" className="w-full" onClick={clearAllFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}

      {/* Price Range */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b">
          <span className="font-semibold">Price</span>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-3">
          <RadioGroup value={priceRange} onValueChange={setPriceRange}>
            {priceRanges.map((range) => (
              <div key={range.value} className="flex items-center space-x-2">
                <RadioGroupItem value={range.value} id={`price-${range.value}`} />
                <Label htmlFor={`price-${range.value}`}>{range.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>

      {/* Sizes */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b">
          <span className="font-semibold">Size</span>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <Button
                key={size}
                variant={selectedSizes.includes(size) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleSize(size)}
                className="w-12"
              >
                {size}
              </Button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Colors */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b">
          <span className="font-semibold">Color</span>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-3">
          {colors.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                checked={selectedColors.includes(color)}
                onCheckedChange={() => toggleColor(color)}
              />
              <Label htmlFor={`color-${color}`}>{color}</Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Brands */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b">
          <span className="font-semibold">Brand</span>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-3">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <Label htmlFor={`brand-${brand}`}>{brand}</Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-4">
          <button onClick={() => navigate("/")} className="hover:text-foreground">
            Home
          </button>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">{category}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{category}</h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} Products
            </p>
          </div>

          {/* Sort and Filter */}
          <div className="flex items-center gap-2">
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filter
                  {(selectedSizes.length > 0 ||
                    selectedColors.length > 0 ||
                    selectedBrands.length > 0 ||
                    priceRange !== "all") && (
                    <span className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {selectedSizes.length + selectedColors.length + selectedBrands.length + (priceRange !== "all" ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSection />
                </div>
              </SheetContent>
            </Sheet>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm bg-background lg:px-4"
            >
              <option value="recommended">Recommended</option>
              <option value="new">What's New</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-8">
          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id.toString()}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    image={product.image}
                    category={product.category}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground mb-4">
                  No products found matching your filters
                </p>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
