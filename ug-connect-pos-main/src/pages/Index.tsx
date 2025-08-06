import { useAuth } from "@/hooks/useAuth";
import { AuthPage } from "@/components/auth/AuthPage";
import { TriLinkDashboard } from "@/components/trilink/TriLinkDashboard";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <TriLinkDashboard />;
};

export default Index;
