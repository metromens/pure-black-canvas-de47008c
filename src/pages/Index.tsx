import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, Gift } from "lucide-react";
import { useFilter } from "@/contexts/FilterContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { selectedCategory, setSelectedCategory } = useFilter();
  const navigate = useNavigate();

  // Mock product data
  const newArrivals = [
    {
      id: "product-1",
      name: "Premium Cotton Shirt",
      price: 1299,
      originalPrice: 1999,
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500",
      discount: 35,
      isNew: true,
      category: "Shirts",
    },
    {
      id: "product-2",
      name: "Slim Fit Denim Jeans",
      price: 1499,
      originalPrice: 2499,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
      discount: 40,
      isNew: true,
      category: "Jeans",
    },
    {
      id: "product-3",
      name: "Casual T-Shirt",
      price: 599,
      originalPrice: 999,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      discount: 40,
      isNew: true,
      category: "T-Shirts",
    },
    {
      id: "product-4",
      name: "Leather Formal Shoes",
      price: 2499,
      originalPrice: 3999,
      image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500",
      discount: 38,
      isNew: true,
      category: "Footwear",
    },
  ];

  const trendingProducts = [
    {
      id: "product-5",
      name: "Designer Polo Shirt",
      price: 1799,
      image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500",
      isNew: false,
      category: "Shirts",
    },
    {
      id: "product-6",
      name: "Stretch Chinos",
      price: 1299,
      image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500",
      isNew: false,
      category: "Jeans",
    },
    {
      id: "product-7",
      name: "Sports Watch",
      price: 3999,
      image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500",
      isNew: false,
      category: "Accessories",
    },
    {
      id: "product-8",
      name: "Leather Wallet",
      price: 899,
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
      isNew: false,
      category: "Accessories",
    },
  ];

  const allProducts = [...newArrivals, ...trendingProducts];
  const filteredProducts = selectedCategory
    ? allProducts.filter((product) => product.category === selectedCategory)
    : allProducts;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      {/* New Collections Section */}
      <section id="new-arrivals" className="container mx-auto px-4 py-16 scroll-mt-20">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <h2 className="text-3xl font-bold">New Collections</h2>
            </div>
            <p className="text-muted-foreground">Fresh styles just landed</p>
          </div>
          <Button 
            variant="ghost" 
            className="group"
            onClick={() => navigate("/products")}
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product, index) => (
            <div key={product.id} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </section>

      {/* Festive Offers Banner */}
      <section id="festive-offers" className="container mx-auto px-4 py-8 scroll-mt-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-premium p-8 md:p-12 text-accent-foreground shadow-premium animate-fade-in">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Gift className="h-6 w-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">Limited Time</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Festive Sale is Here!
            </h2>
            <p className="text-lg mb-6 text-accent-foreground/90">
              Get up to 40% off on all premium collections. Plus, extra 10% off on prepaid orders.
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="shadow-lg"
              onClick={() => document.getElementById("new-arrivals")?.scrollIntoView({ behavior: "smooth" })}
            >
              Shop Festive Collection
            </Button>
          </div>
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute right-20 bottom-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        </div>
      </section>


      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-card rounded-xl p-6 shadow-card text-center animate-fade-in">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Quality Assured</h3>
            <p className="text-sm text-muted-foreground">100% authentic products</p>
          </div>
          <div className="bg-gradient-card rounded-xl p-6 shadow-card text-center animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
            <p className="text-sm text-muted-foreground">Safe & encrypted transactions</p>
          </div>
          <div className="bg-gradient-card rounded-xl p-6 shadow-card text-center animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Easy Returns</h3>
            <p className="text-sm text-muted-foreground">7-day return policy</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
