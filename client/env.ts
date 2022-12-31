import dotenv from 'dotenv';
dotenv.config();

const env = {
  CLIENT_ID: process.env.CLIENT_ID as string,
  REDIRECT_URI: process.env.REDIRECT_URI as string,
  AUTH_ENDPOINT: process.env.AUTH_ENDPOINT as string,
  RESPONSE_TYPE: process.env.RESPONSE_TYPE as string,
  PERMISSIONSCOPE_SPOTIFY: process.env.PERMISSIONSCOPE_SPOTIFY as string

};

// Ensure all keys exist
Object.entries(env).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Required environment variable '${key}' is missing!`);
  }
});

export default env;