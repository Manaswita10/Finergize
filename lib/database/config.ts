import mongoose from 'mongoose';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface GlobalWithMongoose {
    mongoose: { 
      conn: mongoose.Connection | null; 
      promise: Promise<mongoose.Mongoose> | null;
    } | undefined;
  }
}

// Extend NodeJS global type
declare const global: GlobalWithMongoose;

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const cached = global.mongoose ?? {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect(): Promise<mongoose.Connection> {
  try {
    if (cached.conn) {
      console.log('Using existing connection');
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      cached.promise = mongoose.connect(MONGODB_URI, opts);
    }

    const mongoose_instance = await cached.promise;
    cached.conn = mongoose_instance.connection;

    console.log('New database connection established');
    return cached.conn;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

export default dbConnect;