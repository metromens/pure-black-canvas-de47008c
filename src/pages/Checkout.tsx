import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string | null;
  state: string | null;
  pincode: string | null;
  is_default: boolean;
}

const Checkout = () => {
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (items.length === 0) {
      navigate("/");
      return;
    }
    fetchSavedAddresses();
    fetchProfile();
  }, [user, items, navigate]);

  const fetchSavedAddresses = async () => {
    try {
      const { error: configError } = await supabase.rpc('set_current_user_id', {
        user_id: user?.id
      });

      if (configError) {
        console.error("Config error:", configError);
        return;
      }

      const { data, error } = await supabase
        .from("billing_addresses")
        .select("*")
        .eq("user_id", user?.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setSavedAddresses(data);
        // Auto-select default or first address
        const defaultAddr = data.find(addr => addr.is_default) || data[0];
        setSelectedAddressId(defaultAddr.id);
        setBillingInfo({
          name: defaultAddr.name,
          phone: defaultAddr.phone,
          address: defaultAddr.address,
          city: defaultAddr.city || "",
          state: defaultAddr.state || "",
          pincode: defaultAddr.pincode || "",
        });
      }
    } catch (error) {
      console.error("Error fetching saved addresses:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase.rpc('get_profile', {
        _user_id: user!.id,
      });

      if (error) throw error;

      if (data) {
        const profile = data as any;
        setBillingInfo({
          name: profile.name || "",
          phone: profile.phone || "",
          address: profile.address || "",
          city: profile.city || "",
          state: profile.state || "",
          pincode: profile.pincode || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleAddressChange = (addressId: string) => {
    setSelectedAddressId(addressId);
    if (addressId === "new") {
      setBillingInfo({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      });
    } else {
      const selected = savedAddresses.find(addr => addr.id === addressId);
      if (selected) {
        setBillingInfo({
          name: selected.name,
          phone: selected.phone,
          address: selected.address,
          city: selected.city || "",
          state: selected.state || "",
          pincode: selected.pincode || "",
        });
      }
    }
  };

  const handlePlaceOrder = async () => {
    // Validate billing info
    if (!billingInfo.name || !billingInfo.phone || !billingInfo.address) {
      toast.error("Please fill in all required billing information");
      return;
    }

    setLoading(true);
    try {
      const { error: configError } = await supabase.rpc('set_current_user_id', {
        user_id: user?.id
      });

      if (configError) {
        console.error("Config error:", configError);
        toast.error("Authentication error. Please try again.");
        return;
      }

      // Save new address or update existing
      if (selectedAddressId === "new") {
        // Save to billing_addresses table
        const { error: addressError } = await supabase
          .from("billing_addresses")
          .insert({
            user_id: user?.id,
            name: billingInfo.name,
            phone: billingInfo.phone,
            address: billingInfo.address,
            city: billingInfo.city || null,
            state: billingInfo.state || null,
            pincode: billingInfo.pincode || null,
            is_default: savedAddresses.length === 0, // Set as default if first address
          });

        if (addressError) {
          console.error("Error saving address:", addressError);
        }

        // Also update profile table for first time or when changed
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            phone: billingInfo.phone,
            address: billingInfo.address,
            city: billingInfo.city || null,
            state: billingInfo.state || null,
            pincode: billingInfo.pincode || null,
          })
          .eq("id", user?.id);

        if (profileError) {
          console.error("Error updating profile:", profileError);
        }
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id,
          total_amount: getTotalPrice(),
          status: "pending",
          billing_name: billingInfo.name,
          billing_phone: billingInfo.phone,
          billing_address: `${billingInfo.address}, ${billingInfo.city}, ${billingInfo.state} - ${billingInfo.pincode}`,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart and navigate to payment
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/payment/${order.id}`);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₹{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Please provide your billing details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {savedAddresses.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="saved-address">Select Address</Label>
                  <Select value={selectedAddressId} onValueChange={handleAddressChange}>
                    <SelectTrigger id="saved-address">
                      <SelectValue placeholder="Choose an address" />
                    </SelectTrigger>
                    <SelectContent>
                      {savedAddresses.map((addr) => (
                        <SelectItem key={addr.id} value={addr.id}>
                          {addr.name} - {addr.address}
                          {addr.is_default && " (Default)"}
                        </SelectItem>
                      ))}
                      <SelectItem value="new">+ Add New Address</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={billingInfo.name}
                  onChange={(e) => setBillingInfo({ ...billingInfo, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={billingInfo.phone}
                  onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={billingInfo.address}
                  onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={billingInfo.city}
                    onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={billingInfo.state}
                    onChange={(e) => setBillingInfo({ ...billingInfo, state: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={billingInfo.pincode}
                  onChange={(e) => setBillingInfo({ ...billingInfo, pincode: e.target.value })}
                />
              </div>

              <Button onClick={handlePlaceOrder} disabled={loading} className="w-full">
                {loading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
