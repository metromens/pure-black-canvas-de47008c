import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckoutRequest {
  userId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  billingInfo: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  saveAddress: boolean;
  isNewAddress: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, items, billingInfo, saveAddress, isNewAddress }: CheckoutRequest = await req.json();

    console.log("Checkout request for user:", userId);

    // Validate input
    if (!userId || !items || items.length === 0 || !billingInfo) {
      return new Response(
        JSON.stringify({ error: "Invalid checkout data" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!billingInfo.name || !billingInfo.phone || !billingInfo.address) {
      return new Response(
        JSON.stringify({ error: "Missing required billing information" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role key to bypass RLS
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify user exists
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid user" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Save address if requested and it's a new address
    if (saveAddress && isNewAddress) {
      // Check if user has any addresses
      const { data: existingAddresses } = await supabase
        .from('billing_addresses')
        .select('id')
        .eq('user_id', userId);

      const isFirstAddress = !existingAddresses || existingAddresses.length === 0;

      const { error: addressError } = await supabase
        .from('billing_addresses')
        .insert({
          user_id: userId,
          name: billingInfo.name,
          phone: billingInfo.phone,
          address: billingInfo.address,
          city: billingInfo.city || null,
          state: billingInfo.state || null,
          pincode: billingInfo.pincode || null,
          is_default: isFirstAddress,
        });

      if (addressError) {
        console.error("Error saving address:", addressError);
      }

      // Also update profile with address info
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          phone: billingInfo.phone,
          address: billingInfo.address,
          city: billingInfo.city || null,
          state: billingInfo.state || null,
          pincode: billingInfo.pincode || null,
        })
        .eq('id', userId);

      if (profileError) {
        console.error("Error updating profile:", profileError);
      }
    }

    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const fullAddress = `${billingInfo.address}, ${billingInfo.city}, ${billingInfo.state} - ${billingInfo.pincode}`;
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        status: 'pending',
        billing_name: billingInfo.name,
        billing_phone: billingInfo.phone,
        billing_address: fullAddress,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return new Response(
        JSON.stringify({ error: "Failed to create order" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_name: item.name,
      product_price: item.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      return new Response(
        JSON.stringify({ error: "Failed to create order items" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Order created successfully:", order.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        orderId: order.id 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
