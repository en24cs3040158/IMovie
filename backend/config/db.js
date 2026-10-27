const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn(`💡 Tip: Make sure MongoDB is running locally (e.g. via Windows Service) or provide a valid cloud MongoDB Atlas URI in backend/.env`);
    // Do not crash the server in dev mode so API error messages can still be handled cleanly
  }
};

module.exports = connectDB;

