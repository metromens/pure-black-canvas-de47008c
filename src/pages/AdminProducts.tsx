import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus, ChevronDown, Edit, Trash2, Upload } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Product = {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  price: string;
  stock: number;
  image: string;
};

const AdminProducts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "Shirts",
    subcategory: "Formal Shirts",
    price: "",
    stock: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Classic White Shirt", category: "Shirts", subcategory: "Formal Shirts", price: "$49.99", stock: 45, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400" },
    { id: 2, name: "Blue Denim Jeans", category: "Pants", subcategory: "Jeans", price: "$79.99", stock: 32, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400" },
    { id: 3, name: "Sneakers Pro", category: "Footwears", subcategory: "Sneakers", price: "$129.99", stock: 18, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
    { id: 4, name: "Graphic T-Shirt", category: "T-Shirts", subcategory: "Round Neck", price: "$29.99", stock: 60, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" },
    { id: 5, name: "Cargo Shorts", category: "Shorts", subcategory: "Cargo Shorts", price: "$39.99", stock: 25, image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400" },
  ]);

  const handleLogout = () => {
    navigate("/admin");
  };

  const categories = ["Shirts", "T-Shirts", "Pants", "Shorts", "Footwears", "Accessories"];

  const categorySubmenus: Record<string, { name: string; category: string }[]> = {
    "Shirts": [
      { name: "All Shirts", category: "Shirts" },
      { name: "Formal Shirts", category: "Shirts" },
      { name: "Casual Shirts", category: "Shirts" },
    ],
    "T-Shirts": [
      { name: "All T-Shirts", category: "T-Shirts" },
      { name: "Round Neck", category: "T-Shirts" },
      { name: "V-Neck", category: "T-Shirts" },
    ],
    "Pants": [
      { name: "All Pants", category: "Pants" },
      { name: "Jeans", category: "Pants" },
      { name: "Chinos", category: "Pants" },
    ],
    "Shorts": [
      { name: "All Shorts", category: "Shorts" },
      { name: "Denim Shorts", category: "Shorts" },
      { name: "Cargo Shorts", category: "Shorts" },
    ],
    "Footwears": [
      { name: "All Footwears", category: "Footwears" },
      { name: "Sneakers", category: "Footwears" },
      { name: "Formal Shoes", category: "Footwears" },
    ],
    "Accessories": [
      { name: "All Accessories", category: "Accessories" },
      { name: "Belts", category: "Accessories" },
      { name: "Wallets", category: "Accessories" },
    ],
  };

  const subcategories: Record<string, string[]> = {
    "Shirts": ["Formal Shirts", "Casual Shirts"],
    "T-Shirts": ["Round Neck", "V-Neck", "Polo"],
    "Pants": ["Jeans", "Chinos", "Trousers"],
    "Shorts": ["Denim Shorts", "Cargo Shorts", "Athletic Shorts"],
    "Footwears": ["Sneakers", "Formal Shoes", "Sandals"],
    "Accessories": ["Belts", "Wallets", "Watches"],
  };


  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        subcategory: product.subcategory,
        price: product.price.replace("$", ""),
        stock: product.stock.toString(),
        image: product.image,
      });
      setImagePreview(product.image);
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        category: "Shirts",
        subcategory: "Formal Shirts",
        price: "",
        stock: "",
        image: "",
      });
      setImagePreview("");
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "Shirts",
      subcategory: "Formal Shirts",
      price: "",
      stock: "",
      image: "",
    });
    setImagePreview("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData({ ...formData, image: result });
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.price || !formData.stock) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: formData.name,
      category: formData.category,
      subcategory: formData.subcategory,
      price: `$${formData.price}`,
      stock: parseInt(formData.stock),
      image: formData.image || "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400",
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? newProduct : p));
      toast({
        title: "Success",
        description: "Product updated successfully!",
      });
    } else {
      setProducts([...products, newProduct]);
      toast({
        title: "Success",
        description: "Product created successfully!",
      });
    }

    handleCloseDialog();
  };

  const handleDeleteProduct = (id: number) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete));
      toast({
        title: "Success",
        description: "Product deleted successfully!",
      });
    }
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card">
            <div className="px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="bg-black text-yellow-400 hover:bg-black/90 hover:text-yellow-300" />
                <h1 className="text-2xl font-bold text-primary">Products Management</h1>
              </div>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Category Navigation */}
            <nav className="flex items-center gap-2 px-4 py-3 border-t border-border/30 overflow-x-auto">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedCategory === "All" ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                }`}
              >
                All Products
              </button>
              
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
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1 whitespace-nowrap ${
                        selectedCategory === category ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                      }`}
                    >
                      {category} <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent onMouseLeave={() => setOpenMenu(null)} sideOffset={8} className="w-56 z-[60] bg-popover">
                    {categorySubmenus[category]?.map((item) => (
                      <DropdownMenuItem
                        key={item.name}
                        onSelect={(e) => {
                          e.preventDefault();
                          setSelectedCategory(item.category);
                        }}
                      >
                        {item.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </nav>
          </header>

          <main className="flex-1 px-4 py-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                {selectedCategory === "All" ? "All Products" : selectedCategory}
              </h2>
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* Create New Product Card */}
              <Card 
                className="border-dashed border-2 hover:border-accent transition-colors cursor-pointer group"
                onClick={() => handleOpenDialog()}
              >
                <CardContent className="flex flex-col items-center justify-center h-full min-h-[320px] p-6">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <Plus className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Add New Product</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Click to create a new product
                  </p>
                </CardContent>
              </Card>

              {/* Product Cards */}
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <CardDescription className="text-xs">{product.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">{product.price}</span>
                      <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleOpenDialog(product)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Create New Product"}</DialogTitle>
            <DialogDescription>
              {editingProduct ? "Update the product details below." : "Add a new product to your catalog."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  const defaultSubcategory = subcategories[value]?.[0] || "";
                  setFormData({ ...formData, category: value, subcategory: defaultSubcategory });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Shirts">Shirts</SelectItem>
                  <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                  <SelectItem value="Pants">Pants</SelectItem>
                  <SelectItem value="Shorts">Shorts</SelectItem>
                  <SelectItem value="Footwears">Footwears</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subcategory">Sub-Category *</Label>
              <Select
                value={formData.subcategory}
                onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-category" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories[formData.category]?.map((sub) => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="49.99"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="100"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Product Image</Label>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                {imagePreview && (
                  <div className="relative w-full h-32 rounded-md overflow-hidden border">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveProduct}>
              {editingProduct ? "Update" : "Create"} Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this product. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default AdminProducts;
