import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { createApiClient } from "@mimo/sdk";

type HealthState = {
  ok: boolean | null;
  error: string | null;
};

export default function App() {
  const [state, setState] = useState<HealthState>({
    ok: null,
    error: null,
  });

  useEffect(() => {
    async function loadHealth() {
      try {
        const client = await createApiClient({
          baseUrl: "http://localhost:3001",
        });

        const { data, error } = await client.GET("/health");

        if (error) {
          setState({ ok: null, error: JSON.stringify(error) });
          return;
        }

        setState({ ok: data?.ok ?? null, error: null });
      } catch (error) {
        setState({
          ok: null,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    void loadHealth();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 12 }}>Laundry OS Mobile</Text>
        <Text style={{ fontSize: 16, marginBottom: 12 }}>Chapter 5.2 SDK placeholder</Text>
        <View>
          <Text selectable>{JSON.stringify(state, null, 2)}</Text>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
