// UsageDemoSimple.tsx
import React, { useState } from "react";
import { SUPABASE_FUNCTIONS_URL, SUPABASE_PUBLISHABLE_KEY } from "../utils/env";
import { reportUsage } from "../api/usage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet } from "react-native";

type Props = {
  supabaseFunctionsUrl?: string;
  supabaseAnonKey?: string;
};

export default function UsageDemoSimple({
  supabaseFunctionsUrl = SUPABASE_FUNCTIONS_URL ?? "",
  supabaseAnonKey = SUPABASE_PUBLISHABLE_KEY ?? "",
}: Props) {
  const [deviceId, setDeviceId] = useState("");
  const [appName, setAppName] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<string>("");
  const [loading, setLoading] = useState(false);

  function todayYYYYMMDD() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  const notify = (title: string, message?: string) => {
    console.log(`[NOTIFY] ${title}: ${message ?? ""}`);
    alert(`${title}: ${message ?? ""}`);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    console.group("🧩 handleSubmit()");
    console.log("Device ID:", deviceId);
    console.log("App Name:", appName);
    console.log("Duration (minutes):", durationMinutes);
    console.log("Supabase Function URL:", supabaseFunctionsUrl);
    console.log("Supabase Anon Key present:", !!supabaseAnonKey);

    if (!deviceId.trim() || !appName.trim() || !durationMinutes.trim()) {
      console.warn("Missing input fields");
      notify("Missing fields", "Please fill Device ID, App name and Duration.");
      console.groupEnd();
      return;
    }

    const minutes = Number(durationMinutes);
    if (!Number.isFinite(minutes) || minutes < 0) {
      console.warn("Invalid duration value:", durationMinutes);
      notify("Invalid duration", "Duration must be a non-negative number.");
      console.groupEnd();
      return;
    }

    if (!supabaseFunctionsUrl) {
      console.error("SUPABASE_FUNCTIONS_URL missing.");
      notify("Config error", "SUPABASE_FUNCTIONS_URL missing.");
      console.groupEnd();
      return;
    }

    const url = supabaseFunctionsUrl.replace(/\/$/, "") + "/report-usage";
    const payload = {
      deviceId: deviceId.trim(),
      usageData: [
        {
          appName: appName.trim(),
          created_at: todayYYYYMMDD(),
          date: new Date().toISOString(),
          durationMinutes: Math.round(minutes),
        },
      ],
    };

    setLoading(true);
    try {
      const deviceId =
        (await AsyncStorage.getItem("deviceId")) || "demo-device";
      const res = await reportUsage(payload);

      console.log("📡 Response received:", res.status, res.statusText);

      const textData = await res.data;
      console.log("🧾 Raw response text:", textData);

      let data: any = null;
      try {
        data = JSON.parse(textData);
        console.log("✅ Parsed JSON response:", data);
      } catch {
        console.warn("⚠️ Response not JSON, using raw text:", textData);
        data = textData;
      }

      if (!res.status.toString().startsWith("2")) {
        const message =
          (data && (data.error || data.message)) ?? `HTTP ${res.status}`;
        console.error("❌ Server error:", message);
        notify("Error", String(message));
      } else {
        console.log("✅ Success response:", data);
        notify(
          "Success",
          typeof data === "string" ? data : JSON.stringify(data, null, 2)
        );
        setAppName("");
        setDurationMinutes("");
      }
    } catch (err: any) {
      console.error("💥 Network error:", err);
      notify("Network error", err?.message ?? String(err));
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  };

  return (
    <div style={styles.container}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Usage Demo</h2>
          <p style={{ margin: 0, color: "#666", fontSize: 13 }}>
            Simulate publishing usage stats from a device
          </p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 16,
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
            Device ID
          </label>
          <input
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            placeholder="Enter device UUID"
            style={{
              width: "90%",
              padding: "10px 12px",
              borderRadius: 6,
              border: "1px solid #ddd",
            }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
            App Name
          </label>
          <input
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="e.g., TikTok, Instagram, YouTube"
            style={{
              width: "90%",
              padding: "10px 12px",
              borderRadius: 6,
              border: "1px solid #ddd",
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
            Duration (minutes)
          </label>
          <input
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            type="number"
            min={0}
            placeholder="e.g., 45"
            style={{
              width: 160,
              padding: "10px 12px",
              borderRadius: 6,
              border: "1px solid #ddd",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "none",
              background: loading ? "#9bb7ff" : "#007aff",
              color: "white",
              cursor: loading ? "default" : "pointer",
            }}
          >
            {loading ? "Reporting..." : "Report Usage"}
          </button>

          <button
            type="button"
            onClick={() => {
              console.log("🧪 Filling demo data");
              setDeviceId("2734457c-bfa2-4a4e-b3c4-32ba70626423");
              setAppName("YouTube");
              setDurationMinutes("12");
            }}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "#fff",
              color: "#333",
              cursor: "pointer",
            }}
          >
            Fill demo
          </button>
        </div>
      </form>

      <section
        style={{
          marginTop: 18,
          background: "#f9f9fb",
          padding: 12,
          borderRadius: 8,
          fontSize: 13,
        }}
      >
        <strong style={{ display: "block", marginBottom: 6 }}>
          How it works (production)
        </strong>
        <ol style={{ margin: 0, paddingLeft: 18, color: "#555" }}>
          <li>Child device collects usage via system APIs.</li>
          <li>
            Device batches usage (hourly/daily) and posts to the function.
          </li>
          <li>
            Backend validates and writes into <code>usage_stats</code>.
          </li>
          <li>Parents view aggregated stats in dashboard.</li>
        </ol>
      </section>

      <section style={{ marginTop: 18 }}>
        <h4 style={{ marginBottom: 8 }}>API example (mobile)</h4>
        <pre
          style={{
            background: "#111827",
            color: "#fff",
            padding: 12,
            borderRadius: 6,
            fontSize: 12,
            overflowX: "auto",
          }}
        >
          {`// POST ${supabaseFunctionsUrl.replace(/\/$/, "")}/report-usage
{
  "deviceId": "<device-uuid>",
  "usageData": [
    { "appName": "TikTok", "date": "2025-11-01", "durationMinutes": 45 }
  ]
}`}
        </pre>
      </section>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
  },
});
