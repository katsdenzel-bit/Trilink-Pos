import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  DollarSign, 
  Wifi, 
  TrendingUp,
  Plus,
  Receipt,
  UserPlus,
  BarChart3
} from "lucide-react";

export function Dashboard() {
  // Mock data - will be replaced with real data from Supabase
  const todayStats = {
    sales: 145000,
    customers: 23,
    dailyPlans: 15,
    monthlyPlans: 8
  };

  const monthStats = {
    revenue: 3200000,
    activeCustomers: 189,
    newCustomers: 34
  };

  const formatUGX = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mperewe ISP Dashboard</h1>
          <p className="text-muted-foreground">Internet subscription point of sale system</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Sale
          </Button>
          <Button variant="outline" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatUGX(todayStats.sales)}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers Served</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {todayStats.customers}
            </div>
            <p className="text-xs text-muted-foreground">
              Today's transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Plans</CardTitle>
            <Wifi className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {todayStats.dailyPlans}
            </div>
            <p className="text-xs text-muted-foreground">
              1,000 UGX each
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Plans</CardTitle>
            <TrendingUp className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {todayStats.monthlyPlans}
            </div>
            <p className="text-xs text-muted-foreground">
              27,000 UGX each (10% off)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Stats */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              This Month's Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-success">{formatUGX(monthStats.revenue)}</p>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success">
                +18% vs last month
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Active Customers</p>
                <p className="text-xl font-bold text-primary">{monthStats.activeCustomers}</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">New Customers</p>
                <p className="text-xl font-bold text-secondary">{monthStats.newCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start gap-2" variant="outline">
              <Receipt className="h-4 w-4" />
              View Sales Report
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline">
              <Users className="h-4 w-4" />
              Customer List
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline">
              <Wifi className="h-4 w-4" />
              Network Status
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline">
              <BarChart3 className="h-4 w-4" />
              Monthly Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: "TXN001", customer: "John Mugisha", plan: "Monthly", amount: 27000, method: "MTN Momo", time: "2 mins ago" },
              { id: "TXN002", customer: "Sarah Nakato", plan: "Daily", amount: 1000, method: "Cash", time: "15 mins ago" },
              { id: "TXN003", customer: "David Kiprotich", plan: "Monthly", amount: 27000, method: "Airtel Money", time: "32 mins ago" },
              { id: "TXN004", customer: "Grace Nalubega", plan: "Daily", amount: 1000, method: "Cash", time: "1 hour ago" }
            ].map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{transaction.customer}</p>
                  <p className="text-sm text-muted-foreground">{transaction.id} • {transaction.time}</p>
                </div>
                <div className="text-center mx-4">
                  <Badge variant={transaction.plan === "Monthly" ? "default" : "secondary"}>
                    {transaction.plan}
                  </Badge>
                </div>
                <div className="text-center mx-4">
                  <p className="text-sm text-muted-foreground">{transaction.method}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-success">{formatUGX(transaction.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}