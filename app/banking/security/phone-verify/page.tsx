"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Phone, ShieldCheck } from "lucide-react";

export default function PhoneVerificationPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [countdown, setCountdown] = useState(0);

  const handlePhoneSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate phone number
      if (!phoneNumber.match(/^[6-9]\d{9}$/)) {
        throw new Error("Please enter a valid Indian phone number");
      }

      const response = await fetch('/pages/api/security/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      // Start countdown for resend
      setCountdown(30);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const enteredOTP = otp.join("");
      const response = await fetch('/pages/api/security/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: enteredOTP })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to verify OTP');
      }

      router.push("/banking/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch('/pages/api/security/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to resend OTP');
      }

      // Reset OTP fields
      setOtp(["", "", "", "", "", ""]);
      
      // Reset countdown
      setCountdown(30);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !value.match(/^\d$/)) return;

    setOtp(prev => {
      const newOtp = [...prev];
      newOtp[index] = value;
      return newOtp;
    });

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector<HTMLInputElement>(`#otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input on backspace
      const prevInput = document.querySelector<HTMLInputElement>(`#otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>
      
      <div className="container mx-auto px-4 py-24">
        <Card className="max-w-md mx-auto bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center flex items-center justify-center gap-2">
              <ShieldCheck className="h-6 w-6 text-blue-400" />
              Phone Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === "phone" ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-2">
                    Enter your phone number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="pl-10 bg-gray-800 border-gray-700 text-white"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-400">
                    We&apos;ll send you a verification code
                  </p>
                </div>

                {error && (
                  <div className="text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || phoneNumber.length !== 10}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
                >
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Enter verification code sent to +91 {phoneNumber}
                  </label>
                  <div className="flex gap-2 justify-between">
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center bg-gray-800 border-gray-700 text-white text-lg"
                        disabled={isLoading}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      Didn&apos;t receive code?
                    </span>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={countdown > 0 || isLoading}
                      className={`text-blue-400 hover:text-blue-300 ${
                        countdown > 0 ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Button
                    type="submit"
                    disabled={isLoading || otp.some(digit => !digit)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
                  >
                    {isLoading ? "Verifying..." : "Verify"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setStep("phone");
                      setOtp(["", "", "", "", "", ""]);
                      setError("");
                    }}
                    disabled={isLoading}
                    className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                  >
                    Change Phone Number
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}