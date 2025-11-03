// api/usage.ts
import axios from "axios";
import { SUPABASE_FUNCTIONS_URL, SUPABASE_PUBLISHABLE_KEY } from "../utils/env";
import { log } from "../utils/logger";
import { Json, Tables, TablesInsert } from "./types";

const usageURL = `${SUPABASE_FUNCTIONS_URL!.replace(/\/$/, "")}/report-usage`;

/**
 * usageItems: Array of { appName, date (YYYY-MM-DD), durationMinutes }
 */

export type ReportUsage = TablesInsert<"usage_stats">;
export async function reportUsage(payload: any) {
  try {
    if (!usageURL) throw new Error("Missing SUPABASE_FUNCTIONS_URL");
    log("reportUsage -> POST", { usageURL, payload });

    const res = await axios.post(usageURL, payload, {
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 15000,
    });

    log("reportUsage <-", { status: res.status, data: res.data });
    return {
      status: res.status,
      statusText: res.statusText,
      data: res.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      log("reportUsage <- error", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      log("reportUsage <- error", { error: String(error) });
    }
    throw error;
  }
}
