"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Lock,
  Eye, 
  EyeOff,
  RefreshCcw,
  CheckCircle,
  XCircle,
  KeyRound
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const PIN_LENGTH = 6;

export default function PINSetupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [isPinEnabled, setIsPinEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [step, setStep] = useState<'setup' | 'verify' | 'change'>('setup');

  useEffect(() => {
    checkPinStatus();
  }, []);

  const checkPinStatus = async () => {
    try {
      const response = await fetch('/api/security/pin-status');
      if (response.ok) {
        const data = await response.json();
        setIsPinEnabled(data.enabled);
        setStep(data.enabled ? 'verify' : 'setup');
      }
    } catch (error) {
      console.error('Failed to check PIN status:', error);
    }
  };

  const validatePin = (pinToValidate: string) => {
    const hasOnlyNumbers = /^\d+$/.test(pinToValidate);
    const hasSequentialNumbers = /(012|123|234|345|456|567|678|789)/.test(pinToValidate);
    const hasRepeatingNumbers = /(\d)\1{2,}/.test(pinToValidate);

    return {
      isValid: hasOnlyNumbers && !hasSequentialNumbers && !hasRepeatingNumbers,
      length: pinToValidate.length === PIN_LENGTH,
      hasOnlyNumbers,
      noSequential: !hasSequentialNumbers,
      noRepeating: !hasRepeatingNumbers
    };
  };

  const handleSetupPin = async () => {
    if (pin !== confirmPin) {
      toast({
        title: "PINs don't match",
        description: "Please make sure your PINs match",
        variant: "destructive"
      });
      return;
    }

    const validation = validatePin(pin);
    if (!validation.isValid) {
      toast({
        title: "Invalid PIN",
        description: "Please follow the PIN requirements",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/security/setup-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, confirmPin }),
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          title: "PIN Setup Successful",
          description: "Your transaction PIN has been set"
        });
        setIsPinEnabled(true);
        setStep('verify');
        // Clear the form
        setPin("");
        setConfirmPin("");
      } else {
        throw new Error('Failed to set PIN');
      }
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Could not set up PIN. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/security/verify-pin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ pin: currentPin })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      if (data.attemptsRemaining) {
        toast({
          title: "Incorrect PIN",
          description: `${data.message}. ${data.attemptsRemaining} attempts remaining.`,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "PIN Verified",
        description: "PIN verification successful"
      });

      router.push('/banking/dashboard');
      setCurrentPin("");
      
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePin = async () => {
    if (pin !== confirmPin) {
      toast({
        title: "PINs don't match",
        description: "Please make sure your new PINs match",
        variant: "destructive"
      });
      return;
    }
  
    const validation = validatePin(pin);
    if (!validation.isValid) {
      toast({
        title: "Invalid PIN",
        description: "Please follow the PIN requirements",
        variant: "destructive"
      });
      return;
    }
  
    setIsLoading(true);
    try {
      // First request - initiate PIN reset
      let response = await fetch('/api/security/reset-pin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ newPin: pin })
      });
  
      let data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to initiate PIN reset');
      }
  
      if (data.requiresVerification) {
        // Show verification code input dialog
        const verificationCode = prompt('Enter the verification code sent to your phone:');
        
        if (!verificationCode) {
          toast({
            title: "Verification Required",
            description: "Please enter the verification code to continue",
            variant: "destructive"
          });
          return;
        }
  
        // Second request - complete PIN reset with verification code
        response = await fetch('/api/security/reset-pin', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ 
            newPin: pin,
            verificationCode 
          })
        });
  
        data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || 'Failed to verify code');
        }
      }
  
      toast({
        title: "PIN Changed Successfully",
        description: "Your transaction PIN has been updated"
      });
      router.push('/banking/dashboard');
      
    } catch (error) {
      toast({
        title: "Change Failed",
        description: error instanceof Error ? error.message : "Could not change PIN. Please try again.",
        
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderPinRequirements = () => {
    const validation = validatePin(pin);
    return (
      <div className="space-y-2 mt-4">
        <h4 className="text-sm font-medium text-white">PIN Requirements:</h4>
        <div className="space-y-1">
          {[
            { check: validation.length, text: "6 digits long" },
            { check: validation.hasOnlyNumbers, text: "Contains only numbers" },
            { check: validation.noSequential, text: "No sequential numbers" },
            { check: validation.noRepeating, text: "No repeating numbers" }
          ].map((req, index) => (
            <div key={index} className="flex items-center text-sm">
              {req.check ? (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500 mr-2" />
              )}
              <span className={req.check ? "text-green-500" : "text-red-500"}>
                {req.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-black pt-24">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>

      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Transaction PIN</h1>
            <p className="text-gray-400">Setup or change your transaction PIN</p>
          </div>
        </div>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-6 w-6 mr-2 text-blue-400" />
              {step === 'setup' ? 'Setup PIN' : step === 'verify' ? 'Verify PIN' : 'Change PIN'}
            </CardTitle>
            <CardDescription>
              {step === 'setup' 
                ? 'Create a secure 6-digit PIN for transactions' 
                : step === 'verify'
                ? 'Enter your PIN to continue'
                : 'Create a new 6-digit PIN'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 'verify' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-pin">Enter PIN</Label>
                  <div className="relative">
                    <Input
                      id="current-pin"
                      type={showPin ? "text" : "password"}
                      value={currentPin}
                      onChange={(e) => setCurrentPin(e.target.value)}
                      maxLength={PIN_LENGTH}
                      className="bg-gray-800/50 border-gray-700 pr-10"
                      placeholder="Enter your PIN"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPin(!showPin)}
                    >
                      {showPin ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
                    onClick={() => handleVerifyPin()}
                    disabled={isLoading || currentPin.length !== PIN_LENGTH}
                  >
                    {isLoading ? "Verifying..." : "Verify PIN"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 hover:bg-gray-800"
                    onClick={() => setStep('change')}
                  >
                    <KeyRound className="h-4 w-4 mr-2" />
                    Forgot PIN? 
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pin">
                    {step === 'setup' ? 'New PIN' : 'Enter New PIN'}
                  </Label>
                  <div className="relative">
                    <Input
                      id="pin"
                      type={showPin ? "text" : "password"}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      maxLength={PIN_LENGTH}
                      className="bg-gray-800/50 border-gray-700 pr-10"
                      placeholder="Enter 6-digit PIN"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPin(!showPin)}
                    >
                      {showPin ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-pin">Confirm PIN</Label>
                  <Input
                    id="confirm-pin"
                    type={showPin ? "text" : "password"}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    maxLength={PIN_LENGTH}
                    className="bg-gray-800/50 border-gray-700"
                    placeholder="Confirm 6-digit PIN"
                  />
                </div>

                {renderPinRequirements()}

                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
                  onClick={step === 'setup' ? handleSetupPin : handleChangePin}
                  disabled={isLoading || pin.length !== PIN_LENGTH || confirmPin.length !== PIN_LENGTH}
                >
                  {isLoading ? (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                      {step === 'setup' ? "Setting up..." : "Changing..."}
                    </>
                  ) : (
                    step === 'setup' ? "Set PIN" : "Change PIN"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}