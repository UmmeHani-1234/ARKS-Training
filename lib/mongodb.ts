/**
 * lib/mongodb.ts
 *
 * Mongoose connection singleton.
 * In Next.js dev mode, hot reloading can cause multiple connections to be
 * created. We cache the connection on the global object to prevent this.
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your .env.local file");
}

// Use a global cache to survive Next.js hot reloads in development
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const cached = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (cached.conn) return cached.conn;

  // Start a new connection if no pending promise
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
