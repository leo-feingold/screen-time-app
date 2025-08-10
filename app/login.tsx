import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabase";

export default function LoginScreen() {
  const { setUsername, setProfilePicUri } = useUser();
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = async () => {
    if (usernameInput.trim() === "" || password.trim() === "") {
      alert("Missing Info: Please enter both username and password");
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", usernameInput)
      .single();

    if (error) {
      alert("User not found");
      console.error("Login error:", error.message);
      return;
    }

    if (data.password !== password || data.username !== usernameInput) {
      alert("Incorrect username or password");
      return;
    }

    setUsername(usernameInput); // ✅ Store in context
    setProfilePicUri(data.profile_picture_url || null);
    router.replace("/follower_feed"); // ➡️ Go to app
  };

  const handleSignUp = async () => {
    if (usernameInput.trim() === "" || password.trim() === "") {
      alert("Missing Info: Please enter both username and password");
      return;
    }

    // First, check if username already exists
    const { data: existingUser, error: lookupError } = await supabase
      .from("users")
      .select("*")
      .eq("username", usernameInput)
      .maybeSingle();

    if (lookupError) {
      console.error("Error checking username:", lookupError.message);
      return;
    }

    if (existingUser) {
      alert("Username already taken");
      return;
    }

    // Insert new user
    const { data, error } = await supabase
      .from("users")
      .insert([{ username: usernameInput, password }]);

    if (error) {
      alert("Error creating account");
      console.error("Signup error:", error.message);
      return;
    }

    console.log("User inserted:", data);
    setUsername(usernameInput);
    router.replace("/follower_feed");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Screen Time!</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={usernameInput}
        onChangeText={setUsernameInput}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // hides text like ••••••
      />
      <Button
        title={isLogin ? "Log In" : "Sign Up"}
        onPress={isLogin ? handleLogin : handleSignUp}
      />

      <Text style={{ marginTop: 16 }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}
      </Text>
      <Button
        title={isLogin ? "Switch to Sign Up" : "Switch to Log In"}
        onPress={() => setIsLogin(!isLogin)}
        color="#888"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    alignItems: "flex-start",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: "4%",
    borderColor: "#aaa",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 16,
    paddingHorizontal: 10,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
  },
  button: {
    marginTop: 12,
  },
});
