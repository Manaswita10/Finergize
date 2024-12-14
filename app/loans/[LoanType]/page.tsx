'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, User, ShieldCheck, Mail, Phone } from 'lucide-react';
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

export default function LoanApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const LoanType = params.LoanType as string;
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      age: '',
      gender: 'male'
    },
    documentInfo: {
      idType: 'aadhaar',
      idNumber: ''
    },
    contactInfo: {
      email: '',
      phoneNumber: ''
    }
  });

  const loanTitles = {
    business: "Business Loan Information",
    agriculture: "Agriculture Loan Information",
    education: "Education Loan Information"
  };

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/loans/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loanType: LoanType,
          ...formData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      toast({
        title: "Success!",
        description: "Your loan application has been submitted successfully. Redirecting to loan providers...",
      });

      // Reset form
      setFormData({
        personalInfo: {
          fullName: '',
          age: '',
          gender: 'male'
        },
        documentInfo: {
          idType: 'aadhaar',
          idNumber: ''
        },
        contactInfo: {
          email: '',
          phoneNumber: ''
        }
      });

      // Wait for a short moment to show the success message
      setTimeout(() => {
        // Redirect to loan providers page
        router.push(`/loans/providers/${LoanType}`);
      }, 2000);

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit loan application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black relative pb-20">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>
      
      <div className="container mx-auto px-4 pt-8">
        <Link href="/loans" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Loans
        </Link>

        <Card className="max-w-4xl mx-auto bg-gray-900/50 border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              {loanTitles[LoanType] || "Loan Application"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              Please fill in your details accurately as per your documents
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-8">
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-blue-400">
                    <User className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-200">Full Name (as per documents)</Label>
                      <Input 
                        id="fullName" 
                        placeholder="Enter your full name"
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                        value={formData.personalInfo.fullName}
                        onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-gray-200">Age</Label>
                      <Input 
                        id="age" 
                        type="number" 
                        placeholder="Enter your age"
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                        value={formData.personalInfo.age}
                        onChange={(e) => handleInputChange('personalInfo', 'age', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-200">Gender</Label>
                      <RadioGroup 
                        value={formData.personalInfo.gender}
                        onValueChange={(value) => handleInputChange('personalInfo', 'gender', value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male" className="text-gray-300">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female" className="text-gray-300">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other" className="text-gray-300">Other</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* Document Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-blue-400">
                    <ShieldCheck className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Document Information</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-200">ID Type</Label>
                      <RadioGroup 
                        value={formData.documentInfo.idType}
                        onValueChange={(value) => handleInputChange('documentInfo', 'idType', value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="aadhaar" id="aadhaar" />
                          <Label htmlFor="aadhaar" className="text-gray-300">Aadhaar Card</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pan" id="pan" />
                          <Label htmlFor="pan" className="text-gray-300">PAN Card</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idNumber" className="text-gray-200">ID Number</Label>
                      <Input 
                        id="idNumber" 
                        placeholder="Enter Aadhaar/PAN number"
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                        value={formData.documentInfo.idNumber}
                        onChange={(e) => handleInputChange('documentInfo', 'idNumber', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Mail className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-200">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email"
                        placeholder="Enter your email address"
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                        value={formData.contactInfo.email}
                        onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-200">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel"
                        placeholder="Enter your phone number"
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                        value={formData.contactInfo.phoneNumber}
                        onChange={(e) => handleInputChange('contactInfo', 'phoneNumber', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 py-6 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Next'}
                </Button>
                <p className="text-gray-400 text-sm text-center mt-4">
                  By submitting this application, you agree to our terms and conditions
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}