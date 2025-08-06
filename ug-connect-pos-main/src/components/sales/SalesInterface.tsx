import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Smartphone,
  CreditCard,
  Banknote,
  Receipt,
  Calculator,
  User,
  Percent
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SalesInterface() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<"daily" | "weekly" | "monthly" | null>(null);
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "mtn" | "airtel" | "bank" | null>(null);
  const [cashReceived, setCashReceived] = useState("");
  const { toast } = useToast();

  const plans = {
    daily: {
      name: "Custom Days Plan",
      pricePerDay: 1000,
      duration: "Per Day",
      discount: 0
    },
    weekly: {
      name: "Weekly Internet Plan",
      price: 6500,
      duration: "7 Days",
      discount: 7 // 7% discount (500 UGX off)
    },
    monthly: {
      name: "Monthly Internet Plan",
      price: 30000,
      discountPrice: 27000,
      duration: "30 Days",
      discount: 10
    }
  };

  const paymentMethods = [
    { id: "cash", name: "Cash", icon: Banknote, color: "bg-success" },
    { id: "mtn", name: "MTN Momo", icon: Smartphone, color: "bg-warning" },
    { id: "airtel", name: "Airtel Money", icon: Smartphone, color: "bg-destructive" },
    { id: "bank", name: "Bank Transfer", icon: CreditCard, color: "bg-primary" }
  ];

  const getTotal = () => {
    if (!selectedPlan) return 0;
    if (selectedPlan === "daily") return plans.daily.pricePerDay * numberOfDays;
    if (selectedPlan === "weekly") return plans.weekly.price;
    return plans.monthly.discountPrice;
  };

  const getChange = () => {
    if (paymentMethod !== "cash" || !cashReceived) return 0;
    return Math.max(0, parseInt(cashReceived) - getTotal());
  };

  const formatUGX = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleProcessSale = () => {
    if (!customerName || !customerPhone || !selectedPlan || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod === "cash" && (!cashReceived || parseInt(cashReceived) < getTotal())) {
      toast({
        title: "Insufficient Cash",
        description: "Cash received is less than the total amount",
        variant: "destructive"
      });
      return;
    }

    // Process the sale (would integrate with Supabase)
    toast({
      title: "Sale Completed!",
      description: `${plans[selectedPlan].name} sold to ${customerName}`,
      variant: "default"
    });

    // Reset form
    setCustomerName("");
    setCustomerPhone("");
    setSelectedPlan(null);
    setPaymentMethod(null);
    setCashReceived("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Receipt className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">New Sale</h1>
          <p className="text-muted-foreground">Process internet subscription sale</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Phone Number</Label>
              <Input
                id="customerPhone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g., +256 700 123 456"
              />
            </div>
          </CardContent>
        </Card>

        {/* Plan Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Internet Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Custom Days Plan */}
            <div 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedPlan === "daily" 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedPlan("daily")}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{plans.daily.name}</h3>
                  <p className="text-sm text-muted-foreground">{formatUGX(plans.daily.pricePerDay)} {plans.daily.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{formatUGX(plans.daily.pricePerDay * numberOfDays)}</p>
                  <p className="text-xs text-muted-foreground">{numberOfDays} day{numberOfDays > 1 ? 's' : ''}</p>
                </div>
              </div>
              {selectedPlan === "daily" && (
                <div className="mt-3 pt-3 border-t">
                  <Label htmlFor="numberOfDays" className="text-sm">Number of Days</Label>
                  <Input
                    id="numberOfDays"
                    type="number"
                    min="1"
                    max="25"
                    value={numberOfDays}
                    onChange={(e) => setNumberOfDays(Math.max(1, Math.min(25, parseInt(e.target.value) || 1)))}
                    className="mt-1"
                  />
                </div>
              )}
            </div>

            {/* Weekly Plan */}
            <div 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedPlan === "weekly" 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedPlan("weekly")}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{plans.weekly.name}</h3>
                  <p className="text-sm text-muted-foreground">{plans.weekly.duration}</p>
                  <Badge variant="secondary" className="mt-1 bg-warning/10 text-warning">
                    <Percent className="h-3 w-3 mr-1" />
                    {plans.weekly.discount}% Discount
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground line-through">{formatUGX(7000)}</p>
                  <p className="text-lg font-bold text-warning">{formatUGX(plans.weekly.price)}</p>
                </div>
              </div>
            </div>

            {/* Monthly Plan */}
            <div 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedPlan === "monthly" 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedPlan("monthly")}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{plans.monthly.name}</h3>
                  <p className="text-sm text-muted-foreground">{plans.monthly.duration}</p>
                  <Badge variant="secondary" className="mt-1 bg-success/10 text-success">
                    <Percent className="h-3 w-3 mr-1" />
                    {plans.monthly.discount}% Discount
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground line-through">{formatUGX(plans.monthly.price)}</p>
                  <p className="text-lg font-bold text-success">{formatUGX(plans.monthly.discountPrice)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment & Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Payment & Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Payment Methods */}
            <div>
              <Label className="text-sm font-medium">Payment Method</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <Button
                      key={method.id}
                      variant={paymentMethod === method.id ? "default" : "outline"}
                      className="h-12 flex-col gap-1"
                      onClick={() => setPaymentMethod(method.id as any)}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs">{method.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Cash Input */}
            {paymentMethod === "cash" && (
              <div>
                <Label htmlFor="cashReceived">Cash Received</Label>
                <Input
                  id="cashReceived"
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  placeholder="Enter amount received"
                />
              </div>
            )}

            <Separator />

            {/* Summary */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatUGX(selectedPlan ? (
                  selectedPlan === "daily" ? plans.daily.pricePerDay * numberOfDays :
                  selectedPlan === "weekly" ? 7000 :
                  plans.monthly.price
                ) : 0)}</span>
              </div>
              {(selectedPlan === "weekly" || selectedPlan === "monthly") && (
                <div className="flex justify-between text-success">
                  <span>Discount ({selectedPlan === "weekly" ? 7 : 10}%):</span>
                  <span>-{formatUGX(selectedPlan === "weekly" ? 500 : 3000)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">{formatUGX(getTotal())}</span>
              </div>
              {paymentMethod === "cash" && cashReceived && (
                <div className="flex justify-between text-success">
                  <span>Change:</span>
                  <span>{formatUGX(getChange())}</span>
                </div>
              )}
            </div>

            <Button 
              className="w-full h-12" 
              onClick={handleProcessSale}
              disabled={!customerName || !customerPhone || !selectedPlan || !paymentMethod}
            >
              <Receipt className="h-4 w-4 mr-2" />
              Process Sale
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}