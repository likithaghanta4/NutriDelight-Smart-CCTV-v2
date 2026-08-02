require("dotenv").config();

const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseKey: process.env.SUPABASE_KEY || "",
  ownerEmail: process.env.OWNER_EMAIL || "",
  aiStreamUrl: process.env.AI_STREAM_URL || "http://127.0.0.1:5001/video-feed",
};

module.exports = env;
