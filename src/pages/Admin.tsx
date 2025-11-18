import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import authCharacter from "@/assets/auth-character.png";

const Admin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Call login edge function
      const { data, error } = await supabase.functions.invoke('login', {
        body: { email, password },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .rpc('has_role', { 
          _user_id: data.user.id, 
          _role: 'admin' 
        });

      if (roleError) throw roleError;

      if (!roleData) {
        throw new Error("Access denied. Admin privileges required.");
      }

      // Save user to localStorage and context
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      setUser(data.user);

      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel!",
      });

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 500);
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      console.log("Admin login failed:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Character Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-accent/10 items-center justify-center p-12">
        <div className="max-w-md animate-fade-in">
          <img 
            src={authCharacter} 
            alt="Admin Character" 
            className="w-full h-auto hover-scale"
          />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">
              Welcome to <span className="text-primary">Admin Panel</span>
            </h1>
            <p className="text-muted-foreground">Sign in to continue managing</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;
