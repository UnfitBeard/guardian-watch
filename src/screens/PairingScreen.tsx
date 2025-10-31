import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { pairDevice, getDeviceIdFromPairResponse } from "../api/pairing";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PairingScreen() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");

  const handlePair = async () => {
    try {
      const platform = Device.osName ?? "Unknown";
      const model = Device.modelName ?? "Unknown";
      const deviceName = `${platform}-${model}`;
      const res = await pairDevice(code, platform, model, deviceName);
      const deviceId = getDeviceIdFromPairResponse(res as any);
      if (!deviceId) {
        throw new Error("Pairing response missing device id");
      }
      await AsyncStorage.setItem("deviceId", String(deviceId));
      setStatus(`✅ Paired successfully: ${deviceId}`);
    } catch (e: any) {
      setStatus(`❌ Error: ${e.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Enter Pairing Code</Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="6-digit code"
        style={styles.input}
        keyboardType="numeric"
      />
      <Button title="Pair Device" onPress={handlePair} />
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    width: 256,
    marginBottom: 16,
  },
  status: {
    marginTop: 16,
  },
});
