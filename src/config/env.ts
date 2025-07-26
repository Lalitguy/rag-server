import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT || "3000",
  MONGO_URI: process.env.MONGO_URI,
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
};
