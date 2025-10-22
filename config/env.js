// Import and configure the dotenv package.
import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

// Destructure and export all environment variables, including the Arcjet key.
export const {
    PORT,
    NODE_ENV,
    DB_URI,
    SERVER_URL,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    ARCJET_KEY,
    ARCJET_ENV,
    QSTASH_TOKEN,
    QSTASH_URL
} = process.env;