import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://finergize-admin:ArshaviMana1910@cluster0.8akiu.mongodb.net/financial-inclusion?retryWrites=true&w=majority&appName=Cluster0";

// Define the Member Schema (for members who will join later)
const MemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  contributionAmount: {
    type: Number,
    required: true,
  },
  totalContributed: {
    type: Number,
    default: 0,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Paused'],
    default: 'Active'
  }
});

// Define the Contribution Schema (for group contribution history)
const ContributionSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  membersContributed: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
  }
});

// Define the SavingsGroup Schema
const SavingsGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  foundedDate: {
    type: Date,
    required: true,
  },
  meetingFrequency: {
    type: String,
    enum: ['Weekly', 'Biweekly', 'Monthly'],
    required: true,
  },
  contributionType: {
    type: String,
    enum: ['Fixed', 'Variable'],
    required: true,
  },
  minContribution: {
    type: Number,
    required: true,
  },
  maxContribution: {
    type: Number,
  },
  totalSaved: {
    type: Number,
    default: 0,
  },
  members: [MemberSchema],
  contributionHistory: [ContributionSchema],
  interestRate: {
    type: Number,
    default: 0, // Percentage
  },
  loanOffered: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Completed'],
    default: 'Active',
  }
}, {
  timestamps: true,
});

// Create User Schema (for members who will join the savings groups)
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  profilePicture: {
    type: String,
  },
  address: {
    type: String,
  },
  occupation: {
    type: String,
  },
  bio: {
    type: String,
  }
}, {
  timestamps: true,
});

// Create the models
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const SavingsGroup = mongoose.models.SavingsGroup || mongoose.model('SavingsGroup', SavingsGroupSchema);

// Sample community savings groups data (without members)
const savingsGroupsData = [
  {
    name: 'Neighbors United Savings',
    description: 'A neighborhood-based savings group for home improvements and emergencies',
    location: 'Westside Community, Central District',
    foundedDate: new Date('2022-03-15'),
    meetingFrequency: 'Monthly',
    contributionType: 'Fixed',
    minContribution: 1000,
    maxContribution: 5000,
    totalSaved: 0,
    members: [], // Members will join themselves
    contributionHistory: [],
    interestRate: 5,
    loanOffered: true,
    status: 'Active'
  },
  {
    name: 'Women Empowerment Savings Circle',
    description: 'A savings group focused on supporting women entrepreneurs',
    location: 'Eastside Community Center',
    foundedDate: new Date('2023-01-10'),
    meetingFrequency: 'Biweekly',
    contributionType: 'Variable',
    minContribution: 500,
    maxContribution: 3000,
    totalSaved: 0,
    members: [], // Members will join themselves
    contributionHistory: [],
    interestRate: 3,
    loanOffered: true,
    status: 'Active'
  },
  {
    name: 'Youth Future Fund',
    description: 'Helping young adults save for education and business startups',
    location: 'Downtown Youth Center',
    foundedDate: new Date('2022-09-01'),
    meetingFrequency: 'Weekly',
    contributionType: 'Fixed',
    minContribution: 200,
    maxContribution: 1000,
    totalSaved: 0,
    members: [], // Members will join themselves
    contributionHistory: [],
    interestRate: 2,
    loanOffered: false,
    status: 'Active'
  },
  {
    name: 'Rural Development Collective',
    description: 'Supporting agricultural improvements and rural entrepreneurship',
    location: 'Farmland District',
    foundedDate: new Date('2022-06-15'),
    meetingFrequency: 'Monthly',
    contributionType: 'Fixed',
    minContribution: 800,
    maxContribution: 4000,
    totalSaved: 0,
    members: [],
    contributionHistory: [],
    interestRate: 4.5,
    loanOffered: true,
    status: 'Active'
  },
  {
    name: 'Tech Innovators Fund',
    description: 'Savings pool for technology startups and digital innovation',
    location: 'Technology Park',
    foundedDate: new Date('2023-03-01'),
    meetingFrequency: 'Biweekly',
    contributionType: 'Variable',
    minContribution: 1500,
    maxContribution: 7500,
    totalSaved: 0,
    members: [],
    contributionHistory: [],
    interestRate: 6,
    loanOffered: true,
    status: 'Active'
  },
  {
    name: 'Small Business Circle',
    description: 'Focused on providing capital for small business owners',
    location: 'Market District',
    foundedDate: new Date('2022-11-20'),
    meetingFrequency: 'Monthly',
    contributionType: 'Fixed',
    minContribution: 1200,
    maxContribution: 6000,
    totalSaved: 0,
    members: [],
    contributionHistory: [],
    interestRate: 5.5,
    loanOffered: true,
    status: 'Active'
  },
  {
    name: 'Healthcare Workers Alliance',
    description: 'Savings group exclusively for healthcare professionals',
    location: 'Medical District',
    foundedDate: new Date('2023-02-05'),
    meetingFrequency: 'Monthly',
    contributionType: 'Fixed',
    minContribution: 1500,
    maxContribution: 5000,
    totalSaved: 0,
    members: [],
    contributionHistory: [],
    interestRate: 4,
    loanOffered: false,
    status: 'Active'
  },
  {
    name: 'Education First Fund',
    description: 'Supporting educational goals through community savings',
    location: 'University Area',
    foundedDate: new Date('2022-08-10'),
    meetingFrequency: 'Biweekly',
    contributionType: 'Variable',
    minContribution: 300,
    maxContribution: 2000,
    totalSaved: 0,
    members: [],
    contributionHistory: [],
    interestRate: 3.5,
    loanOffered: true,
    status: 'Active'
  },
  {
    name: 'Senior Citizens Security Circle',
    description: 'Savings group designed for retirees and senior citizens',
    location: 'Retirement Community',
    foundedDate: new Date('2022-05-12'),
    meetingFrequency: 'Monthly',
    contributionType: 'Fixed',
    minContribution: 500,
    maxContribution: 3000,
    totalSaved: 0,
    members: [],
    contributionHistory: [],
    interestRate: 4.2,
    loanOffered: false,
    status: 'Active'
  },
  {
    name: 'Creative Arts Collective',
    description: 'Supporting artists, musicians, and creative entrepreneurs',
    location: 'Arts District',
    foundedDate: new Date('2023-01-25'),
    meetingFrequency: 'Weekly',
    contributionType: 'Variable',
    minContribution: 250,
    maxContribution: 1500,
    totalSaved: 0,
    members: [],
    contributionHistory: [],
    interestRate: 3.8,
    loanOffered: true,
    status: 'Active'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully to MongoDB');

    // Clear existing data
    console.log('Clearing existing savings groups and users...');
    await SavingsGroup.deleteMany({});
    console.log('Existing savings groups cleared');

    // Insert new data
    console.log('Inserting new savings groups...');
    const result = await SavingsGroup.insertMany(savingsGroupsData);
    console.log(`Successfully inserted ${result.length} savings groups`);

    // Log inserted groups
    console.log('\nInserted Savings Groups:');
    result.forEach((group, index) => {
      console.log(`${index + 1}. ${group.name} (Location: ${group.location}, Min Contribution: ₹${group.minContribution})`);
    });

    console.log('\nDatabase seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run the seeding function
seedDatabase();