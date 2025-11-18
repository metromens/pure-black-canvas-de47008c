import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { LogOut, Package, Upload, FileDown } from "lucide-react";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
};

type Order = {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  items: number;
  total: string;
  status: string;
  date: string;
  orderItems: OrderItem[];
  courierNo?: string;
  city?: string;
  state?: string;
  pincode?: string;
};

const AdminOrders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [generatingInvoices, setGeneratingInvoices] = useState(false);
  const [activeTab, setActiveTab] = useState<'assigned' | 'unassigned'>('unassigned');
  const [pendingAssignments, setPendingAssignments] = useState<Array<{ order_id: string; courier_no: string }>>([]);
  const [applying, setApplying] = useState(false);

  const handleLogout = () => {
    navigate("/admin");
  };

  // Fetch orders from database
  const fetchOrders = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Fetch orders using admin function
      const { data: ordersData, error: ordersError } = await supabase
        .rpc('list_all_orders', {
          _admin_user_id: user.id
        });

      if (ordersError) throw ordersError;

      // Fetch order items and profile data for each order
      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          // Fetch order items using admin function
          const { data: itemsData } = await supabase
            .rpc('get_order_items', {
              _admin_user_id: user.id,
              _order_id: order.id
            });

          // Fetch profile data
          const { data: profileData } = await supabase
            .rpc('get_profile', {
              _user_id: order.user_id
            });

          // Parse address for city, state, pincode
          const addressParts = order.billing_address.split(',').map(part => part.trim());
          
          return {
            id: order.id,
            customer: profileData?.name || order.billing_name || 'Unknown',
            email: profileData?.email || '',
            phone: profileData?.phone || order.billing_phone,
            address: order.billing_address,
            items: itemsData?.length || 0,
            total: `$${Number(order.total_amount).toFixed(2)}`,
            status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
            date: new Date(order.created_at).toLocaleDateString(),
            courierNo: order.courier_no || '',
            city: addressParts[1] || '',
            state: addressParts[2] || '',
            pincode: addressParts[3] || '',
            orderItems: (itemsData || []).map(item => ({
              id: item.id,
              name: item.product_name,
              quantity: item.quantity,
              price: Number(item.product_price),
              image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400"
            }))
          };
        })
      );

      setOrders(ordersWithItems);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Set up realtime subscription
  useEffect(() => {
    if (!user?.id) return;

    fetchOrders();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchOrders();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_items'
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "default";
      case "Processing":
        return "secondary";
      case "Shipped":
        return "outline";
      case "Cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setUpdatedStatus(order.status);
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !updatedStatus || !user?.id) return;

    try {
      // Admin can update orders directly
      const { error } = await supabase
        .from('orders')
        .update({ status: updatedStatus.toLowerCase() })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Order ${selectedOrder.id} status updated to ${updatedStatus}`,
      });

      setIsDialogOpen(false);
      setSelectedOrder(null);
      setUpdatedStatus("");
      fetchOrders();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          const data = results.data as Array<{ courier_id?: string }>;
          
          // Extract courier numbers from CSV
          const courierNumbers = data
            .filter(row => row.courier_id && row.courier_id.trim())
            .map(row => row.courier_id!.trim());

          if (courierNumbers.length === 0) {
            toast({
              title: "Error",
              description: "No valid courier numbers found in CSV",
              variant: "destructive",
            });
            setUploading(false);
            return;
          }

          // Filter orders that don't have courier numbers
          const ordersWithoutCourier = orders.filter(order => !order.courierNo);

          if (ordersWithoutCourier.length === 0) {
            toast({
              title: "Info",
              description: "All orders already have courier numbers assigned",
            });
            setUploading(false);
            return;
          }

          // Prepare pending assignments (don't update DB yet)
          const orderUpdates = ordersWithoutCourier
            .slice(0, courierNumbers.length)
            .map((order, index) => ({
              order_id: order.id,
              courier_no: courierNumbers[index]
            }));

          setPendingAssignments(orderUpdates);
          
          toast({
            title: "CSV Loaded",
            description: `${orderUpdates.length} courier numbers ready to assign. Click "Apply Assignments" to confirm.`,
          });
          
          setUploading(false);
        },
        error: (error) => {
          toast({
            title: "Error",
            description: "Failed to parse CSV file",
            variant: "destructive",
          });
          setUploading(false);
        }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload CSV",
        variant: "destructive",
      });
      setUploading(false);
    }
  };

  const handleApplyAssignments = async () => {
    if (pendingAssignments.length === 0 || !user?.id) return;

    setApplying(true);
    try {
      // Call the secure batch update function
      const { error: updateError } = await supabase.rpc('update_courier_numbers', {
        _admin_user_id: user.id,
        _order_updates: pendingAssignments
      });

      if (updateError) {
        throw updateError;
      }

      // Fetch the updated orders directly to get courier numbers
      const assignedOrderIds = pendingAssignments.map(a => a.order_id);
      
      const { data: ordersData, error: ordersError } = await supabase
        .rpc('list_all_orders', {
          _admin_user_id: user.id
        });

      if (ordersError) throw ordersError;

      // Get the newly assigned orders with their courier numbers
      const assignedOrdersData = (ordersData || []).filter(order => 
        assignedOrderIds.includes(order.id)
      );

      if (assignedOrdersData.length > 0) {
        // Fetch order items for each assigned order
        const assignedOrders = await Promise.all(
          assignedOrdersData.map(async (order) => {
            const { data: itemsData } = await supabase
              .rpc('get_order_items', {
                _admin_user_id: user.id,
                _order_id: order.id
              });

            const { data: profileData } = await supabase
              .rpc('get_profile', {
                _user_id: order.user_id
              });

            const addressParts = order.billing_address.split(',').map(part => part.trim());
            
            return {
              id: order.id,
              customer: profileData?.name || order.billing_name || 'Unknown',
              phone: profileData?.phone || order.billing_phone,
              address: order.billing_address,
              total: `$${Number(order.total_amount).toFixed(2)}`,
              date: new Date(order.created_at).toLocaleDateString(),
              courierNo: order.courier_no || '',
              city: addressParts[1] || '',
              state: addressParts[2] || '',
              pincode: addressParts[3] || '',
              orderItems: (itemsData || []).map(item => ({
                id: item.id,
                name: item.product_name,
                quantity: item.quantity,
                price: Number(item.product_price),
                image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400"
              }))
            };
          })
        );

        // Generate merged PDF for all newly assigned orders
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a5'
        });

        assignedOrders.forEach((order, index) => {
          if (index > 0) {
            doc.addPage();
          }

          // Header
          doc.setFontSize(16);
          doc.text('INVOICE', 105, 15, { align: 'center' });
          
          doc.setFontSize(10);
          doc.text(`Order ID: ${order.id}`, 10, 25);
          doc.text(`Date: ${order.date}`, 10, 30);
          doc.text(`Courier No: ${order.courierNo}`, 10, 35);

          // Customer Details
          doc.setFontSize(12);
          doc.text('Customer Details:', 10, 45);
          doc.setFontSize(10);
          doc.text(`Name: ${order.customer}`, 10, 50);
          doc.text(`Phone: ${order.phone}`, 10, 55);
          doc.text(`Address: ${order.address}`, 10, 60);
          if (order.city) doc.text(`City: ${order.city}`, 10, 65);
          if (order.state) doc.text(`State: ${order.state}`, 10, 70);
          if (order.pincode) doc.text(`Pincode: ${order.pincode}`, 10, 75);

          // Items Table
          autoTable(doc, {
            startY: 85,
            head: [['Item', 'Qty', 'Price', 'Total']],
            body: order.orderItems.map(item => [
              item.name,
              item.quantity.toString(),
              `$${item.price.toFixed(2)}`,
              `$${(item.price * item.quantity).toFixed(2)}`
            ]),
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [0, 0, 0] }
          });

          // Total
          const finalY = (doc as any).lastAutoTable.finalY || 85;
          doc.setFontSize(12);
          doc.text(`Total: ${order.total}`, 10, finalY + 10);
        });

        doc.save(`invoices-${new Date().toISOString().split('T')[0]}.pdf`);

        toast({
          title: "Success",
          description: `${pendingAssignments.length} courier numbers assigned and invoices generated`,
        });
      } else {
        toast({
          title: "Success",
          description: `${pendingAssignments.length} courier numbers assigned successfully`,
        });
      }
      
      setPendingAssignments([]);
      await fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to apply assignments",
        variant: "destructive",
      });
    } finally {
      setApplying(false);
    }
  };

  const generateInvoice = (order: Order) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5'
    });

    // Header
    doc.setFontSize(16);
    doc.text('INVOICE', 105, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Order ID: ${order.id}`, 10, 25);
    doc.text(`Date: ${order.date}`, 10, 30);
    doc.text(`Courier No: ${order.courierNo || 'N/A'}`, 10, 35);

    // Customer Details
    doc.setFontSize(12);
    doc.text('Customer Details:', 10, 45);
    doc.setFontSize(10);
    doc.text(`Name: ${order.customer}`, 10, 50);
    doc.text(`Phone: ${order.phone}`, 10, 55);
    doc.text(`Address: ${order.address}`, 10, 60);
    if (order.city) doc.text(`City: ${order.city}`, 10, 65);
    if (order.state) doc.text(`State: ${order.state}`, 10, 70);
    if (order.pincode) doc.text(`Pincode: ${order.pincode}`, 10, 75);

    // Items Table
    autoTable(doc, {
      startY: 85,
      head: [['Item', 'Qty', 'Price', 'Total']],
      body: order.orderItems.map(item => [
        item.name,
        item.quantity.toString(),
        `$${item.price.toFixed(2)}`,
        `$${(item.price * item.quantity).toFixed(2)}`
      ]),
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 0, 0] }
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY || 85;
    doc.setFontSize(12);
    doc.text(`Total: ${order.total}`, 10, finalY + 10);

    return doc;
  };

  const handleGenerateInvoice = (order: Order) => {
    const doc = generateInvoice(order);
    doc.save(`invoice-${order.id}.pdf`);
    
    toast({
      title: "Success",
      description: "Invoice downloaded successfully",
    });
  };

  const handleGenerateAllInvoices = async () => {
    setGeneratingInvoices(true);
    
    try {
      // Only generate invoices for orders with courier numbers
      const ordersWithCourier = orders.filter(order => order.courierNo);
      
      if (ordersWithCourier.length === 0) {
        toast({
          title: "No Orders",
          description: "No orders with courier numbers to generate invoices",
          variant: "destructive",
        });
        setGeneratingInvoices(false);
        return;
      }

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5'
      });

      ordersWithCourier.forEach((order, index) => {
        if (index > 0) {
          doc.addPage();
        }

        // Header
        doc.setFontSize(16);
        doc.text('INVOICE', 105, 15, { align: 'center' });
        
        doc.setFontSize(10);
        doc.text(`Order ID: ${order.id}`, 10, 25);
        doc.text(`Date: ${order.date}`, 10, 30);
        doc.text(`Courier No: ${order.courierNo || 'N/A'}`, 10, 35);

        // Customer Details
        doc.setFontSize(12);
        doc.text('Customer Details:', 10, 45);
        doc.setFontSize(10);
        doc.text(`Name: ${order.customer}`, 10, 50);
        doc.text(`Phone: ${order.phone}`, 10, 55);
        doc.text(`Address: ${order.address}`, 10, 60);
        if (order.city) doc.text(`City: ${order.city}`, 10, 65);
        if (order.state) doc.text(`State: ${order.state}`, 10, 70);
        if (order.pincode) doc.text(`Pincode: ${order.pincode}`, 10, 75);

        // Items Table
        autoTable(doc, {
          startY: 85,
          head: [['Item', 'Qty', 'Price', 'Total']],
          body: order.orderItems.map(item => [
            item.name,
            item.quantity.toString(),
            `$${item.price.toFixed(2)}`,
            `$${(item.price * item.quantity).toFixed(2)}`
          ]),
          theme: 'grid',
          styles: { fontSize: 8 },
          headStyles: { fillColor: [0, 0, 0] }
        });

        // Total
        const finalY = (doc as any).lastAutoTable.finalY || 85;
        doc.setFontSize(12);
        doc.text(`Total: ${order.total}`, 10, finalY + 10);
      });

      doc.save('all-invoices.pdf');
      
      toast({
        title: "Success",
        description: `All ${ordersWithCourier.length} invoices merged into one PDF`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate invoices",
        variant: "destructive",
      });
    } finally {
      setGeneratingInvoices(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card">
            <div className="px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="bg-black text-yellow-400 hover:bg-black/90 hover:text-yellow-300" />
                <h1 className="text-2xl font-bold text-primary">Orders Management</h1>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload">
                  <Button asChild variant="outline" disabled={uploading}>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? "Uploading..." : "Upload CSV"}
                    </span>
                  </Button>
                </label>
                {pendingAssignments.length > 0 && (
                  <Button 
                    onClick={handleApplyAssignments} 
                    variant="default"
                    disabled={applying}
                  >
                    {applying ? "Applying..." : `Apply Assignments (${pendingAssignments.length})`}
                  </Button>
                )}
                <Button 
                  onClick={handleGenerateAllInvoices} 
                  variant="default"
                  disabled={generatingInvoices || orders.filter(o => o.courierNo).length === 0}
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  {generatingInvoices ? "Generating..." : "Generate All Invoices"}
                </Button>
                <Button onClick={handleLogout} variant="outline">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-8">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>Track and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'assigned' | 'unassigned')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="unassigned">
                      Courier No Not Assigned ({orders.filter(o => !o.courierNo).length})
                    </TabsTrigger>
                    <TabsTrigger value="assigned">
                      Courier No Assigned ({orders.filter(o => o.courierNo).length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="unassigned">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.filter(o => !o.courierNo).map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{order.items}</TableCell>
                            <TableCell>{order.total}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewOrder(order)}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="assigned">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Courier No</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.filter(o => o.courierNo).map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{order.items}</TableCell>
                            <TableCell>{order.total}</TableCell>
                            <TableCell>
                              <span className="font-medium text-primary">{order.courierNo}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleViewOrder(order)}
                                >
                                  View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleGenerateInvoice(order)}
                                >
                                  <FileDown className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Package className="w-6 h-6" />
              Order Details - {selectedOrder?.id}
            </DialogTitle>
            <DialogDescription>
              Order placed on {selectedOrder?.date}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="font-medium">{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">{selectedOrder.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Shipping Address</Label>
                    <p className="font-medium">{selectedOrder.address}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 border rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Order Summary */}
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Total Amount</h3>
                <p className="text-2xl font-bold text-primary">{selectedOrder.total}</p>
              </div>

              <Separator />

              {/* Order Status Update */}
              <div>
                <Label htmlFor="status" className="text-base font-semibold">Update Order Status</Label>
                <Select value={updatedStatus} onValueChange={setUpdatedStatus}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={handleUpdateStatus}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default AdminOrders;
