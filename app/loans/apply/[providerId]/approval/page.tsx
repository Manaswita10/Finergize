'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from 'framer-motion';

// Helper for currency formatting
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Value ranges for standardization
const RealValueRanges = {
  annual_income: { min: 0, max: 100000000 },  // 0 to 10Cr
  credit_score: { min: 300, max: 850 },      
  person_age: { min: 18, max: 80 },          
  debt_to_income: { min: 0, max: 100 },      
  Education: { min: 1, max: 5 },            
  credit_risk: { min: 0, max: 100 },         
  Mortgage: { min: 0, max: 100000000 },     
  emp_length: { min: 0, max: 50 },           
  credit_card_usage: { min: 0, max: 100 },   
  CreditCard: { min: 1, max: 5 },           
  person_home_ownership: { min: 0, max: 3 }  
};

// Standardization helper
const standardizeValue = (value: number, min: number, max: number): number => {
  if (value < min) value = min;
  if (value > max) value = max;
  return Number(((2 * (value - min)) / (max - min) - 1).toFixed(4));
};

interface LoanData {
  loanInfo: {
    type: string;
    amount: number;
    term: number;
    interestRate: number;
    monthlyPayment: number;
    processingFee: number;
    totalAmount: number;
    standardizedAmount: number;
    standardizedTerm: number;
    standardizedRate: number;
  };
}

