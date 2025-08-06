import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Wifi, 
  Calendar, 
  Clock, 
  Award, 
  Smartphone, 
  CreditCard,
  Gift,
  Timer,
  Trophy
} from "lucide-react";

interface Profile {
  id: string;
  phone_number: string;
  mac_address: string;
  first_name: string;
  last_name: string;
  loyalty_points: number;
  total_spent: number;
}

interface Plan {
  id: string;
  name: string;
  duration_days: number;
  price_ugx: number;
  final_price_ugx: number;
  discount_percent: number;
}

interface Subscription {
  id: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  plans: Plan;
}

export const TriLinkDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      // Fetch active subscription
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select(`
          *,
          plans (*)
        `)
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Fetch available plans
      const { data: plansData } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('duration_days', { ascending: true });

      setProfile(profileData);
      setActiveSubscription(subscriptionData);
      setAvailablePlans(plansData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatUGX = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getRemainingTime = () => {
    if (!activeSubscription) return null;
    
    const endDate = new Date(activeSubscription.end_date);
    const now = new Date();
    const remaining = endDate.getTime() - now.getTime();
    
    if (remaining <= 0) return { expired: true };
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return { days, hours, expired: false };
  };

  const getLoyaltyProgress = () => {
    if (!profile) return 0;
    const points = profile.loyalty_points;
    const nextMilestone = points < 1000 ? 1000 : points < 3000 ? 3000 : 10000;
    return (points / nextMilestone) * 100;
  };

  const getNextReward = () => {
    if (!profile) return null;
    const points = profile.loyalty_points;
    
    if (points < 1000) return { points: 1000, reward: "1 Free Day" };
    if (points < 3000) return { points: 3000, reward: "3 Free Days" };
    if (points < 10000) return { points: 10000, reward: "7 Free Days" };
    
    return null;
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const remainingTime = getRemainingTime();
  const loyaltyProgress = getLoyaltyProgress();
  const nextReward = getNextReward();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <Wifi className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">TriLink Wireless</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome, {profile?.first_name} {profile?.last_name}
                </p>
              </div>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Connection Status */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-primary" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeSubscription ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{activeSubscription.plans.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Active until {new Date(activeSubscription.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={remainingTime?.expired ? "destructive" : "secondary"}>
                    {remainingTime?.expired ? "Expired" : "Active"}
                  </Badge>
                </div>
                
                {remainingTime && !remainingTime.expired && (
                  <div className="flex items-center gap-2 text-sm">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {remainingTime.days}d {remainingTime.hours}h remaining
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No active subscription</p>
                <Button className="mt-2" size="sm">
                  Subscribe Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Info & Loyalty */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Account Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{profile?.phone_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Device:</span>
                <span className="font-mono text-sm">{profile?.mac_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Spent:</span>
                <span className="font-medium">{formatUGX(profile?.total_spent || 0)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Loyalty Program */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-secondary" />
                Loyalty Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Points:</span>
                <Badge variant="secondary" className="font-bold">
                  {profile?.loyalty_points || 0}
                </Badge>
              </div>
              
              {nextReward && (
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Next Reward:</span>
                      <span className="font-medium">{nextReward.reward}</span>
                    </div>
                    <Progress value={loyaltyProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {nextReward.points - (profile?.loyalty_points || 0)} points to go
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Available Plans */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Available Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {availablePlans.map((plan) => (
                <Card key={plan.id} className="border-2 border-muted hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {plan.duration_days} day{plan.duration_days > 1 ? 's' : ''}
                        </p>
                      </div>
                      {plan.discount_percent > 0 && (
                        <Badge variant="secondary">
                          {plan.discount_percent}% OFF
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-center">
                        {plan.discount_percent > 0 && (
                          <p className="text-sm text-muted-foreground line-through">
                            {formatUGX(plan.price_ugx)}
                          </p>
                        )}
                        <p className="text-2xl font-bold text-primary">
                          {formatUGX(plan.final_price_ugx)}
                        </p>
                      </div>
                      <Button className="w-full" size="sm">
                        Subscribe
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};