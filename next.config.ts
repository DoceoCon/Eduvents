import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },
  env: {
    // MongoDB
    MONGODB_URI: process.env.MONGODB_URI,

    // AWS S3
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
    REGION: process.env.REGION,
    BUCKET: process.env.BUCKET,

    // Stripe
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,

    // Base URL
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,

    // Email Configuration (SMTP)
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,

    // Admin Credentials
    ADMIN_CREDENTIALS: process.env.ADMIN_CREDENTIALS,
  },
};

export default nextConfig;
