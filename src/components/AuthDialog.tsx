import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AuthDialog = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Don't render if user is already logged in
  if (user) return null;

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="hover:text-accent hover:scale-110 transition-all duration-300"
      onClick={() => navigate("/auth")}
    >
      <User className="h-5 w-5" />
    </Button>
  );
};

export default AuthDialog;
