import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-model.jpg";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-hero overflow-hidden">
      {/* Background mesh gradient */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-slide-in">
            <div className="inline-block">
              <span className="text-xs font-bold tracking-wider text-accent uppercase bg-gradient-to-r from-accent/15 to-accent/5 px-4 py-2 rounded-full border border-accent/20 shadow-smooth">
                ✨ New Collection 2025
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              Elevate Your
              <span className="block bg-gradient-premium bg-clip-text text-transparent drop-shadow-sm mt-2">
                Style Statement
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              Discover the finest collection of premium men's fashion. From classic elegance to modern trends.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                size="lg" 
                variant="premium"
                className="group relative overflow-hidden h-14 px-8 text-base font-semibold shadow-premium hover:shadow-glow transition-all duration-300"
                onClick={() => navigate("/products")}
              >
                <span className="relative z-10 flex items-center">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
            <div className="flex gap-12 pt-8">
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold bg-gradient-premium bg-clip-text text-transparent">500+</div>
                <div className="text-sm text-muted-foreground mt-1">Products</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold bg-gradient-premium bg-clip-text text-transparent">50+</div>
                <div className="text-sm text-muted-foreground mt-1">Brands</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold bg-gradient-premium bg-clip-text text-transparent">1000+</div>
                <div className="text-sm text-muted-foreground mt-1">Happy Customers</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-scale-in">
            <div className="absolute inset-0 bg-gradient-premium opacity-25 blur-[120px] rounded-full scale-110" />
            <div className="relative rounded-3xl overflow-hidden shadow-premium hover:shadow-glow transition-all duration-500 ring-1 ring-accent/10 group">
              <div className="absolute inset-0 bg-gradient-shine opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-[shimmer_2s_ease-in-out_infinite]" 
                   style={{ backgroundSize: '200% 100%' }} />
              <img
                src={heroImage}
                alt="Stylish men's fashion model"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-br from-accent via-accent to-accent/90 text-accent-foreground px-6 py-4 rounded-2xl shadow-premium backdrop-blur-sm animate-float border border-background/20">
              <div className="text-sm font-bold tracking-wide">Up to 40% OFF</div>
              <div className="text-xs opacity-90 mt-0.5">Limited Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced decorative elements */}
      <div className="absolute top-24 left-12 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-32 right-16 w-48 h-48 bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
    </section>
  );
};

export default Hero;
