// screens/HostedDemo.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { fakeDetectFromUri } from "../utils/detectorSimulator";
import { simulateAndReportFromUrl } from "../utils/demoHelpers";

/** Update this type to match your root navigator */
type RootStackParamList = {
  Launcher: undefined;
  HostedDemo: { imageUrl?: string } | undefined; // imageUrl optional
};

type HostedDemoRouteProp = RouteProp<RootStackParamList, "HostedDemo">;

export default function HostedDemoScreen() {
  const route = useRoute<HostedDemoRouteProp>();
  const nav = useNavigation();
  const imageUrl = route.params?.imageUrl ?? null; // safe access

  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(true);
  const [det, setDet] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    if (!imageUrl) {
      // nothing to analyze — show "choose" UI
      setAnalyzing(false);
      setDet(null);
      return () => {
        mounted = false;
      };
    }

    setAnalyzing(true);
    setDet(null);
    const timer = setTimeout(() => {
      if (!mounted) return;
      const d = fakeDetectFromUri(imageUrl);
      setDet(d);
      setAnalyzing(false);
    }, 1200 + Math.round(Math.random() * 900));

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [imageUrl]);

  async function onSend() {
    if (!imageUrl) {
      Alert.alert(
        "No image",
        "No demo image provided. Go back and pick a scenario."
      );
      return;
    }
    setLoading(true);
    try {
      const res = await simulateAndReportFromUrl(imageUrl);
      Alert.alert(
        "Sent",
        `Reported as ${(res?.label ?? "unknown").toUpperCase()} (id: ${
          res?.id ?? "n/a"
        })`
      );
    } catch (err: any) {
      console.error(
        "simulateAndReportFromUrl error:",
        err?.response?.data ?? err?.message ?? err
      );
      Alert.alert("Error", String(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  }

  // UI when no imageUrl
  if (!imageUrl) {
    return (
      <View style={styles.emptyRoot}>
        <Text style={{ fontSize: 18, marginBottom: 12 }}>
          No demo image selected.
        </Text>
        <Button
          title="Go back to Launcher"
          onPress={() => nav.navigate("Launcher" as any)}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.preview}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.info}>
        {analyzing ? (
          <View style={{ alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 8 }}>Analyzing image…</Text>
          </View>
        ) : (
          det && (
            <View>
              <Text style={styles.label}>
                {det.label === "unknown"
                  ? "No concerns detected"
                  : det.label.toUpperCase()}
              </Text>
              <Text style={styles.risk}>
                Risk: {Math.round(det.risk * 100)}%
              </Text>
              <Text style={styles.reason}>{det.explanation}</Text>
            </View>
          )
        )}
      </View>

      <View style={styles.actions}>
        <Button
          title="Send to Parent (Simulated)"
          onPress={onSend}
          disabled={analyzing || loading}
        />
        <View style={{ height: 8 }} />
        <Button
          title="Back to Launcher"
          onPress={() => nav.navigate("Launcher" as any)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 12, backgroundColor: "#fff" },
  emptyRoot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  preview: { alignItems: "center", marginTop: 8 },
  image: {
    width: "100%",
    height: 320,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  info: { padding: 12 },
  label: { fontSize: 18, fontWeight: "700" },
  risk: { marginTop: 6, color: "#c00", fontWeight: "600" },
  reason: { marginTop: 8, color: "#555" },
  actions: { padding: 12, marginTop: "auto" },
});
