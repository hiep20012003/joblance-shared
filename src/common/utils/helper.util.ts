import crypto from 'crypto';
import mongoose, {MongooseError} from 'mongoose';

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function runInTransaction<T>(
  conn: mongoose.Connection,
  fn: (session: mongoose.ClientSession) => Promise<T>,
  retries = 3
): Promise<T> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const session = await conn.startSession();
    session.startTransaction();
    try {
      const result = await fn(session);
      await session.commitTransaction();
      return result;
    } catch (error: unknown) {
      console.error(error);
      await session.abortTransaction();
      if (error instanceof mongoose.Error && attempt < retries - 1) {
        continue;
      }
      throw error;
    } finally {
      await session.endSession();
    }
  }
  throw new Error("Max retries reached");
}

export function splitFileName(filename: string): { name: string; ext: string } {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1 || lastDot === 0 || lastDot === filename.length - 1) {
    return {name: filename, ext: ""};
  }

  return {
    name: filename.slice(0, lastDot),
    ext: filename.slice(lastDot + 1),
  };
}

