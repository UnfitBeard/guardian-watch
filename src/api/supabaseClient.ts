import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import type { Database } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { log, mask } from "../utils/logger";

const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL!;
const supabaseKey = Constants.expoConfig?.extra?.SUPABASE_PUBLISHABLE_KEY!;

log("Supabase init", { url: supabaseUrl, key: mask(supabaseKey) });

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
