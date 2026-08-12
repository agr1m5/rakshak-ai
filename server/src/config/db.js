/**
 * Database connection module using Mongoose.
 */
import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectDB() {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    // Non-fatal on boot in development so rest of server can start even if DB is pending
    if (config.env === 'production') {
      process.exit(1);
    }
  }
}
