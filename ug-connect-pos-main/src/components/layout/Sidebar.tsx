import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Receipt, 
  BarChart3,
  Settings,
  Wifi,
  LogOut,
  User
} from "lucide-react";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  userRole?: "admin" | "attendant";
}

export function Sidebar({ activeView, onViewChange, userRole = "admin" }: SidebarProps) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "attendant"]
    },
    {
      id: "sales",
      label: "New Sale",
      icon: ShoppingCart,
      roles: ["admin", "attendant"]
    },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
      roles: ["admin", "attendant"]
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
      roles: ["admin", "attendant"]
    },
    {
      id: "network",
      label: "Network Status",
      icon: Wifi,
      roles: ["admin"]
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      roles: ["admin"]
    }
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Wifi className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Mperewe ISP</h2>
            <p className="text-sm text-muted-foreground">Point of Sale</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-12",
                isActive && "bg-primary text-primary-foreground"
              )}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
              {item.id === "sales" && (
                <Badge variant="secondary" className="ml-auto">
                  Hot
                </Badge>
              )}
            </Button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-border space-y-2">
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Shop Attendant</p>
            <p className="text-xs text-muted-foreground capitalize">{userRole} role</p>
          </div>
        </div>
        
        <Button variant="outline" className="w-full justify-start gap-3" size="sm">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}