import axios from "axios";
import type { Tables } from "./types";
import { log, error as logError } from "../utils/logger";
import { SUPABASE_FUNCTIONS_URL, SUPABASE_PUBLISHABLE_KEY } from "../utils/env";

const baseUrl = SUPABASE_FUNCTIONS_URL;

export type PairDeviceRequest = {
  code: string;
  platform: string;
  model: string;
  deviceName: string;
};

export function getDeviceIdFromPairResponse(data: any): string | undefined {
  if (!data) return undefined;
  return (
    data.id ||
    data.deviceId ||
    data.device_id ||
    data.device?.id ||
    data.data?.id ||
    data.data?.device?.id ||
    data.result?.id ||
    data.result?.device?.id
  );
}

// Returns the created/paired device row from the database
export async function pairDevice(
  code: string,
  platform: string,
  model: string,
  deviceName: string
): Promise<Tables<"devices">> {
  if (!baseUrl) throw new Error("Missing SUPABASE_FUNCTIONS_URL");
  const url = `${baseUrl}/claim-pairing-code`;
  // ensure platform is lowercase before sending
  const payload: PairDeviceRequest = {
    code,
    platform: platform?.toLowerCase?.() ?? platform,
    model,
    deviceName,
  };

  log("pairDevice -> POST", { url, payload });
  try {
    const res = await axios.post(url, payload, {
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(SUPABASE_PUBLISHABLE_KEY
          ? {
              apikey: SUPABASE_PUBLISHABLE_KEY,
              Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
            }
          : {}),
      },
    });

    const derivedId = getDeviceIdFromPairResponse(res.data);
    log("pairDevice <- response", {
      status: res.status,
      id: derivedId ?? null,
      dataKeys: res && res.data ? Object.keys(res.data) : null,
    });
    return res.data as Tables<"devices">;
  } catch (e: any) {
    if (axios.isAxiosError(e)) {
      logError("pairDevice error", {
        message: e.message,
        status: e.response?.status,
        data: e.response?.data,
      });
    } else {
      logError("pairDevice error", { message: String(e) });
    }
    throw e;
  }
}
