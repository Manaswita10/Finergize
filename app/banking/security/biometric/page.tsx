// app/banking/security/biometric/page.tsx

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowLeft, Fingerprint, Shield, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function BiometricAuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
    checkCurrentStatus();
  }, []);

  const checkBiometricAvailability = async () => {
    if (window.PublicKeyCredential) {
      try {
        const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        setIsBiometricAvailable(available);
      } catch (error) {
        setIsBiometricAvailable(false);
      }
    }
  };

  const checkCurrentStatus = async () => {
    try {
      const response = await fetch('/api/security/biometric-status');
      if (response.ok) {
        const data = await response.json();
        setIsEnabled(data.enabled);
      }
    } catch (error) {
      console.error('Failed to check biometric status:', error);
    }
  };

  const handleEnableBiometric = async () => {
    setIsLoading(true);
    try {
      // Request biometric authentication
      const publicKeyCredentialCreationOptions = {
        challenge: new Uint8Array(32),
        rp: {
          name: "Finergize",
          id: window.location.hostname
        },
        user: {
          id: new Uint8Array(16),
          name: "user@example.com",
          displayName: "User"
        },
        pubKeyCredParams: [{alg: -7, type: "public-key"}],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          requireResidentKey: false,
          userVerification: "required"
        },
        timeout: 60000,
        attestation: "direct"
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      });

      if (credential) {
        // Send credential to server
        const response = await fetch('/api/security/enable-biometric', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential })
        });

        if (response.ok) {
          setIsEnabled(true);
          toast({
            title: "Biometric Authentication Enabled",
            description: "Your device biometrics are now set up for login"
          });
        } else {
          throw new Error('Failed to enable biometric');
        }
      }
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Could not enable biometric authentication",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="text-2xl font-bold text-white">Biometric Security</h1>
            <p className="text-gray-400">Manage biometric authentication settings</p>
          </div>
        </div>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Fingerprint className="h-6 w-6 mr-2 text-blue-400" />
              Device Biometrics
            </CardTitle>
            <CardDescription>
              Use your device's biometric authentication for secure access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isBiometricAvailable ? (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                <p className="text-yellow-500 text-sm">
                  Biometric authentication is not available on this device
                </p>
              </div>
            ) : isEnabled ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <p className="text-green-500">Biometric authentication is enabled</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Your device biometrics are set up for secure login
                  </p>
                </div>
              </div>
            ) : (
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
                onClick={handleEnableBiometric}
                disabled={isLoading}
              >
                {isLoading ? (
                  "Setting up..."
                ) : (
                  <>
                    <Fingerprint className="mr-2 h-4 w-4" />
                    Enable Biometric Login
                  </>
                )}
              </Button>
            )}

            <div className="space-y-4 mt-6">
              <h3 className="text-white font-semibold">About Biometric Security</h3>
              <ul className="space-y-2">
                <li className="text-gray-400 text-sm flex items-start">
                  <Shield className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                  Your biometric data never leaves your device
                </li>
                <li className="text-gray-400 text-sm flex items-start">
                  <Shield className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                  Securely authenticated using device hardware
                </li>
                <li className="text-gray-400 text-sm flex items-start">
                  <Shield className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                  Faster and more secure than traditional passwords
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}