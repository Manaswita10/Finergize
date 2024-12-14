"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";

interface LoginData {
  phone: string;
  aadhaarNumber: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState<LoginData>({
    phone: "",
    aadhaarNumber: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        phone: loginData.phone,
        aadhaarNumber: loginData.aadhaarNumber,
        redirect: false,
        callbackUrl: '/banking/dashboard'
      });

      console.log("Login result:", result);

      if (result?.ok) {
        toast({
          title: "Login Successful",
          description: "Welcome back to Finergize!",
          variant: "default"
        });
        router.push("/banking/dashboard");
      } else {
        throw new Error(result?.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [id === 'aadhaar' ? 'aadhaarNumber' : id]: value
    }));
  };

  return (
    <main className="min-h-screen bg-black pt-24 pb-12">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>

      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
            <CardDescription>Login to access your rural banking services</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="10-digit phone number"
                    value={loginData.phone}
                    onChange={handleInputChange}
                    pattern="[0-9]{10}"
                    required
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                    minLength={10}
                    maxLength={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar Number</Label>
                  <Input
                    id="aadhaar"
                    type="password"
                    placeholder="12-digit Aadhaar number"
                    value={loginData.aadhaarNumber}
                    onChange={handleInputChange}
                    pattern="[0-9]{12}"
                    required
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                    minLength={12}
                    maxLength={12}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>

              <p className="text-center text-sm text-gray-400 mt-4">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Register here
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
