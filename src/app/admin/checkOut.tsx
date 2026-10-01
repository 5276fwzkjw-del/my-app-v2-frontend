import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { useCart } from "../../context/authContext";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest, handleApiError } from "@/lib/api";
const { width } = Dimensions.get("window");
export default function CheckoutScreen() {
  const {totalItems,cart,setCart} = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    streetAddress: "Kampala",
    paymentMethod: "cod",
  });

  const [checkoutState, setCheckoutState] = useState<
    "idle" | "processing" | "success"
  >("idle");
const calculatedTotalItems = cart && cart.length > 0 
  ? cart.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 1), 0) 
  : 0;
const subtotal = cart && cart.length > 0 ? cart.reduce((sum: number, item: any) => {
  const priceValue = item.product.price !== undefined ? item.product.price : (item.product.price !== undefined ? item.product.price : 0);
  const cleanPrice = typeof priceValue === 'number' ? priceValue : parseFloat(priceValue) || 0;
  const cleanQty = Number(item.quantity) || 1;
  return sum + (cleanPrice * cleanQty);
}, 0) : 0;

const shipping = form.paymentMethod === 'pickup' ? 0 : 10.00;
const total = subtotal + shipping;

  const handleAuthorizeOrder = async() => {
    const token = await AsyncStorage.getItem('token');
    if (
      form.paymentMethod !== "pickup" &&
      (!form.fullName || !form.phone || !form.streetAddress)
    ) {
      alert(
        "Please fill in your shipping destination fields before checking out.",
      );
      return;
    }
    setCheckoutState("processing");
    try {
      const data= await apiRequest(`/api/checkOut`,{
        method:'POST',
        headers:{
          'Content-type':'application/json',
          authorization: `Bearer ${token}`
        },
        body:JSON.stringify({shipping_address:form.streetAddress}),
      });
 
      setTimeout(() => {
      setCheckoutState("success");
      setTimeout(() => {
        router.replace("/(Tabs)");
      }, 2500);
    }, 3000);
      setCart([]);
    } catch (error) {
      handleApiError(error)
    }
   
  };
  if (checkoutState === "processing") {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={styles.loadingCard}
        >
          <ActivityIndicator size="large" color="#E94057" />
          <Text style={styles.processingTitle}>Encrypting Gateway...</Text>
          <Text style={styles.processingSubtitle}>
            Securing your transaction snapshot data package seamlessly.
          </Text>
        </MotiView>
      </SafeAreaView>
    );
  }
  if (checkoutState === "success") {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <MotiView
          from={{ opacity: 0, scale: 0.5, translateY: 40 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 12 }}
          style={styles.loadingCard}
        >
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark-sharp" size={44} color="#FFF" />
          </View>
          <Text style={styles.successTitle}>Order Placed!</Text>
          <Text style={styles.processingSubtitle}>
            Your transaction hash was committed safely to the local log tree
            ledger. Navigating home...
          </Text>
        </MotiView>
      </SafeAreaView>
    );
  }
  return (
    <>
    <Stack.Screen options={{headerShown:false}} />
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Back Button Row */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
          </Pressable>
          <Text style={styles.headerTitle}>Checkout Details</Text>
        </View>

        {/* SECTION 1: CONDITIONAL SHIPPING FORM MODULE */}
        {form.paymentMethod !== "pickup" && (
          <MotiView
            from={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <Text style={styles.sectionTitle}>1. Shipping Destination</Text>
            <View style={styles.cardContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Recipient Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Ibrahim Ssekyanzi"
                  value={form.fullName}
                  onChangeText={(txt) => setForm({ ...form, fullName: txt })}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mobile Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+966 50 000 0000"
                  keyboardType="phone-pad"
                  value={form.phone}
                  onChangeText={(txt) => setForm({ ...form, phone: txt })}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Street Address & Apartment</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Al Mohammadiyyah, Olaya Street"
                  value={form.streetAddress}
                  onChangeText={(txt) =>
                    setForm({ ...form, streetAddress: txt })
                  }
                />
              </View>
            </View>
          </MotiView>
        )}
        <Text style={styles.sectionTitle}>2. Payment Method Option</Text>
        <View style={styles.cardContainer}>
          <Pressable
            style={[
              styles.payMethodRow,
              form.paymentMethod === "cod" && styles.activePayRow,
            ]}
            onPress={() => setForm({ ...form, paymentMethod: "cod" })}
          >
            <View style={styles.payMethodLeft}>
              <Ionicons
                name="cash-outline"
                size={20}
                color={form.paymentMethod === "cod" ? "#E94057" : "#7A869A"}
              />
              <Text style={styles.payMethodText}>Cash on Delivery</Text>
            </View>
            <Ionicons
              name={
                form.paymentMethod === "cod" ? "radio-button-on" : "radio-button-off"
              }
              size={18}
              color={form.paymentMethod === "cod" ? "#E94057" : "#CCCCCC"}
            />
          </Pressable>
          <Pressable
            style={[
              styles.payMethodRow,
              form.paymentMethod === "pickup" && styles.activePayRow,
            ]}
            onPress={() => setForm({ ...form, paymentMethod: "pickup" })}
          >
            <View style={styles.payMethodLeft}>
              <Ionicons
                name="business-outline"
                size={20}
                color={form.paymentMethod === "pickup" ? "#E94057" : "#7A869A"}
              />
              <Text style={styles.payMethodText}>Pick up from Store</Text>
            </View>
            <Ionicons
              name={
                form.paymentMethod === "pickup"
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={18}
              color={form.paymentMethod === "pickup" ? "#E94057" : "#CCCCCC"}
            />
          </Pressable>
          <Pressable
            style={[
              styles.payMethodRow,
              form.paymentMethod === "apple" && styles.activePayRow,
              { borderBottomWidth: 0 },
            ]}
            onPress={() => setForm({ ...form, paymentMethod: "apple" })}
          >
            <View style={styles.payMethodLeft}>
              <Ionicons
                name="logo-apple"
                size={20}
                color={form.paymentMethod === "apple" ? "#E94057" : "#1A1A1A"}
              />
              <Text style={styles.payMethodText}>
                Apple Pay
              </Text>
            </View>
            <Ionicons
              name={
                form.paymentMethod === "apple"
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={18}
              color={form.paymentMethod === "apple" ? "#E94057" : "#CCCCCC"}
            />
          </Pressable>
        </View>

        {/* SECTION 3: COST ORDER TOTAL SUMMARY TALLY */}
        <Text style={styles.sectionTitle}>3. Cost Summary Tally</Text>
        <View style={styles.cardContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryVal}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryVal}>${shipping.toFixed(2)}</Text>
          </View>
          <View style={styles.dividerLine} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Ledger Sum</Text>
            <Text style={styles.totalVal}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* AUTHORIZATION FIRE ACTION CTA BUTTON */}
        <Pressable onPress={handleAuthorizeOrder} style={styles.btnSpacer}>
          <LinearGradient
            colors={["#8A2387", "#E94057", "#F27121"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.checkoutBtn}
          >
            <Text style={styles.checkoutBtnText}>
              {form.paymentMethod === "apple"
                ? "Authorize Apple Pay"
                : "Confirm Order Checkout"}{" "}
              ({calculatedTotalItems} Items)
            </Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    backgroundColor: "#FFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F0F2F5",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A1A",
    marginLeft: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#7A869A",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 12,
    marginTop: 8,
  },
  cardContainer: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F2F5",
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#7A869A",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#F8F9FB",
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  payMethodRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F5",
  },
  activePayRow: {
    backgroundColor: "#FFFBFB",
  },
  payMethodLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  payMethodText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#7A869A",
    fontWeight: "500",
  },
  summaryVal: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#F0F2F5",
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  totalVal: {
    fontSize: 18,
    fontWeight: "900",
    color: "#E94057",
  },
  btnSpacer: {
    marginTop: 4,
  },
  checkoutBtn: {
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },

  // Simulated Processing & Success Loading States
  centerContainer: {
    flex: 1,
    backgroundColor: "#F8F9FB",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingCard: {
    backgroundColor: "#FFF",
    padding: 32,
    borderRadius: 28,
    width: width * 0.85,
    alignItems: "center",
    shadowColor: "#E94057",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  processingTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A1A",
    marginTop: 20,
    marginBottom: 8,
  },
  processingSubtitle: {
    fontSize: 13,
    color: "#7A869A",
    textAlign: "center",
    lineHeight: 18,
    fontWeight: "500",
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#34C759",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#34C759",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1A1A1A",
    marginTop: 20,
    marginBottom: 8,
  },
});
