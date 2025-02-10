// components/mutual-funds/InvestmentModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DollarSign,
    Calendar,
    ArrowRight,
    CreditCard,
    Wallet,
    Bank,
    Calculator,
    ChevronLeft,
    AlertCircle,
    CheckCircle2,
    Info
} from 'lucide-react';
import BlockchainService from '@/services/blockchain';
import { toast } from '@/components/ui/use-toast';

interface Fund {
    _id: string;
    name: string;
    category: string;
    riskLevel: string;
    nav: number;
    aum: number;
    minInvestment: number;
    blockchainFundId?: string;
}

interface InvestmentModalProps {
    fund: Fund;
    isOpen: boolean;
    onClose: () => void;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ fund, isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [investmentType, setInvestmentType] = useState<'LUMPSUM' | 'SIP'>('LUMPSUM');
    const [amount, setAmount] = useState('');
    const [sipDate, setSipDate] = useState('1');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const getMinimumInvestment = () => {
        return investmentType === 'LUMPSUM' ? fund.minInvestment : Math.min(fund.minInvestment, 1000);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setAmount(value);
        setError('');
    };

    const validateStep = () => {
        if (currentStep === 1) {
            const minAmount = getMinimumInvestment();
            if (!amount) {
                setError('Please enter an investment amount');
                return false;
            }
            if (parseFloat(amount) < minAmount) {
                setError(`Minimum ${investmentType.toLowerCase()} amount is ₹${minAmount.toLocaleString()}`);
                return false;
            }
        }

        if (currentStep === 2 && !paymentMethod) {
            setError('Please select a payment method');
            return false;
        }

        return true;
    };

    const handleNextStep = () => {
        if (validateStep()) {
            setCurrentStep(prev => prev + 1);
            setError('');
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => prev - 1);
        setError('');
    };

