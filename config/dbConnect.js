const mongoose = require('mongoose');

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log('Database connected successfully');
  } catch (err) {
    console.log(`Db connection error`, err.message);
    process.exit(1);
  }
};

module.exports = connectDB;


