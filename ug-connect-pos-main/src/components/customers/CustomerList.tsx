import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  Plus,
  Phone,
  Calendar,
  Filter
} from "lucide-react";

export function CustomerList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "expired">("all");

  // Mock customer data - will be replaced with Supabase data
  const customers = [
    {
      id: "CUST001",
      name: "John Mugisha",
      phone: "+256 700 123 456",
      subscriptionType: "Monthly",
      status: "active",
      expiryDate: "2024-09-15",
      totalSpent: 54000,
      joinDate: "2024-07-01"
    },
    {
      id: "CUST002", 
      name: "Sarah Nakato",
      phone: "+256 701 234 567",
      subscriptionType: "Daily",
      status: "active",
      expiryDate: "2024-08-06",
      totalSpent: 15000,
      joinDate: "2024-07-15"
    },
    {
      id: "CUST003",
      name: "David Kiprotich", 
      phone: "+256 702 345 678",
      subscriptionType: "Monthly",
      status: "expired",
      expiryDate: "2024-07-30",
      totalSpent: 81000,
      joinDate: "2024-05-10"
    },
    {
      id: "CUST004",
      name: "Grace Nalubega",
      phone: "+256 703 456 789", 
      subscriptionType: "Daily",
      status: "active",
      expiryDate: "2024-08-06",
      totalSpent: 8000,
      joinDate: "2024-08-01"
    },
    {
      id: "CUST005",
      name: "Robert Ssemakula",
      phone: "+256 704 567 890",
      subscriptionType: "Monthly", 
      status: "active",
      expiryDate: "2024-09-20",
      totalSpent: 135000,
      joinDate: "2024-02-14"
    }
  ];

  const formatUGX = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-UG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone.includes(searchQuery) ||
                         customer.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || customer.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success";
      case "expired":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Users className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Customer Management</h1>
            <p className="text-muted-foreground">View and manage customer subscriptions</p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name, phone, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                size="sm"
              >
                All ({customers.length})
              </Button>
              <Button
                variant={filterStatus === "active" ? "default" : "outline"}
                onClick={() => setFilterStatus("active")}
                size="sm"
              >
                Active ({customers.filter(c => c.status === "active").length})
              </Button>
              <Button
                variant={filterStatus === "expired" ? "default" : "outline"}
                onClick={() => setFilterStatus("expired")}
                size="sm"
              >
                Expired ({customers.filter(c => c.status === "expired").length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{customer.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{customer.id}</p>
                </div>
                <Badge className={getStatusColor(customer.status)}>
                  {customer.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plan:</span>
                  <Badge variant="outline">{customer.subscriptionType}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expires:</span>
                  <span className="font-medium">{formatDate(customer.expiryDate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Spent:</span>
                  <span className="font-bold text-success">{formatUGX(customer.totalSpent)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Member Since:</span>
                  <span>{formatDate(customer.joinDate)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button size="sm" className="flex-1">
                  Renew Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No customers found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try adjusting your search terms" : "Start by adding your first customer"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}