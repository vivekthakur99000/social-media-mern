import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

const connectDB = async () => {
  try {
    // Remove deprecated options
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
    });

    console.log(chalk.cyan.underline(`MongoDB Connected: ${conn.connection.host}`));

    // Connection events
    mongoose.connection.on('connected', () => {
      console.log(chalk.green('Mongoose connected to DB'));
    });

    mongoose.connection.on('error', (err) => {
      console.log(chalk.red(`Mongoose connection error: ${err.message}`));
    });

    mongoose.connection.on('disconnected', () => {
      console.log(chalk.yellow('Mongoose disconnected'));
    });

    // Close connection on app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log(chalk.red('Mongoose connection closed through app termination'));
      process.exit(0);
    });

  } catch (error) {
    console.error(chalk.red(`Connection error: ${error.message}`));
    process.exit(1);
  }
};

export default connectDB;