import React from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { reportIncident } from "../api/incidents";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ReportIncidentScreen() {
  const handleReport = async () => {
    const img = await ImagePicker.launchImageLibraryAsync({ base64: true });
    if (!img.canceled) {
      const deviceId = (await AsyncStorage.getItem("deviceId")) || "demo-device";
      await reportIncident({
        device_id: deviceId,
        type: "image",
        risk: 0.8,
        label: "NSFW",
        preview_url: img.assets[0].uri,
        occurred_at: new Date().toISOString(),
      });
      alert("Incident reported!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report Incident</Text>
      <Button title="Pick Image and Report" onPress={handleReport} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  button: { marginTop: 10 },
});
