const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Healthcare Appointment API is running!' });
});

// Connect to MongoDB
async function connectDB() {
  let mongoUri = process.env.MONGO_URI;
  
  // Check if mongoUri is empty or undefined, use in-memory server
  if (!mongoUri) {
    console.log('🔧 MONGO_URI not set, starting in-memory MongoDB...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log('✅ In-memory MongoDB started');
    } catch (err) {
      console.error('❌ Failed to start in-memory MongoDB:', err);
      process.exit(1);
    }
  }
  
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  } catch (err) {
    console.error('❌ Connection to MongoDB failed:', err.message);
    process.exit(1);
  }
}

connectDB();
