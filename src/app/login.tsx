import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useSession } from "@/context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest, handleApiError } from "@/lib/api";
export default function Login() {
  const { signIn } = useSession();
  const [error, setError] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>({
    email: "",
    password: "",
  });
  const handleLogin = async () => {
    if (data.password.length < 6) {
      return setError("Password must be longer than 6 characters !");
    }
    setLoading(true);
    try {
      const datak = await apiRequest(
        `/api/login`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );
      // await AsyncStorage.setItem(returningData.token,'token');
      const secureToken = datak.user?.token;
      signIn(secureToken);
      setLoading(false);
    } catch (error) {
      handleApiError(error);
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
      <Text style={styles.title}>Your Almost there...</Text>
      <Text style={styles.subtitle}>Login to Continue.</Text>
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
      <View style={styles.inputRow}>
        <Ionicons name="mail-outline" size={20} color={"#323030ff"} />
        <TextInput
          placeholder="Email"
          placeholderTextColor={"#918c8cff"}
          style={styles.input}
          value={data.email}
          autoCapitalize="none"
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
      <Pressable onPress={() => handleLogin()}>
        {loading ? (
          <View style={styles.signupButtonTextAct}>
            <ActivityIndicator color={"#0000ff"} size={"large"} />
          </View>
        ) : (
          <View style={styles.signupButton}>
            <Text style={styles.signupButtonText}>Login</Text>
          </View>
        )}
      </Pressable>
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Or</Text>
        <View style={styles.dividerLine} />
      </View>
      <View style={styles.socialRow}>
        <Ionicons name="logo-facebook" size={30} color="#0004ffff" />
        <Ionicons name="logo-apple" size={30} color="#000000ff" />
        <Ionicons name="logo-google" size={30} color="#f3211dff" />
      </View>
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <Link href={"/signup"}>
          <Text style={styles.footerLink}> Sign up</Text>
        </Link>
      </View>
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
    fontSize: 18,
    color: "#2c2929ff",
  },
  signupButton: {
    backgroundColor: "#5C7A5C", // the green button color
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
    fontSize: 18,
    fontWeight: "600",
  },
  footerText: {
    fontSize: 18,
  },
  signupButtonTextAct: {
    borderRadius: 30,
    alignItems: "center",
  },
});
