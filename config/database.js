const mongoose = require('mongoose');

const connectDatabase = async () => {
  const connectionString = process.env.MONGODB_URI;

  if (!connectionString) {
    throw new Error('MONGODB_URI is not defined in the environment file');
  }

  await mongoose.connect(connectionString);
  console.log(`Connected to MongoDB database: ${mongoose.connection.name}`);

  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB connection closed');
  });
};

module.exports = connectDatabase;
