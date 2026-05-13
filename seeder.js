// Run this once to create the admin account:
// node backend/seeder.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './backend/.env' });

const User = require('./backend/models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email: 'admin@medbook.com' });
  if (existing) {
    console.log('Admin already exists: admin@medbook.com / admin123');
    process.exit();
  }

  await User.create({
    name: 'Admin',
    email: 'admin@medbook.com',
    password: 'admin123',
    role: 'admin',
    isApproved: true,
  });

  console.log('✅ Admin created: admin@medbook.com / admin123');
  process.exit();
};

seed().catch(err => { console.error(err); process.exit(1); });
