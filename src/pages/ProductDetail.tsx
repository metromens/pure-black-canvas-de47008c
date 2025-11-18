import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Share2, Star, ChevronLeft, ChevronRight, Truck, RefreshCcw, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  images: string[];
  rating: number;
  reviews: number;
  sizes: string[];
  colors: { name: string; hex: string }[];
  brand: string;
  description: string;
  features: string[];
  specifications: { label: string; value: string }[];
  inStock: boolean;
};

const productData: Record<string, Product> = {
  "1": {
    id: 1,
    name: "Classic Cotton Shirt",
    category: "Shirts",
    price: 1299,
    originalPrice: 1999,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    ],
    rating: 4.5,
    reviews: 128,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Blue", hex: "#3B82F6" },
      { name: "Black", hex: "#000000" },
    ],
    brand: "Metro Classic",
    description: "Premium quality cotton shirt perfect for formal and casual occasions. Crafted with attention to detail and superior fabric quality.",
    features: [
      "100% Premium Cotton",
      "Wrinkle-resistant finish",
      "Moisture-wicking technology",
      "Easy care - Machine washable",
      "Comfortable full-day wear",
    ],
    specifications: [
      { label: "Fabric", value: "100% Cotton" },
      { label: "Pattern", value: "Solid" },
      { label: "Sleeve", value: "Full Sleeve" },
      { label: "Fit", value: "Regular Fit" },
      { label: "Occasion", value: "Formal, Casual" },
      { label: "Wash Care", value: "Machine Wash" },
    ],
    inStock: true,
  },
};

const relatedProducts = [
  {
    id: "2",
    name: "Premium Formal Shirt",
    price: 1799,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80",
    category: "Shirts",
  },
  {
    id: "3",
    name: "Casual Check Shirt",
    price: 999,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80",
    category: "Shirts",
  },
  {
    id: "4",
    name: "Slim Fit Shirt",
    price: 1499,
    originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80",
    category: "Shirts",
  },
  {
    id: "5",
    name: "Linen Summer Shirt",
    price: 1599,
    originalPrice: 2199,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80",
    category: "Shirts",
  },
];

const reviews = [
  {
    id: 1,
    name: "Rajesh Kumar",
    rating: 5,
    date: "2 weeks ago",
    comment: "Excellent quality! The fabric is very comfortable and fits perfectly. Highly recommended!",
    verified: true,
  },
  {
    id: 2,
    name: "Amit Sharma",
    rating: 4,
    date: "1 month ago",
    comment: "Good shirt for the price. Material is nice but sizing runs slightly large.",
    verified: true,
  },
  {
    id: 3,
    name: "Vikram Singh",
    rating: 5,
    date: "1 month ago",
    comment: "Perfect for office wear. Very professional look and comfortable for all-day wear.",
    verified: true,
  },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = productData[id || "1"] || productData["1"];
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isFavorite, setIsFavorite] = useState(false);

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: selectedColor.name,
      size: selectedSize,
    });
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    handleAddToCart();
    // Navigate to cart or checkout
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <button onClick={() => navigate("/")} className="hover:text-foreground">
            Home
          </button>
          <span className="mx-2">/</span>
          <button onClick={() => navigate(`/products?category=${product.category}`)} className="hover:text-foreground">
            {product.category}
          </button>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-muted rounded-xl overflow-hidden group">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Wishlist & Share */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                >
                  <Heart
                    className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-foreground/60"}`}
                  />
                </button>
                <button className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors">
                  <Share2 className="h-5 w-5 text-foreground/60" />
                </button>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? "border-primary" : "border-transparent hover:border-muted-foreground/30"
                  }`}
                >
                  <img src={image} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Name */}
            <div>
              <p className="text-accent font-semibold mb-2">{product.brand}</p>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded">
                  <span className="font-semibold">{product.rating}</span>
                  <Star className="h-4 w-4 fill-accent text-accent" />
                </div>
                <span className="text-muted-foreground">
                  {product.reviews} reviews
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold">₹{product.price}</span>
                <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice}</span>
                <Badge variant="destructive" className="text-sm">{discount}% OFF</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
            </div>

            <Separator />

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold mb-3">
                Select Color: <span className="text-accent">{selectedColor.name}</span>
              </h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${
                      selectedColor.name === color.name ? "border-primary ring-2 ring-primary/30" : "border-muted"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Select Size</h3>
                <button className="text-sm text-accent hover:underline">Size Guide</button>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-lg border-2 font-semibold transition-all ${
                      selectedSize === size
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-muted hover:border-muted-foreground/50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button onClick={handleAddToCart} variant="outline" className="flex-1" size="lg">
                  Add to Cart
                </Button>
                <Button onClick={handleBuyNow} className="flex-1" size="lg">
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-accent/10">
                  <Truck className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Free Delivery</p>
                  <p className="text-xs text-muted-foreground">On orders above ₹999</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-accent/10">
                  <RefreshCcw className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">7 days return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-accent/10">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold">100% Authentic</p>
                  <p className="text-xs text-muted-foreground">Quality assured</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="details"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Product Details
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Reviews ({product.reviews})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6 space-y-4">
              <p className="text-muted-foreground">{product.description}</p>
              <div>
                <h4 className="font-semibold mb-3">Key Features:</h4>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex py-3 border-b">
                    <span className="font-semibold w-40">{spec.label}</span>
                    <span className="text-muted-foreground">{spec.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6 space-y-6">
              {/* Rating Summary */}
              <div className="flex items-start gap-8 p-6 bg-muted/30 rounded-xl">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">{product.rating}</div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{product.reviews} Reviews</p>
                </div>
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const percentage = star === 5 ? 65 : star === 4 ? 25 : star === 3 ? 8 : 2;
                    return (
                      <div key={star} className="flex items-center gap-3 mb-2">
                        <span className="text-sm w-8">{star}★</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12">{percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{review.name}</span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating ? "fill-accent text-accent" : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Similar Products */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.image}
                category={product.category}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
