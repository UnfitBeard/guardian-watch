import React from 'react';
import { View, Text } from 'react-native';

export type Incident = {
  id: string;
  type: string;
  label: string;
  risk: number; // 0..1
  previewUrl?: string;
};

export default function IncidentCard({ incident }: { incident: Incident }) {
  return (
    <View className="w-full border rounded-md p-3 mb-2">
      <Text className="font-semibold">{incident.label} ({incident.type})</Text>
      <Text>Risk: {(incident.risk * 100).toFixed(0)}%</Text>
      {incident.previewUrl ? (
        <Text numberOfLines={1}>Preview: {incident.previewUrl}</Text>
      ) : null}
    </View>
  );
}
