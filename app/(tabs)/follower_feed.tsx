import { View, Text } from "react-native";
import { supabase } from "../../lib/supabase";
import { useEffect } from "react";

export default function FollowerFeedScreen() {
  const testConnection = async () => {
    const { data, error } = await supabase.from("test_table").select("*");

    if (error) {
      console.error("❌ Supabase error:", error.message);
    } else {
      console.log("✅ Supabase connected! Data:", data);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>This is the Follower Feed 📱</Text>
    </View>
  );
}
