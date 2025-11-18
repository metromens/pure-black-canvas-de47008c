import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: number;
  isNew?: boolean;
  category: string;
}

const ProductCard = ({ id, name, price, originalPrice, image, discount, isNew, category }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const isFavorite = isInWishlist(id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ id, name, price, image });
  };

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <Card 
      className="group relative overflow-hidden border border-border/40 bg-gradient-card shadow-card hover:shadow-hover transition-all duration-500 hover:-translate-y-2 hover:border-accent/40 cursor-pointer rounded-2xl"
      onClick={handleCardClick}
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-shine opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" 
           style={{ backgroundSize: '200% 100%', animation: 'shimmer 2s ease-in-out infinite' }} />
      
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 rounded-t-2xl">
        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <img
          src={image}
          alt={name}
          className="w-full h-72 object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
          {isNew && (
            <span className="bg-gradient-premium text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-lg shadow-premium backdrop-blur-sm">
              NEW
            </span>
          )}
          {discount && (
            <span className="bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isFavorite) {
              removeFromWishlist(id);
              toast.success("Removed from wishlist");
            } else {
              addToWishlist({ id, name, price, image, category });
              toast.success("Added to wishlist");
            }
          }}
          className="absolute top-4 right-4 p-2.5 rounded-xl bg-background/90 backdrop-blur-md hover:bg-background hover:scale-110 transition-all duration-200 shadow-smooth z-20"
        >
          <Heart
            className={`h-5 w-5 transition-all duration-200 ${
              isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-foreground/60"
            }`}
          />
        </button>

        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/98 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-all duration-300 z-20">
          <Button 
            size="sm" 
            variant="premium"
            className="w-full group/btn h-11 font-semibold shadow-premium"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:scale-125 transition-transform duration-200" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 space-y-2.5 bg-background">
        <h3 className="font-semibold text-base text-foreground line-clamp-1 group-hover:text-accent transition-colors duration-200">
          {name}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold bg-gradient-premium bg-clip-text text-transparent">₹{price}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{originalPrice}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
