import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle } from "lucide-react";

const Payment = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handlePayment = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      navigate("/orders");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-center">Payment Page</CardTitle>
              <CardDescription className="text-center">
                This is a temporary payment page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Order ID:</p>
                <p className="font-mono text-sm">{orderId?.slice(0, 16)}...</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  In a production environment, this page would integrate with a payment gateway like:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Razorpay</li>
                  <li>PayPal</li>
                  <li>Stripe</li>
                  <li>Paytm</li>
                </ul>
              </div>

              <Button 
                onClick={handlePayment} 
                disabled={processing} 
                className="w-full"
              >
                {processing ? "Processing Payment..." : "Complete Payment (Demo)"}
              </Button>

              <Button 
                variant="outline" 
                onClick={() => navigate("/orders")} 
                className="w-full"
              >
                View Orders
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
