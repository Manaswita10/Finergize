// scripts/seed-mutual-funds.js
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// Define the MutualFund Schema
const MutualFundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Equity', 'Debt', 'Hybrid'],
  },
  riskLevel: {
    type: String,
    required: true,
    enum: ['Low', 'Moderate', 'High'],
  },
  oneYearReturn: {
    type: Number,
    required: true,
  },
  threeYearReturn: {
    type: Number,
    required: true,
  },
  fiveYearReturn: {
    type: Number,
    required: true,
  },
  nav: {
    type: Number,
    required: true,
  },
  aum: {
    type: Number,
    required: true,
  },
  expense: {
    type: Number,
    required: true,
  },
  minInvestment: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

// Create the model
const MutualFund = mongoose.models.MutualFund || mongoose.model('MutualFund', MutualFundSchema);

// Sample mutual fund data
const mutualFundsData = [
  {
    name: 'Large Cap Growth Fund',
    category: 'Equity',
    riskLevel: 'Moderate',
    oneYearReturn: 15.6,
    threeYearReturn: 12.8,
    fiveYearReturn: 14.2,
    nav: 45.67,
    aum: 1200,
    expense: 1.2,
    minInvestment: 5000
  },
  {
    name: 'Mid Cap Opportunities',
    category: 'Equity',
    riskLevel: 'High',
    oneYearReturn: 22.4,
    threeYearReturn: 18.5,
    fiveYearReturn: 16.8,
    nav: 68.92,
    aum: 800,
    expense: 1.5,
    minInvestment: 1000
  },
  {
    name: 'Debt Fund Direct',
    category: 'Debt',
    riskLevel: 'Low',
    oneYearReturn: 8.4,
    threeYearReturn: 7.9,
    fiveYearReturn: 8.1,
    nav: 28.34,
    aum: 1500,
    expense: 0.8,
    minInvestment: 10000
  },
  {
    name: 'Balanced Advantage Fund',
    category: 'Hybrid',
    riskLevel: 'Moderate',
    oneYearReturn: 12.5,
    threeYearReturn: 11.2,
    fiveYearReturn: 10.8,
    nav: 35.45,
    aum: 2200,
    expense: 1.1,
    minInvestment: 1000
  },
  {
    name: 'Small Cap Discovery Fund',
    category: 'Equity',
    riskLevel: 'High',
    oneYearReturn: 28.6,
    threeYearReturn: 22.4,
    fiveYearReturn: 19.8,
    nav: 89.23,
    aum: 600,
    expense: 1.8,
    minInvestment: 5000
  },
  {
    name: 'Government Securities Fund',
    category: 'Debt',
    riskLevel: 'Low',
    oneYearReturn: 6.8,
    threeYearReturn: 7.2,
    fiveYearReturn: 7.5,
    nav: 25.67,
    aum: 3500,
    expense: 0.6,
    minInvestment: 5000
  },
  {
    name: 'Dynamic Asset Allocation Fund',
    category: 'Hybrid',
    riskLevel: 'Moderate',
    oneYearReturn: 14.2,
    threeYearReturn: 12.6,
    fiveYearReturn: 11.9,
    nav: 42.78,
    aum: 1800,
    expense: 1.3,
    minInvestment: 1000
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully to MongoDB');

    // Clear existing data
    console.log('Clearing existing mutual funds...');
    await MutualFund.deleteMany({});
    console.log('Existing mutual funds cleared');

    // Insert new data
    console.log('Inserting new mutual funds...');
    const result = await MutualFund.insertMany(mutualFundsData);
    console.log(`Successfully inserted ${result.length} mutual funds`);

    // Log inserted funds
    console.log('\nInserted Mutual Funds:');
    result.forEach((fund, index) => {
      console.log(`${index + 1}. ${fund.name} (${fund.category})`);
    });

    console.log('\nDatabase seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run the seeding function
seedDatabase();