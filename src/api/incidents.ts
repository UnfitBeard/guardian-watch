import axios from "axios";
import type { Tables, TablesInsert } from "./types";
import { log, error as logError } from "../utils/logger";
import { SUPABASE_FUNCTIONS_URL, SUPABASE_PUBLISHABLE_KEY } from "../utils/env";

const baseUrl = SUPABASE_FUNCTIONS_URL;

export type ReportIncidentRequest = TablesInsert<"incidents">;

function normalizeIncidentPayload(raw: any) {
  return {
    deviceId: raw.deviceId ?? raw.device_id ?? undefined,
    type: raw.type ? String(raw.type).toLowerCase() : undefined,
    risk: raw.risk == null ? undefined : Number(raw.risk),
    label: raw.label ? String(raw.label).toLowerCase() : undefined,
    sourceApp: raw.sourceApp ?? raw.source_app ?? null,
    previewUrl: raw.previewUrl ?? raw.preview_url ?? null,
    contentText: raw.contentText ?? raw.content_text ?? null,
  };
}

export async function reportIncident(
  payload: ReportIncidentRequest
): Promise<Tables<"incidents">> {
  if (!baseUrl) throw new Error("Missing SUPABASE_FUNCTIONS_URL");
  const url = `${baseUrl}/report-incident`;

  const normalized = normalizeIncidentPayload(payload);
  log("reportIncident -> POST", { url, payload: normalized });
  try {
    const res = await axios.post(url, normalized, {
      timeout: 20000,
      headers: SUPABASE_PUBLISHABLE_KEY
        ? {
            apikey: SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
            "Content-Type": "application/json",
          }
        : undefined,
    });
    log("reportIncident <- response", {
      status: res.status,
      id: (res.data as any)?.id ?? null,
      dataKeys: res && res.data ? Object.keys(res.data) : null,
    });
    return res.data as Tables<"incidents">;
  } catch (e: any) {
    if (axios.isAxiosError(e)) {
      logError("reportIncident error", {
        message: e.message,
        status: e.response?.status,
        data: e.response?.data,
      });
    } else {
      logError("reportIncident error", { message: String(e) });
    }
    throw e;
  }
}
