import { useState } from "react";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";
import { Card, CardContent } from "@/components/ui/card";
import { Wifi, Triangle } from "lucide-react";

export const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="relative">
              <Triangle className="h-12 w-12 text-primary fill-primary/20" />
              <Wifi className="h-6 w-6 text-secondary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">TriLink Wireless</h1>
            <p className="text-muted-foreground">Professional Internet Services</p>
          </div>
        </div>

        {/* Auth Form */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-6">
            {isSignUp ? (
              <SignUpForm onToggle={() => setIsSignUp(false)} />
            ) : (
              <SignInForm onToggle={() => setIsSignUp(true)} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};