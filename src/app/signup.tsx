import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { apiRequest, handleApiError } from "@/lib/api";
export default function Signup() {
  const [data, setData] = useState<any>({
    name: "",
    email: "",
    password: "",
  });
  const [feed, setFeed] = useState<any | []>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const handleSignup = async () => {
    if (data.password.length < 6) {
      return setError("Sorry All fields Are required !");
    }
    setLoading(true);
    try {
      const datak = await apiRequest(
        `/api/registerUser`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );
      setFeed(datak.message);
      setData({
        name: "",
        email: "",
        password: "",
      });
      
      router.push("/login");
    } catch (error) {
      handleApiError(error);
    } finally {
      setError("");
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Ionicons
        name="leaf"
        size={48}
        color="#4A6741"
        style={{ alignSelf: "center" }}
      />
      <Text style={styles.title}>Your journey Starts Here</Text>
      <Text style={styles.subtitle}>Take your fast step</Text>
      {error ? (
        <Text
          style={{
            color: "red",
            textAlign: "center",
            fontSize: 15,
            marginTop: -20,
            marginBottom: 9,
          }}
        >
          {error}
        </Text>
      ) : (
        <Text
          style={{
            color: "blue",
            textAlign: "center",
            fontSize: 15,
            marginTop: -20,
            marginBottom: 9,
          }}
        >
          {feed}
        </Text>
      )}
      <View style={styles.inputRow}>
        <Ionicons name="person-outline" size={20} color={"#666"} />
        <TextInput
          placeholder="Username"
          placeholderTextColor={"#918c8cff"}
          style={styles.input}
          value={data.name}
          onChangeText={(text) => setData({ ...data, name: text })}
        />
      </View>
      <View style={styles.inputRow}>
        <Ionicons name="mail-outline" size={20} color={"#666"} />
        <TextInput
          placeholder="Email"
          placeholderTextColor={"#918c8cff"}
          autoComplete="off"
          autoCapitalize="none"
          style={styles.input}
          value={data.email}
          onChangeText={(text) => setData({ ...data, email: text })}
        />
      </View>
      <View style={styles.inputRow}>
        <Ionicons name="lock-closed-outline" size={20} color={"#666"} />
        <TextInput
          placeholder="Password"
          placeholderTextColor={"#918c8cff"}
          secureTextEntry
          style={styles.input}
          value={data.password}
          onChangeText={(text) => setData({ ...data, password: text })}
        />
      </View>
      <Pressable onPress={() => handleSignup()}>
        {loading ? (
          <View style={styles.signupButtonTextAct}>
            <ActivityIndicator color="blue" size={"large"} />
          </View>
        ) : (
          <View style={styles.signupButton}>
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </View>
        )}
      </Pressable>
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Or</Text>
        <View style={styles.dividerLine} />
      </View>
      <View style={styles.socialRow}>
        <Ionicons name="logo-facebook" size={28} color="#2C3E2C" />
        <Ionicons name="logo-apple" size={28} color="#2C3E2C" />
        <Ionicons name="logo-google" size={28} color="#2C3E2C" />
      </View>
      <View style={styles.footerRow}>
        <Text>Already have an account?</Text>
        <Link href={"/login"}>
          <Text style={styles.footerLink}> Login here</Text>
        </Link>
      </View>
      {/* <View style={styles.dividerRow}> <View style={styles.dividerLine}/></View> */}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F0E9", // the cream background from the design
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#2C3E2C",
    marginTop: 12,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#2C3E2C",
    marginBottom: 32,
  },
  inputRow: {
    flexDirection: "row", // icon and text side by side
    alignItems: "center",
    backgroundColor: "#DDE3D4", // the soft green-grey pill color
    borderRadius: 30, // fully rounded, "pill" shape
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    gap: 10, // spacing between icon and input
  },
  input: {
    flex: 1, // takes remaining space next to the icon
    fontSize: 15,
  },
  signupButton: {
    backgroundColor: "#2C3E2C",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#999",
  },
  dividerText: {
    color: "#666",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
    marginBottom: 24,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerLink: {
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  signupButtonTextAct: {
    borderRadius: 30,
    alignItems: "center",
  },
});
