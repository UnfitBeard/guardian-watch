// app.config.js
import "dotenv/config"; // this line loads .env into process.env (works with node >=12)

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
const SUPABASE_PROJECT_ID = process.env.UPABASE_PROJECT_ID;
const SUPABASE_FUNCTIONS_URL =
  process.env.SUPABASE_FUNCTIONS_URL ||
  (SUPABASE_URL
    ? SUPABASE_URL.replace(".supabase.co", ".functions.supabase.co")
    : undefined);

export default {
  expo: {
    name: "GuardianWatch",
    slug: "guardianwatch",
    sdkVersion: "54.0.0",
    extra: {
      // These are now available at runtime via Constants.expoConfig.extra
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY,
      SUPABASE_PROJECT_ID,
      SUPABASE_FUNCTIONS_URL,
    },
  },
};
