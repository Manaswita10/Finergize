import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://finergize-admin:ArshaviMana1910@cluster0.8akiu.mongodb.net/financial-inclusion?retryWrites=true&w=majority&appName=Cluster0";

const interestRateSchema = new mongoose.Schema({
  durationInYears: Number,
  rate: Number,
});

const loanProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    required: true
  },
  interestRates: [interestRateSchema],
  taxes: {
    processingFee: {
      type: Number,
      required: true
    },
    documentationCharges: {
      type: Number,
      default: 0
    },
    GST: {
      type: Number,
      required: true
    }
  },
  termsAndConditions: [String],
  minimumLoanAmount: {
    type: Number,
    required: true
  },
  maximumLoanAmount: {
    type: Number,
    required: true
  },
  supportedLoanTypes: [{
    type: String,
    enum: ['business', 'agriculture', 'education']
  }],
  processingTime: {
    type: String,
    required: true
  }
});

const LoanProvider = mongoose.models.LoanProvider || mongoose.model('LoanProvider', loanProviderSchema);

const loanProvidersData = [
  {
    name: "State Bank of India",
    image: "https://www.shutterstock.com/image-vector/state-bank-india-sbi-indian-260nw-2359928535.jpg",
    interestRates: [
      { durationInYears: 1, rate: 8.5 },
      { durationInYears: 3, rate: 9.0 },
      { durationInYears: 5, rate: 9.5 }
    ],
    taxes: {
      processingFee: 1.5,
      documentationCharges: 1000,
      GST: 18
    },
    termsAndConditions: [
      "Minimum age of applicant should be 21 years",
      "Maximum age at loan maturity should not exceed 65 years",
      "Minimum income requirement of ₹25,000 per month",
      "Clean credit history required",
      "Collateral may be required for loans above ₹10 lakhs"
    ],
    minimumLoanAmount: 100000,
    maximumLoanAmount: 5000000,
    supportedLoanTypes: ['business', 'agriculture', 'education'],
    processingTime: "3-5 business days"
  },
  {
    name: "HDFC Bank",
    image: "https://i.pinimg.com/1200x/cc/15/74/cc1574e6b15ed8aa8a7759c2c9220429.jpg",
    interestRates: [
      { durationInYears: 1, rate: 8.75 },
      { durationInYears: 3, rate: 9.25 },
      { durationInYears: 5, rate: 9.75 }
    ],
    taxes: {
      processingFee: 2,
      documentationCharges: 1500,
      GST: 18
    },
    termsAndConditions: [
      "Minimum age of applicant should be 23 years",
      "Maximum age at loan maturity should not exceed 60 years",
      "Minimum income requirement of ₹30,000 per month",
      "No existing loans should be present",
      "Collateral required for all business loans"
    ],
    minimumLoanAmount: 200000,
    maximumLoanAmount: 10000000,
    supportedLoanTypes: ['business', 'education'],
    processingTime: "2-4 business days"
  },
  {
    name: "Statpro Fintech Bank",
    image: "https://mms.businesswire.com/media/20190624005351/en/729351/22/StatPro-Blue-Diamond.jpg",
    interestRates: [
      { durationInYears: 1, rate: 8.9 },
      { durationInYears: 3, rate: 9.3 },
      { durationInYears: 5, rate: 9.8 }
    ],
    taxes: {
      processingFee: 1.75,
      documentationCharges: 1250,
      GST: 18
    },
    termsAndConditions: [
      "Minimum age of applicant should be 22 years",
      "Maximum age at loan maturity should not exceed 62 years",
      "Minimum income requirement of ₹28,000 per month",
      "Credit score above 700 required",
      "Flexible collateral options available"
    ],
    minimumLoanAmount: 150000,
    maximumLoanAmount: 7500000,
    supportedLoanTypes: ['business', 'education', 'agriculture'],
    processingTime: "2-3 business days"
  },
  {
    name: "DBS Bank",
    image: "https://logowik.com/content/uploads/images/dbs-bank4300.jpg",
    interestRates: [
      { durationInYears: 1, rate: 8.8 },
      { durationInYears: 3, rate: 9.2 },
      { durationInYears: 5, rate: 9.6 }
    ],
    taxes: {
      processingFee: 1.8,
      documentationCharges: 1300,
      GST: 18
    },
    termsAndConditions: [
      "Minimum age of applicant should be 21 years",
      "Maximum age at loan maturity should not exceed 63 years",
      "Minimum income requirement of ₹27,000 per month",
      "Credit score above 680 required",
      "Digital documentation process available"
    ],
    minimumLoanAmount: 175000,
    maximumLoanAmount: 8000000,
    supportedLoanTypes: ['business', 'education'],
    processingTime: "3-4 business days"
  },
  {
    name: "Dev Finance Bank",
    image: "https://pbs.twimg.com/profile_images/965997508253143042/jIArWClE_400x400.jpg",
    interestRates: [
      { durationInYears: 1, rate: 8.95 },
      { durationInYears: 3, rate: 9.35 },
      { durationInYears: 5, rate: 9.85 }
    ],
    taxes: {
      processingFee: 1.9,
      documentationCharges: 1400,
      GST: 18
    },
    termsAndConditions: [
      "Minimum age of applicant should be 23 years",
      "Maximum age at loan maturity should not exceed 61 years",
      "Minimum income requirement of ₹32,000 per month",
      "Credit score above 710 required",
      "Quick approval process for premium customers"
    ],
    minimumLoanAmount: 250000,
    maximumLoanAmount: 9000000,
    supportedLoanTypes: ['business', 'education', 'agriculture'],
    processingTime: "2-3 business days"
  },
  {
    name: "IIFC Gold Loan",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/IFIC_New_Logo.jpg/1200px-IFIC_New_Logo.jpg",
    interestRates: [
      { durationInYears: 1, rate: 8.5 },
      { durationInYears: 3, rate: 9.0 },
      { durationInYears: 5, rate: 9.5 }
    ],
    taxes: {
      processingFee: 1.5,
      documentationCharges: 1000,
      GST: 18
    },
    termsAndConditions: [
      "Minimum age of applicant should be 21 years",
      "Maximum age at loan maturity should not exceed 65 years",
      "Minimum income requirement of ₹25,000 per month",
      "Clean credit history required",
      "Collateral may be required for loans above ₹10 lakhs"
    ],
    minimumLoanAmount: 100000,
    maximumLoanAmount: 5000000,
    supportedLoanTypes: ['business', 'agriculture', 'education'],
    processingTime: "3-5 business days"
  },
  {
    name: "Bajaj Finance",
    image: "https://tscfm.org/wp-content/uploads/2023/09/Bajaj-finance-in-talks-with-4-investment-banks-to-raise-800mn-1024x768.png",
    interestRates: [
      { durationInYears: 1, rate: 8.75 },
      { durationInYears: 3, rate: 9.25 },
      { durationInYears: 5, rate: 9.75 }
    ],
    taxes: {
      processingFee: 2,
      documentationCharges: 1500,
      GST: 18
    },
    termsAndConditions: [
      "Minimum age of applicant should be 23 years",
      "Maximum age at loan maturity should not exceed 60 years",
      "Minimum income requirement of ₹30,000 per month",
      "No existing loans should be present",
      "Collateral required for all business loans"
    ],
    minimumLoanAmount: 200000,
    maximumLoanAmount: 10000000,
    supportedLoanTypes: ['business', 'education'],
    processingTime: "2-4 business days"
  },
  {
    name: "ICICI Bank",
    image: "https://companieslogo.com/img/orig/IBN-af38b5c0.png",
    interestRates: [
      { durationInYears: 1, rate: 8.9 },
      { durationInYears: 3, rate: 9.3 },
      { durationInYears: 5, rate: 9.8 }
    ],
    taxes: {
      processingFee: 1.75,
      documentationCharges: 1250,
      GST: 18
    },
    termsAndConditions: [
      "Minimum age of applicant should be 22 years",
      "Maximum age at loan maturity should not exceed 62 years",
      "Minimum income requirement of ₹28,000 per month",
      "Credit score above 700 required",
      "Flexible collateral options available"
    ],
    minimumLoanAmount: 150000,
    maximumLoanAmount: 7500000,
    supportedLoanTypes: ['business', 'education', 'agriculture'],
    processingTime: "2-3 business days"
  },
  {
    name: "Axis Bank",
    image: "https://i.pinimg.com/originals/95/ee/14/95ee145596f56c0a699a1371a0c70151.jpg",
    interestRates: [
      { durationInYears: 1, rate: 8.8 },
      { durationInYears: 3, rate: 9.2 },
      { durationInYears: 5, rate: 9.6 }
    ],
    taxes: {
      processingFee: 1.8,
      documentationCharges: 1300,
      GST: 18
    },
    termsAndConditions: [
      "Minimum age of applicant should be 21 years",
      "Maximum age at loan maturity should not exceed 63 years",
      "Minimum income requirement of ₹27,000 per month",
      "Credit score above 680 required",
      "Digital documentation process available"
    ],
    minimumLoanAmount: 175000,
    maximumLoanAmount: 8000000,
    supportedLoanTypes: ['business', 'education'],
    processingTime: "3-4 business days"
  },
  {
    name: "Kotak Mahindra Bank",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0x-5XTuch9fn5z1DFeFeNUI7iaWTAsN9Bpg&s",
    interestRates: [
      { durationInYears: 1, rate: 8.95 },
      { durationInYears: 3, rate: 9.35 },
      { durationInYears: 5, rate: 9.85 }
    ],
    taxes: {
      processingFee: 1.9,
      documentationCharges: 1400,
      GST: 18
    },
    termsAndConditions: [
      "Minimum age of applicant should be 23 years",
      "Maximum age at loan maturity should not exceed 61 years",
      "Minimum income requirement of ₹32,000 per month",
      "Credit score above 710 required",
      "Quick approval process for premium customers"
    ],
    minimumLoanAmount: 250000,
    maximumLoanAmount: 9000000,
    supportedLoanTypes: ['business', 'education', 'agriculture'],
    processingTime: "2-3 business days"
  },
  // Additional 10 banks
  {
    name: "Punjab National Bank",
    image: "https://static.vecteezy.com/system/resources/previews/020/190/451/non_2x/punjab-national-bank-pnb-bank-logo-free-free-vector.jpg",
    interestRates: [
      { durationInYears: 1, rate: 8.6 },
      { durationInYears: 3, rate: 9.1 },
      { durationInYears: 5, rate: 9.4 }
    ],
    taxes: {
      processingFee: 1.6,
      documentationCharges: 1100,
      GST: 18
    },
    termsAndConditions: [
      "Minimum age of applicant should be 21 years",
      "Maximum age at loan maturity should not exceed 65 years",
      "Minimum income requirement of ₹23,000 per month",
      "Credit score above 650 required",
      "Special rates for government employees"
    ],
    minimumLoanAmount: 125000,
    maximumLoanAmount: 6000000,
    supportedLoanTypes: ['business', 'agriculture'],
    processingTime: "4-5 business days"
  },
  {
    name: "Bank of Baroda",
    image: "https://1000logos.net/wp-content/uploads/2021/06/Bank-of-Baroda-logo.png",
    interestRates: [
      { durationInYears: 1, rate: 8.7 },
      { durationInYears: 3, rate: 9.15 },
      { durationInYears: 5, rate: 9.55 }
    ],
    taxes: {
      processingFee: 1.65,
      documentationCharges: 1150,
      GST: 18
    },
    termsAndConditions: [
      "Minimum age of applicant should be 22 years",
      "Maximum age at loan maturity should not exceed 64 years",
      "Minimum income requirement of ₹24,000 per month",
      "Credit score above 660 required",
      "Special schemes for rural entrepreneurs"
    ],
    minimumLoanAmount: 135000,
    maximumLoanAmount: 6500000,
    supportedLoanTypes: ['business', 'agriculture', 'education'],
    processingTime: "3-5 business days"
  },
  {
    name: "Union Bank of India",
    image: "https://logos-download.com/wp-content/uploads/2022/11/Union_Bank_of_India_Logo.png",
    interestRates: [
      { durationInYears: 1, rate: 8.65 },
      { durationInYears: 3, rate: 9.05 },
      { durationInYears: 5, rate: 9.45 }
    ],
    taxes: {
      processingFee: 1.55,
      documentationCharges: 1050,
      GST: 18
    },
    termsAndConditions: [
      "Minimum age of applicant should be 21 years",
      "Maximum age at loan maturity should not exceed 63 years",
      "Minimum income requirement of ₹22,000 per month",
      "Credit score above 640 required",
      "Flexible repayment options available"
    ],
    minimumLoanAmount: 115000,
    maximumLoanAmount: 5500000,
    supportedLoanTypes: ['business', 'agriculture'],
    processingTime: "4-6 business days"
  },
  {
    name: "Canara Bank",
    image: "https://i.pinimg.com/originals/c1/ef/2e/c1ef2e91b95eac43bc00afbd580d23a3.jpg",
    interestRates: [
      { durationInYears: 1, rate: 8.55 },
      { durationInYears: 3, rate: 8.95 },
      { durationInYears: 5, rate: 9.35 }
    ],
    taxes: {
      processingFee: 1.45,
      documentationCharges: 950,
      GST: 18
    },
    termsAndConditions: [
      "Minimum age of applicant should be 20 years",
      "Maximum age at loan maturity should not exceed 65 years",
      "Minimum income requirement of ₹21,000 per month",
      "Credit score above 630 required",
      "Special considerations for agriculture loans"
    ],
    minimumLoanAmount: 100000,
    maximumLoanAmount: 5000000,
    supportedLoanTypes: ['business', 'agriculture', 'education'],
    processingTime: "4-5 business days"
  },
  {
    name: "IndusInd Bank",
    image: "https://findlogovector.com/wp-content/uploads/2018/12/indusind-bank-logo-vector.png",
    interestRates: [
      { durationInYears: 1, rate: 9.0 },
      { durationInYears: 3, rate: 9.4 },
      { durationInYears: 5, rate: 9.9 }
    ],
    taxes: {
      processingFee: 2.1,
      documentationCharges: 1600,
      GST: 18
    },
    termsAndConditions: [
      "Minimum age of applicant should be 24 years",
      "Maximum age at loan maturity should not exceed 60 years",
      "Minimum income requirement of ₹35,000 per month",
      "Credit score above 720 required",
      "Premium banking benefits included"
    ],
    minimumLoanAmount: 300000,
    maximumLoanAmount: 12000000,
    supportedLoanTypes: ['business', 'education'],
    processingTime: "2-3 business days"
  },
  {
    name: "Yes Bank",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Yes_Bank_Logo-01.png/2560px-Yes_Bank_Logo-01.png",
    interestRates: [
      { durationInYears: 1, rate: 8.85 },
      { durationInYears: 3, rate: 9.3 },
      { durationInYears: 5, rate: 9.7 }
    ],
    taxes: {
      processingFee: 1.95,
      documentationCharges: 1450,
      GST: 18
    },
    termsAndConditions: [
      "Minimum age of applicant should be 23 years",
      "Maximum age at loan maturity should not exceed 62 years",
      "Minimum income requirement of ₹33,000 per month",
      "Credit score above 700 required",
      "Digital-first loan processing"
    ],
    minimumLoanAmount: 250000,
    maximumLoanAmount: 9000000,
    supportedLoanTypes: ['business', 'education'],
    processingTime: "2-4 business days"
  },
  {
    name: "Federal Bank",
    image: "https://vectorlogoseek.com/wp-content/uploads/2018/09/federal-vector-logo.png",
    interestRates: [
      { durationInYears: 1, rate: 8.7 },
      { durationInYears: 3, rate: 9.1 },
      { durationInYears: 5, rate: 9.5 }
    ],
    taxes: {
      processingFee: 1.7,
      documentationCharges: 1200,
      GST: 18
    },
    termsAndConditions: [
      "Minimum age of applicant should be 22 years",
      "Maximum age at loan maturity should not exceed 63 years",
      "Minimum income requirement of ₹26,000 per month",
      "Credit score above 670 required",
      "Flexible documentation requirements"
    ],
    minimumLoanAmount: 160000,
    maximumLoanAmount: 7000000,
    supportedLoanTypes: ['business', 'education', 'agriculture'],
    processingTime: "3-4 business days"
  },
  {
    name: "IDBI Bank",
    image: "https://i.pinimg.com/originals/6e/fb/93/6efb93f54538ebaf6c5251bc7a42713c.jpg",
    interestRates: [
      { durationInYears: 1, rate: 8.8 },
      { durationInYears: 3, rate: 9.2 },
      { durationInYears: 5, rate: 9.6 }
    ],
    taxes: {
      processingFee: 1.75,
      documentationCharges: 1250,
      GST: 18
    },
    termsAndConditions: [
      "Minimum age of applicant should be 22 years",
      "Maximum age at loan maturity should not exceed 62 years",
      "Minimum income requirement of ₹27,000 per month",
      "Credit score above 675 required",
      "Special rates for existing customers"
    ],
    minimumLoanAmount: 175000,
    maximumLoanAmount: 7500000,
    supportedLoanTypes: ['business', 'education'],
    processingTime: "3-5 business days"
  },
  {
    name: "South Indian Bank",
    image: "https://seeklogo.com/images/S/south-indian-bank-logo-2964C2D704-seeklogo.com.png",
    interestRates: [
      { durationInYears: 1, rate: 8.75 },
      { durationInYears: 3, rate: 9.15 },
      { durationInYears: 5, rate: 9.55 }
    ],
    taxes: {
      processingFee: 1.65,
      documentationCharges: 1150,
      GST: 18
    },
    termsAndConditions: [
      "Minimum age of applicant should be 21 years",
      "Maximum age at loan maturity should not exceed 64 years",
      "Minimum income requirement of ₹25,000 per month",
      "Credit score above 650 required",
      "Regional benefits for South Indian customers"
    ],
    minimumLoanAmount: 150000,
    maximumLoanAmount: 6500000,
    supportedLoanTypes: ['business', 'agriculture', 'education'],
    processingTime: "3-4 business days"
  },
  {
    name: "RBL Bank",
    image: "https://seekvectorlogo.com/wp-content/uploads/2022/03/rbl-bank-ltd-vector-logo-2022-small.png",
    interestRates: [
      { durationInYears: 1, rate: 8.9 },
      { durationInYears: 3, rate: 9.35 },
      { durationInYears: 5, rate: 9.75 }
    ],
    taxes: {
      processingFee: 1.85,
      documentationCharges: 1350,
      GST: 18
    },
    termsAndConditions: [
      "Minimum age of applicant should be 23 years",
      "Maximum age at loan maturity should not exceed 61 years",
      "Minimum income requirement of ₹30,000 per month",
      "Credit score above 690 required",
      "Digital loan processing available"
    ],
    minimumLoanAmount: 200000,
    maximumLoanAmount: 8500000,
    supportedLoanTypes: ['business', 'education'],
    processingTime: "2-4 business days"
  }
];

async function seedLoanProviders() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await LoanProvider.deleteMany({});
    console.log('Cleared existing data');
    
    await LoanProvider.insertMany(loanProvidersData);
    console.log('Loan providers data seeded successfully');
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding loan providers:', error);
    process.exit(1);
  }
}

seedLoanProviders();