    const handleSubmit = async () => {
        try {
            setIsProcessing(true);
            setError('');

            await BlockchainService.invest(
                fund.blockchainFundId || fund._id,
                parseFloat(amount),
                investmentType,
                investmentType === 'SIP' ? parseInt(sipDate) : 1
            );

            setCurrentStep(4);
            toast({
                title: "Investment Successful",
                description: "Your investment has been processed successfully.",
            });
        } catch (error) {
            console.error('Investment error:', error);
            setError('Failed to process investment. Please try again.');
            toast({
                title: "Investment Failed",
                description: error instanceof Error ? error.message : "Failed to process investment",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const renderInvestmentTypeStep = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                    variant={investmentType === 'LUMPSUM' ? 'default' : 'outline'}
                    onClick={() => setInvestmentType('LUMPSUM')}
                    className={`h-24 ${investmentType === 'LUMPSUM' 
                        ? 'bg-blue-500 hover:bg-blue-600' 
                        : 'border-gray-700 hover:border-gray-600'}`}
                >
                    <div className="text-center">
                        <DollarSign className="w-6 h-6 mb-2 mx-auto" />
                        <div className="font-semibold">One-Time Investment</div>
                        <div className="text-sm text-gray-400">Min: ₹{getMinimumInvestment().toLocaleString()}</div>
                    </div>
                </Button>

                <Button
                    variant={investmentType === 'SIP' ? 'default' : 'outline'}
                    onClick={() => setInvestmentType('SIP')}
                    className={`h-24 ${investmentType === 'SIP' 
                        ? 'bg-blue-500 hover:bg-blue-600' 
                        : 'border-gray-700 hover:border-gray-600'}`}
                >
                    <div className="text-center">
                        <Calendar className="w-6 h-6 mb-2 mx-auto" />
                        <div className="font-semibold">Monthly SIP</div>
                        <div className="text-sm text-gray-400">Min: ₹{getMinimumInvestment().toLocaleString()}</div>
                    </div>
                </Button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Investment Amount
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                        <input
                            type="text"
                            value={amount}
                            onChange={handleAmountChange}
                            className="w-full pl-8 pr-4 py-2 bg-slate-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                            placeholder="Enter amount"
                        />
                    </div>
                    {error && (
                        <p className="text-red-400 text-sm mt-1">{error}</p>
                    )}
                </div>

                {investmentType === 'SIP' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            SIP Date
                        </label>
                        <select
                            value={sipDate}
                            onChange={(e) => setSipDate(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                        >
                            {[1, 5, 10, 15, 20, 25].map((date) => (
                                <option key={date} value={date}>
                                    {date}th of every month
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );

    const renderPaymentStep = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                {[
                    { id: 'wallet', title: 'Pay with Wallet', icon: Wallet, description: 'Pay using your crypto wallet' }
                ].map((method) => (
                    <Button
                        key={method.id}
                        variant="outline"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`h-20 justify-start px-4 ${
                            paymentMethod === method.id
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-gray-700'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-slate-700/50">
                                <method.icon className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold">{method.title}</div>
                                <div className="text-sm text-gray-400">
                                    {method.description}
                                </div>
                            </div>
                        </div>
                    </Button>
                ))}
            </div>

            <Card className="bg-slate-800/50 border-gray-700">
                <CardContent className="p-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Investment Amount</span>
                            <span className="text-white">₹{parseInt(amount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Investment Type</span>
                            <span className="text-white capitalize">{investmentType}</span>
                        </div>
                        {investmentType === 'SIP' && (
                            <div className="flex justify-between">
                                <span className="text-gray-400">SIP Date</span>
                                <span className="text-white">{sipDate}th of every month</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderConfirmationStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <div className="inline-block p-3 rounded-full bg-blue-500/20 mb-4">
                    <Info className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Confirm Your Investment
                </h3>
                <p className="text-gray-400">
                    Please review the details below before proceeding
                </p>
            </div>

            <Card className="bg-slate-800/50 border-gray-700">
                <CardContent className="p-4">
                    <div className="space-y-4">
                        <div className="pb-4 border-b border-gray-700">
                            <h4 className="text-lg font-semibold text-white mb-2">
                                Fund Details
                            </h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Fund Name</span>
                                    <span className="text-white">{fund.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Category</span>
                                    <span className="text-white">{fund.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">NAV</span>
                                    <span className="text-white">₹{fund.nav}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-white mb-2">
                                Investment Details
                            </h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Amount</span>
                                    <span className="text-white">₹{parseInt(amount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Type</span>
                                    <span className="text-white capitalize">{investmentType}</span>
                                </div>
                                {investmentType === 'SIP' && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">SIP Date</span>
                                        <span className="text-white">{sipDate}th of every month</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderSuccessStep = () => (
        <div className="text-center space-y-6">
            <div className="inline-block p-3 rounded-full bg-green-500/20">
                <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
            <div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                    Investment Successful!
                </h3>
                <p className="text-gray-400">
                    Your investment has been processed successfully
                </p>
            </div>
            <Card className="bg-slate-800/50 border-gray-700">
                <CardContent className="p-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Transaction ID</span>
                            <span className="text-white">#MF{Date.now()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Investment Amount</span>
                            <span className="text-white">₹{parseInt(amount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Investment Type</span>
                            <span className="text-white capitalize">{investmentType}</span>
                        </div>
                        {investmentType === 'SIP' && (
                            <div className="flex justify-between">
                                <span className="text-gray-400">SIP Date</span>
                                <span className="text-white">{sipDate}th of every month</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            <div className="space-y-4">
                <Button
                    onClick={onClose}
                    className="bg-blue-500 hover:bg-blue-600 w-full"
                >
                    Done
                </Button>
            </div>
        </div>
    );

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.2
            }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            transition: {
                duration: 0.2
            }
        }
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={overlayVariants}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            <div className="min-h-screen px-4 text-center">
                <span
                    className="inline-block h-screen align-middle"
                    aria-hidden="true"
                >
                    &#8203;
                </span>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={modalVariants}
                    className="inline-block w-full max-w-2xl p-6 my-8 text-left align-middle bg-slate-900 rounded-2xl border border-gray-800 shadow-xl relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {fund.name}
                                </h2>
                                <p className="text-gray-400">
                                    NAV: ₹{fund.nav} • {fund.category}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                <span className="sr-only">Close</span>
                                <svg
                                    className="w-6 h-6 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Progress Steps */}
                        <div className="flex justify-between items-center mt-6">
                            {[
                                'Investment Details',
                                'Payment Method',
                                'Confirmation',
                                'Success'
                            ].map((step, index) => (
                                <div
                                    key={step}
                                    className="flex items-center"
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            index + 1 === currentStep
                                                ? 'bg-blue-500 text-white'
                                                : index + 1 < currentStep
                                                ? 'bg-green-500 text-white'
                                                : 'bg-slate-700 text-gray-400'
                                        }`}
                                    >
                                        {index + 1 < currentStep ? (
                                            <CheckCircle2 className="w-5 h-5" />
                                        ) : (
                                            index + 1
                                        )}
                                    </div>
                                    {index < 3 && (
                                        <div
                                            className={`w-full h-1 mx-2 ${
                                                index + 1 < currentStep
                                                    ? 'bg-green-500'
                                                    : 'bg-slate-700'
                                            }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mt-8">
                        {currentStep === 1 && renderInvestmentTypeStep()}
                        {currentStep === 2 && renderPaymentStep()}
                        {currentStep === 3 && renderConfirmationStep()}
                        {currentStep === 4 && renderSuccessStep()}
                    </div>

                    {/* Footer */}
                    {currentStep < 4 && (
                        <div className="mt-8 flex justify-between">
                            {currentStep > 1 ? (
                                <Button
                                    variant="outline"
                                    onClick={handlePrevStep}
                                    className="border-gray-700"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    className="border-gray-700"
                                >
                                    Cancel
                                </Button>
                            )}
                            
                            {currentStep === 3 ? (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isProcessing}
                                    className="bg-blue-500 hover:bg-blue-600"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Confirm Investment'
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleNextStep}
                                    disabled={
                                        currentStep === 1 && (!amount || !!error) ||
                                        currentStep === 2 && !paymentMethod
                                    }
                                    className="bg-blue-500 hover:bg-blue-600"
                                >
                                    Continue
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default InvestmentModal;