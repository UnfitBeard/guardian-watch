import Constants from "expo-constants";
import { log, mask } from "./logger";

type Extra = typeof Constants & {
  expoConfig?: { extra?: Record<string, any> };
};

const extra = (Constants as Extra).expoConfig?.extra ?? {};

export const SUPABASE_URL: string | undefined =
  process.env.EXPO_PUBLIC_SUPABASE_URL;
export const SUPABASE_PUBLISHABLE_KEY: string | undefined =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const SUPABASE_FUNCTIONS_URL: string | undefined =
  process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL;

log("Env", {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY: mask(SUPABASE_PUBLISHABLE_KEY),
  SUPABASE_FUNCTIONS_URL,
});
