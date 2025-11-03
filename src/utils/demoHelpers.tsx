// utils/demoHelpers.ts
import { fakeDetectFromUri } from "./detectorSimulator"; // adjust path
import { reportIncident } from "../api/incidents"; // <- your file where reportIncident is exported
import type { TablesInsert } from "../api/types"; // adjust path
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Simulate detection for a hosted image URL and call your reportIncident function.
 * Returns whatever reportIncident returns (the inserted incident row).
 */

export async function simulateAndReportFromUrl(url: string) {
  // deterministic simulation
  const det = fakeDetectFromUri(url);
  const deviceId = (await AsyncStorage.getItem("deviceId")) || "demo-device";
  // Build payload that matches TablesInsert<"incidents">
  // reportIncident() will normalize keys (deviceId vs device_id etc).
  const payload: TablesInsert<"incidents"> = {
    device_id: deviceId, // required
    type: "image", // required
    risk: det.risk, // required (number)
    label: det.label, // required (string)
    preview_url: url, // optional public url
    content_text: null, // optional
    occurred_at: new Date().toISOString(), // required
    // resolved omitted (defaults to false)
    // source_app omitted (optional)
  } as any;

  // logically, you could also pass camelCase fields; normalizeIncidentPayload will handle either.
  return reportIncident(payload);
}
