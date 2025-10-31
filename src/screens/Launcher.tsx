// screens/Launcher.tsx
import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { pickDemoImage } from "../utils/demoImages";

type RootStackParamList = {
  HostedDemo: { imageUrl: string };
};

export default function Launcher() {
  const nav = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Button
        title="Clean — casual screenshot"
        onPress={() =>
          nav.navigate("HostedDemo" as any, {
            imageUrl: pickDemoImage("clean", 0),
          })
        }
      />
      <View style={{ height: 12 }} />
      <Button
        title="Low risk — ambiguous"
        onPress={() =>
          nav.navigate("HostedDemo" as any, {
            imageUrl: pickDemoImage("lowRisk", 0),
          })
        }
      />
      <View style={{ height: 12 }} />
      <Button
        title="Medium risk — suggestive"
        onPress={() =>
          nav.navigate("HostedDemo" as any, {
            imageUrl: pickDemoImage("mediumRisk", 0),
          })
        }
      />
      <View style={{ height: 12 }} />
      <Button
        title="High risk — flagged"
        onPress={() =>
          nav.navigate("HostedDemo" as any, {
            imageUrl: pickDemoImage("highRisk", 0),
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
});
