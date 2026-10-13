const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Judgment = require('../models/Judgment');
const Document = require('../models/Document');
const Contract = require('../models/Contract');
const {
  ROLES,
  USER_STATUS,
  AUTH_PROVIDER,
  CUSTOMER_DEFAULT_PERMISSIONS,
  ADMIN_DEFAULT_PERMISSIONS,
} = require('../constants/enums');
const { defaultJudgments, defaultDocuments, defaultContracts } = require('../services/storage');

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/themes-ai';
    console.log(`Connecting to ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('Seeding database with NUMERIC ROLES & NUMERIC PERMISSIONS:');

    // Clean existing
    await User.deleteMany({});
    await Judgment.deleteMany({});
    await Document.deleteMany({});
    await Contract.deleteMany({});

    // 1. Create Admin User (Numeric Role: 1, Permissions: 127)
    const adminUser = await User.create({
      firstName: 'System',
      lastName: 'Administrator',
      email: 'admin@legalai.in',
      mobile: '+91 9999999999',
      professionalType: 'Managing Partner',
      organisationName: 'Legal AI Legal Enterprise',
      password: 'admin123',
      role: ROLES.ADMIN, // 1
      plan: 'Enterprise Admin',
      credits: 99999,
      permissions: ADMIN_DEFAULT_PERMISSIONS, // 127
      status: USER_STATUS.ACTIVE, // 1
      authProvider: AUTH_PROVIDER.LOCAL, // 1
      avatar: 'SA',
    });

    // 2. Create Customer User (Numeric Role: 2, Permissions: 63)
    const customerUser = await User.create({
      firstName: 'Chirag',
      lastName: 'Poshiya',
      email: 'cfsys.xyz@gmail.com',
      mobile: '+91 9876543210',
      professionalType: 'Advocate',
      organisationName: 'MYFINDI',
      password: '123456',
      role: ROLES.CUSTOMER, // 2
      plan: 'MYFINDI',
      credits: 500,
      permissions: CUSTOMER_DEFAULT_PERMISSIONS, // 63
      status: USER_STATUS.ACTIVE, // 1
      authProvider: AUTH_PROVIDER.LOCAL, // 1
      avatar: 'CP',
    });

    // 3. Seed Judgments (Numeric Status)
    for (const j of defaultJudgments) {
      const { _id, ...jData } = j;
      const statusNum = jData.status === 'Good Law' ? 1 : jData.status === 'Distinguished' ? 2 : 3;
      await Judgment.create({ ...jData, status: statusNum });
    }

    // 4. Seed Documents (Numeric Status)
    for (const d of defaultDocuments) {
      const { _id, ...dData } = d;
      const statusNum = dData.status === 'Ready' ? 1 : dData.status === 'Processing' ? 2 : 3;
      await Document.create({ ...dData, status: statusNum, user: customerUser._id });
    }

    // 5. Seed Contracts (Numeric Risk Level)
    for (const c of defaultContracts) {
      const { _id, ...cData } = c;
      const riskNum = cData.riskLevel === 'Low' ? 1 : cData.riskLevel === 'Medium' ? 2 : 3;
      await Contract.create({ ...cData, riskLevel: riskNum, user: customerUser._id });
    }

    console.log('--------------------------------------------------');
    console.log('MongoDB Atlas seeded successfully with NUMERIC values:');
    console.log(' - Admin: admin@legalai.in (Role: 1, Permissions: 127)');
    console.log(' - Customer: cfsys.xyz@gmail.com (Role: 2, Permissions: 63)');
    console.log('--------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
