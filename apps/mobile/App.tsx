import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { createApiClient } from "@mimo/sdk";
import { tokens } from "@mimo/ui";

const tokenPreview = {
  primary: tokens.color.primary,
  background: tokens.color.background,
  radius: tokens.radius[12],
  spacing: tokens.spacing[24],
  font: tokens.typography.fontFamily.sans,
};

export default function App() {
  void createApiClient({
    baseUrl: "http://localhost:3001",
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.color.background }}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            marginBottom: 12,
            color: tokens.color.textPrimary,
          }}
        >
          Laundry OS Mobile
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 12, color: tokens.color.textSecondary }}>
          Chapter 7.1 token import proof
        </Text>
        <View
          style={{
            backgroundColor: tokens.color.surface,
            borderColor: tokens.color.border,
            borderWidth: 1,
            borderRadius: 12,
            padding: 16,
          }}
        >
          <Text selectable>{JSON.stringify(tokenPreview, null, 2)}</Text>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
