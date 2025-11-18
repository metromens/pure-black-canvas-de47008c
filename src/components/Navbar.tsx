import { Search, Menu, ChevronDown, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CartDrawer from "./CartDrawer";
import WishlistDrawer from "./WishlistDrawer";
import AuthDialog from "./AuthDialog";
import { useFilter } from "@/contexts/FilterContext";
import { useAuth } from "@/contexts/AuthContext";
import metroLogo from "@/assets/metro-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useFilter();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const categories = ["Shirts", "T-Shirts", "Pants", "Shorts"];
  
  const clothingSubmenu = [
    { name: "All Clothing", category: "All" },
    { name: "New In Shirts", category: "Shirts" },
    { name: "New In T-Shirts", category: "T-Shirts" },
    { name: "New In Pants", category: "Pants" },
    { name: "New In Shorts", category: "Shorts" },
  ];

  const categorySubmenus: Record<string, { name: string; category: string }[]> = {
    "Shirts": [
      { name: "All Shirts", category: "Shirts" },
      { name: "Formal Shirts", category: "Shirts" },
      { name: "Casual Shirts", category: "Shirts" },
      { name: "Party Shirts", category: "Shirts" },
      { name: "Printed Shirts", category: "Shirts" },
    ],
    "T-Shirts": [
      { name: "All T-Shirts", category: "T-Shirts" },
      { name: "Round Neck", category: "T-Shirts" },
      { name: "V-Neck", category: "T-Shirts" },
      { name: "Polo T-Shirts", category: "T-Shirts" },
      { name: "Graphic Tees", category: "T-Shirts" },
    ],
    "Pants": [
      { name: "All Pants", category: "Pants" },
      { name: "Jeans", category: "Pants" },
      { name: "Chinos", category: "Pants" },
      { name: "Cargo Pants", category: "Pants" },
      { name: "Formal Pants", category: "Pants" },
    ],
    "Shorts": [
      { name: "All Shorts", category: "Shorts" },
      { name: "Denim Shorts", category: "Shorts" },
      { name: "Cargo Shorts", category: "Shorts" },
      { name: "Sports Shorts", category: "Shorts" },
      { name: "Casual Shorts", category: "Shorts" },
    ],
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(""); // Clear search when changing category
    navigate(`/products?category=${category}`);
    setIsMenuOpen(false);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (location.pathname !== "/products") {
      navigate("/products");
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/80 border-b border-border/30 shadow-smooth">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button onClick={() => navigate("/")} className="flex items-center space-x-3 group">
            <img 
              src={metroLogo} 
              alt="Metro Men's Logo" 
              className="h-10 w-10 object-contain group-hover:scale-105 transition-transform duration-200"
            />
            <div className="flex items-center space-x-2.5">
              <div className="text-2xl font-bold bg-gradient-premium bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200">
                Metro Men's
              </div>
              <span className="text-xs text-muted-foreground hidden sm:inline font-medium">Tenkasi</span>
            </div>
          </button>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-accent transition-colors" />
              <Input
                type="search"
                placeholder="Search for shirts, jeans, shoes..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 h-12 bg-muted/30 border-border/40 focus:border-accent/50 focus:bg-background rounded-xl shadow-smooth transition-all duration-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:text-accent hover:scale-110 transition-all duration-300"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/orders")}>
                    <Search className="mr-2 h-4 w-4" />
                    Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AuthDialog />
            )}
            <WishlistDrawer />
            <CartDrawer />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Categories - Desktop */}
        <nav className="hidden md:flex items-center justify-between h-14 border-t border-border/30">
          <div className="flex items-center gap-2">
            {/* New In dropdown */}
            <DropdownMenu
              open={openMenu === "New In"}
              onOpenChange={(o) => {
                if (!o && openMenu === "New In") setOpenMenu(null);
              }}
            >
              <DropdownMenuTrigger asChild>
                <button
                  onMouseEnter={() => setOpenMenu("New In")}
                  onMouseLeave={() => setOpenMenu(null)}
                  className="h-14 px-4 text-sm font-medium text-foreground/80 hover:text-accent transition-colors flex items-center gap-1"
                >
                  New In <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                onMouseEnter={() => setOpenMenu("New In")}
                onMouseLeave={() => setOpenMenu(null)} 
                side="bottom" 
                align="start" 
                sideOffset={8} 
                className="w-56 z-[60]"
              >
                {clothingSubmenu.map((item) => (
                  <DropdownMenuItem
                    key={item.name}
                    onSelect={(e) => {
                      e.preventDefault();
                      handleCategoryClick(item.category);
                    }}
                  >
                    {item.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {categories.map((category) => (
              <DropdownMenu
                key={category}
                open={openMenu === category}
                onOpenChange={(o) => {
                  if (!o && openMenu === category) setOpenMenu(null);
                }}
              >
                <DropdownMenuTrigger asChild>
                  <button
                    onMouseEnter={() => setOpenMenu(category)}
                    onMouseLeave={() => setOpenMenu(null)}
                    className={`h-14 px-4 text-sm font-medium transition-colors flex items-center gap-1 ${
                      selectedCategory === category ? "text-accent" : "text-foreground/70 hover:text-accent"
                    }`}
                  >
                    {category} <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  onMouseEnter={() => setOpenMenu(category)}
                  onMouseLeave={() => setOpenMenu(null)} 
                  sideOffset={8} 
                  className="w-56 z-[60]"
                >
                  {categorySubmenus[category]?.map((item) => (
                    <DropdownMenuItem
                      key={item.name}
                      onSelect={(e) => {
                        e.preventDefault();
                        handleCategoryClick(item.category);
                      }}
                    >
                      {item.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>

          <button 
            onClick={() => scrollToSection("festive-offers")}
            className="text-accent font-semibold text-sm px-4 hover:text-accent/80 transition-colors whitespace-nowrap"
          >
            Festive Offers 🎉
          </button>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-muted/50"
              />
            </div>
            <nav className="flex flex-col space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`text-left py-2 transition-colors ${
                    selectedCategory === category
                      ? "text-accent font-medium"
                      : "text-foreground/80 hover:text-accent"
                  }`}
                >
                  {category}
                </button>
              ))}
              <button 
                onClick={() => scrollToSection("festive-offers")}
                className="text-left py-2 text-accent font-medium"
              >
                Festive Offers 🎉
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
