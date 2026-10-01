import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSession } from "@/context/authContext";
import { router } from "expo-router";
import { useUser } from "@/context/userContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest, handleApiError } from "@/lib/api";
export default function ProfileScreen() {
  const [orders, setOrders] = useState<any>();
  const { signOut } = useSession();
  const { user } = useUser();
  const fetchOrderHistory = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const data = await apiRequest(
        `/api/getOrders`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );
      setOrders(data.order || data || []);
    } catch (error) {
      handleApiError(error);
    }
  }
    useEffect(() => {
      if (user?.id) {
        fetchOrderHistory();
      }
    }, [user]);
    const totalOrdersCount = orders ? orders.length : 0;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={["#8A2387", "#E94057", "#F27121"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBanner}
          >
            <View style={styles.avatarWrapper}>
              <Image
                source={require("../../../assets/images/ceo.jpg")}
                style={styles.avatarImage}
              />
            </View>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.userEmail}>
              +966-({user?.phone || "000000"})
            </Text>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>Member since Sep 2026</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <Pressable
                style={{
                  marginLeft: 8,
                  padding: 4,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: 8,
                  alignItems: "center",
                }}
                onPress={() => router.push("/admin/editUser")}
              >
                <Text style={styles.tagText}>Edit Profile</Text>
                <Ionicons name="create-outline" size={16} color="#FFF" />
              </Pressable>
            </View>
          </LinearGradient>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{totalOrdersCount}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>
          <Text style={styles.sectionHeaderTitle}>Account Settings</Text>
          <View style={styles.menuContainer}>
            <Pressable
              style={styles.menuItem}
              onPress={() => router.push("/admin/ordersPage")}
            >
              <View style={styles.menuItemLeft}>
                <View
                  style={[styles.iconIconBg, { backgroundColor: "#FFEBF0" }]}
                >
                  <Ionicons name="receipt-outline" size={20} color="#E94057" />
                </View>
                <Text style={styles.menuItemText}>My Orders (Receipts)</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#CCCCCC" />
            </Pressable>
            <Pressable
              style={styles.menuItem}
              onPress={() => router.push("/admin/payment")}
            >
              <View style={styles.menuItemLeft}>
                <View
                  style={[styles.iconIconBg, { backgroundColor: "#EBF3FF" }]}
                >
                  <Ionicons name="card-outline" size={20} color="#007AFF" />
                </View>
                <Text style={styles.menuItemText}>Payment Methods</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#CCCCCC" />
            </Pressable>
            <Pressable
              style={styles.menuItem}
              onPress={() => router.push("/admin/address")}
            >
              <View style={styles.menuItemLeft}>
                <View
                  style={[styles.iconIconBg, { backgroundColor: "#EFFFF4" }]}
                >
                  <Ionicons name="location-outline" size={20} color="#34C759" />
                </View>
                <Text style={styles.menuItemText}>Shipping Addresses</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#CCCCCC" />
            </Pressable>
          </View>
          <Text style={styles.sectionHeaderTitle}>Preferences</Text>
          <View style={styles.menuContainer}>
            <Pressable style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View
                  style={[styles.iconIconBg, { backgroundColor: "#FFF9EB" }]}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color="#FF9500"
                  />
                </View>
                <Text style={styles.menuItemText}>Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#CCCCCC" />
            </Pressable>
            <Pressable
              style={styles.menuItem}
              onPress={() => router.push("admin/uploads" as any)}
            >
              <View style={styles.menuItemLeft}>
                <View
                  style={[styles.iconIconBg, { backgroundColor: "#F2E7FE" }]}
                >
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color="#AF52DE"
                  />
                </View>
                <Text style={styles.menuItemText}>Admin Product Upload</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#CCCCCC" />
            </Pressable>
          </View>
          <Pressable style={styles.logoutButton} onPress={() => signOut()}>
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#E94057"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.logoutText}>Log Out Account</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  };
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
    marginBottom: 4,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Hero Profile Header Styles
  heroBanner: {
    alignItems: "center",
    paddingVertical: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: "#E94057",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 4,
    marginBottom: 12,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 46,
    resizeMode: "cover",
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
    fontWeight: "500",
  },
  tagBadge: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
  },
  tagText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },

  // Engagement Counter Metrics Row
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: -25, // Safely overlaps into the bottom arc of the hero gradient banner
    borderRadius: 20,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 4,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  statLabel: {
    fontSize: 12,
    color: "#7A869A",
    fontWeight: "500",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#F0F2F5",
    height: "100%",
  },

  // Settings Option Rows Layout System
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#7A869A",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginLeft: 24,
    marginTop: 28,
    marginBottom: 10,
  },
  menuContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 20,
    paddingHorizontal: 16,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#FAFAFB",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },

  // Exit Action Button
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#FFEBF0",
    marginHorizontal: 20,
    marginTop: 32,
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  logoutText: {
    color: "#E94057",
    fontSize: 15,
    fontWeight: "700",
  },
});