export default function LoanApprovalPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);
  
  const [loanData, setLoanData] = useState<LoanData | null>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('loanApplicationData');
      return savedData ? JSON.parse(savedData) : null;
    }
    return null;
  });

  const [formData, setFormData] = useState({
    loanType: loanData?.loanInfo?.type || 'student',
    annualIncome: '',
    creditScore: '',
    age: '',
    debtToIncome: '',
    educationLevel: '',
    creditRisk: '',
    empLength: '',
    creditCardUsage: '',
    creditCardActivity: '',
    mortgage: '',
    homeOwnership: '0'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const prepareStandardizedData = () => {
    if (!loanData) return null;

    // Common fields
    const standardizedData = {
      loan_type: formData.loanType,
      loan_amount: loanData.loanInfo.standardizedAmount,
      term: loanData.loanInfo.standardizedTerm,
      int_rate: loanData.loanInfo.standardizedRate,
      annual_income: standardizeValue(
        Number(formData.annualIncome),
        RealValueRanges.annual_income.min,
        RealValueRanges.annual_income.max
      ),
      credit_score: standardizeValue(
        Number(formData.creditScore),
        RealValueRanges.credit_score.min,
        RealValueRanges.credit_score.max
      ),
      person_age: standardizeValue(
        Number(formData.age),
        RealValueRanges.person_age.min,
        RealValueRanges.person_age.max
      ),
      debt_to_income: standardizeValue(
        Number(formData.debtToIncome),
        RealValueRanges.debt_to_income.min,
        RealValueRanges.debt_to_income.max
      ),
      income_to_loan: Number(formData.annualIncome) / Number(loanData.loanInfo.amount)
    };

    // Add loan type specific fields
    switch (formData.loanType) {
      case 'student':
        return {
          ...standardizedData,
          Education: standardizeValue(
            Number(formData.educationLevel),
            RealValueRanges.Education.min,
            RealValueRanges.Education.max
          ),
          credit_risk: standardizeValue(
            Number(formData.creditRisk),
            RealValueRanges.credit_risk.min,
            RealValueRanges.credit_risk.max
          )
        };

      case 'agricultural':
        return {
          ...standardizedData,
          Mortgage: standardizeValue(
            Number(formData.mortgage),
            RealValueRanges.Mortgage.min,
            RealValueRanges.Mortgage.max
          ),
          person_home_ownership: Number(formData.homeOwnership),
          emp_length: standardizeValue(
            Number(formData.empLength),
            RealValueRanges.emp_length.min,
            RealValueRanges.emp_length.max
          )
        };

      case 'business':
        return {
          ...standardizedData,
          emp_length: standardizeValue(
            Number(formData.empLength),
            RealValueRanges.emp_length.min,
            RealValueRanges.emp_length.max
          ),
          credit_card_usage: standardizeValue(
            Number(formData.creditCardUsage),
            RealValueRanges.credit_card_usage.min,
            RealValueRanges.credit_card_usage.max
          ),
          CreditCard: standardizeValue(
            Number(formData.creditCardActivity),
            RealValueRanges.CreditCard.min,
            RealValueRanges.CreditCard.max
          )
        };

      default:
        return standardizedData;
    }
  };

  const validateForm = () => {
    if (!formData.annualIncome) return "Please enter your annual income";
    if (!formData.creditScore) return "Please enter your credit score";
    if (!formData.age) return "Please enter your age";
    if (!formData.debtToIncome) return "Please enter your debt to income ratio";

    switch (formData.loanType) {
      case 'student':
        if (!formData.educationLevel) return "Please enter your education level";
        if (!formData.creditRisk) return "Please enter credit risk score";
        break;

      case 'agricultural':
        if (!formData.empLength) return "Please enter your agricultural experience";
        if (!formData.mortgage) return "Please enter mortgage details";
        if (!formData.homeOwnership) return "Please select home ownership status";
        break;

      case 'business':
        if (!formData.empLength) return "Please enter your business experience";
        if (!formData.creditCardUsage) return "Please enter credit card usage percentage";
        if (!formData.creditCardActivity) return "Please enter credit card activity level";
        break;
    }

    return "";
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const standardizedData = prepareStandardizedData();
    if (!standardizedData) {
      setError("Failed to prepare application data");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('https://loan-approval-api.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(standardizedData)
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const result = await response.json();
      setResult(result);
    } catch (err) {
      setError("Failed to process loan application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!loanData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">No loan application data found. Please start from the loan calculator.</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black relative pb-20">
      <div className="container mx-auto px-4 pt-8">
        <nav className="flex items-center mb-12 backdrop-blur-sm bg-white/5 rounded-full p-2 px-4 w-full max-w-4xl mx-auto">
          <Link href="/loans/calculator" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Calculator
          </Link>
        </nav>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <Card className="bg-white/[0.05] border-0 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                Complete Your Loan Application
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
                  {error}
                </div>
              )}

              {/* Loan Details */}
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white mb-3">Loan Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Amount:</span>
                    <span className="text-white ml-2">{formatCurrency(loanData.loanInfo.amount)}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Term:</span>
                    <span className="text-white ml-2">{loanData.loanInfo.term} months</span>
                  </div>
                  <div>
                    <span className="text-white/60">Interest Rate:</span>
                    <span className="text-white ml-2">{loanData.loanInfo.interestRate}%</span>
                  </div>
                  <div>
                    <span className="text-white/60">EMI:</span>
                    <span className="text-white ml-2">{formatCurrency(loanData.loanInfo.monthlyPayment)}</span>
                  </div>
                </div>
              </div>

              {/* Loan Type Selection */}
              <div className="space-y-4">
                <Label>Loan Type</Label>
                <RadioGroup
                  value={formData.loanType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, loanType: value }))}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="agricultural" id="agricultural" />
                    <Label htmlFor="agricultural">Agricultural</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="business" id="business" />
                    <Label htmlFor="business">Business</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Common Fields */}
                <div className="space-y-2">
                  <Label>Annual Income (₹)</Label>
                  <Input
                    type="number"
                    name="annualIncome"
                    value={formData.annualIncome}
                    onChange={handleInputChange}
                    placeholder="Enter your annual income"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Credit Score</Label>
                  <Input
                    type="number"
                    name="creditScore"
                    value={formData.creditScore}
                    onChange={handleInputChange}
                    placeholder="300-850"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Your age"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Debt to Income Ratio (%)</Label>
                  <Input
                    type="number"
                    name="debtToIncome"
                    value={formData.debtToIncome}
                    onChange={handleInputChange}
                    placeholder="Enter ratio"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                {/* Student Loan Fields */}
                {formData.loanType === 'student' && (
                  <>
                    <div className="space-y-2">
                      <Label>Education Level (1-5)</Label>
                      <Input
                        type="number"
                        name="educationLevel"
                        value={formData.educationLevel}
                        onChange={handleInputChange}
                        placeholder="1=High School, 5=Post Graduate"
                        className="bg-white/5 border-white/10 text-white"
                        />
                        <p className="text-xs text-white/50">
                          1=High School, 2=Some College, 3=Bachelor's, 4=Master's, 5=Post Graduate
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Credit Risk Score</Label>
                        <Input
                          type="number"
                          name="creditRisk"
                          value={formData.creditRisk}
                          onChange={handleInputChange}
                          placeholder="Enter credit risk score"
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </>
                  )}
  
                  {/* Agricultural Loan Fields */}
                  {formData.loanType === 'agricultural' && (
                    <>
                      <div className="space-y-2">
                        <Label>Agricultural Experience (Years)</Label>
                        <Input
                          type="number"
                          name="empLength"
                          value={formData.empLength}
                          onChange={handleInputChange}
                          placeholder="Years of experience"
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Mortgage Amount (₹)</Label>
                        <Input
                          type="number"
                          name="mortgage"
                          value={formData.mortgage}
                          onChange={handleInputChange}
                          placeholder="Current mortgage amount"
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Home Ownership</Label>
                        <select
                          name="homeOwnership"
                          value={formData.homeOwnership}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border-white/10 text-white rounded-md p-2"
                        >
                          <option value="0">Rent</option>
                          <option value="1">Own</option>
                          <option value="2">Mortgage</option>
                          <option value="3">Other</option>
                        </select>
                      </div>
                    </>
                  )}
  
                  {/* Business Loan Fields */}
                  {formData.loanType === 'business' && (
                    <>
                      <div className="space-y-2">
                        <Label>Business Experience (Years)</Label>
                        <Input
                          type="number"
                          name="empLength"
                          value={formData.empLength}
                          onChange={handleInputChange}
                          placeholder="Years of business experience"
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Credit Card Usage (%)</Label>
                        <Input
                          type="number"
                          name="creditCardUsage"
                          value={formData.creditCardUsage}
                          onChange={handleInputChange}
                          placeholder="Monthly usage percentage"
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Credit Card Activity Level</Label>
                        <Input
                          type="number"
                          name="creditCardActivity"
                          value={formData.creditCardActivity}
                          onChange={handleInputChange}
                          placeholder="1-5"
                          className="bg-white/5 border-white/10 text-white"
                        />
                        <p className="text-xs text-white/50">
                          1=Minimal, 2=Low, 3=Moderate, 4=High, 5=Very High usage
                        </p>
                      </div>
                    </>
                  )}
                </div>
  
                {/* Submit Button */}
                <Button 
                  onClick={handleSubmit}
                  className="w-full relative group h-12"
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative text-white font-medium flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Check Loan Approval
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </span>
                </Button>
              </CardContent>
            </Card>
  
            {/* Result Display */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-white/[0.05] border-0 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className={`text-2xl bg-gradient-to-r ${
                      result.approved 
                        ? 'from-green-400 to-emerald-400' 
                        : 'from-red-400 to-rose-400'
                    } text-transparent bg-clip-text`}>
                      Loan {result.approved ? 'Approved!' : 'Not Approved'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className={`p-6 rounded-lg ${
                      result.approved 
                        ? 'bg-green-500/10 border border-green-500/20' 
                        : 'bg-red-500/10 border border-red-500/20'
                    }`}>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">Confidence Score</span>
                          <span className="text-white font-medium">{result.confidence}%</span>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-white/80">Feedback:</h4>
                          <ul className="space-y-2">
                            {result.feedback.map((item: string, index: number) => (
                              <li 
                                key={index} 
                                className={`text-sm ${
                                  item.includes("Congratulations") || item.includes("strengths")
                                    ? 'text-green-400'
                                    : item.includes("not approved") || item.includes("improvement")
                                    ? 'text-red-400'
                                    : 'text-white/70'
                                }`}
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
  
                    <Button 
                      onClick={() => router.push('/loans/calculator')}
                      className="w-full relative group h-12"
                    >
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                      <span className="relative text-white font-medium">
                        Return to Loan Calculator
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    );
  }