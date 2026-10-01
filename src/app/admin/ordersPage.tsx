import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { useUser } from "../../context/userContext"; // Your verified global user context hook
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest, handleApiError } from "@/lib/api";
export default function OrdersScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // 1. BACKEND SYNC EFFECT FOR HISTORY LOGS
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
      setLoading(false);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user?.id) {
      fetchOrderHistory();
    }
  }, [user]);

  const toggleExpandOrder = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#E94057" />
        <Text style={styles.loadingText}>Fetching transaction logs...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
   <Stack.Screen options={{headerShown:false}} />
    <SafeAreaView style={styles.container}>
      {/* Dynamic Header Row */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </Pressable>
        <View style={styles.headerTextWrapper}>
          <Text style={styles.headerTitle}>Order History</Text>
          <Text style={styles.headerSubtitle}>
            Manage your verified transaction receipts
          </Text>
        </View>
      </View>

      {/* Main Receipts Ledger List */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.order.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color="#CCCCCC" />
            <Text style={styles.emptyText}>No historic receipts found</Text>
          </View>
        )}
        renderItem={({ item, index }) => {
          const isExpanded = expandedOrderId === item.order.id;
            const dateOnly = item.order.createdAt.split(' ')[0];
            const [year, month,day]=dateOnly.split('-');
            const formattedDate = `${day}/${month}/${year}`

          return (
            <MotiView
              from={{ opacity: 0, translateY: 15 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 300, delay: index * 60 }}
              style={styles.orderCard}
            >
              <View
                style={[
                  styles.statusStripe,
                  {
                    backgroundColor:
                      item.order.payment_status === "paid"
                        ? "#34C759"
                        : "#FF9500",
                  },
                ]}
              />

              <Pressable
                style={styles.cardPressableArea}
                onPress={() => toggleExpandOrder(item.order.id)}
              >
                <View style={styles.cardHeaderSummaryRow}>
                  <View>
                    <Text style={styles.orderIdText}>
                      ID: #{item.order.id.substring(0, 10).toUpperCase()}
                    </Text>
                    <Text style={styles.orderDateText}>Date: {formattedDate}</Text>
                  </View>
                  <View style={styles.rightPriceBadgeColumn}>
                    <Text style={styles.orderPriceText}>
                      ${Number(item.order.total_amount).toFixed(2)}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            item.order.payment_status === "paid"
                              ? "#EFFFF4"
                              : "#FFF9EB",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          {
                            color:
                              item.order.payment_status === "paid"
                                ? "#34C759"
                                : "#FF9500",
                          },
                        ]}
                      >
                        {item.order.payment_status}
                      </Text>
                    </View>
                  </View>
                </View>
                {isExpanded && (
                  <MotiView
                    from={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    style={styles.expandedDrawerContainer}
                  >
                    <View style={styles.dividerLine} />

                    <Text style={styles.drawerSectionLabel}>
                      Destination Address:
                    </Text>
                    <Text style={styles.drawerAddressValueText}>
                      {item.order.shipping_address.toUpperCase()}
                    </Text>

                    <Text style={styles.drawerSectionLabel}>
                      Purchased Items Summary:
                    </Text>
                    {item.items &&
                      item.items.map((prod: any) => (
                        <View key={prod.id} style={styles.productItemRow}>
                          <Text
                            style={styles.productNameText}
                            numberOfLines={1}
                          >
                            • {prod.product.name}{" "}
                            <Text style={styles.productQtyText}>
                              {" "}
                              x{prod.quantity}
                            </Text>
                          </Text>
                          <Text style={styles.productPriceText}>
                            $
                            {(
                              Number(prod.price_per_item) * prod.quantity
                            ).toFixed(2)}
                          </Text>
                        </View>
                      ))}
                  </MotiView>
                )}

                <View style={styles.bottomChevronIndicatorRow}>
                  <Text style={styles.viewDetailsPromptText}>
                    {isExpanded
                      ? "Hide Breakdowns"
                      : "View Full Breakdown Receipt"}
                  </Text>
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={14}
                    color="#7A869A"
                  />
                </View>
              </Pressable>
            </MotiView>
          );
        }}
      />
    </SafeAreaView>
     </>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FB" },
  centerContainer: {
    flex: 1,
    backgroundColor: "#F8F9FB",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#7A869A",
    fontWeight: "600",
  },
  listContent: { padding: 20, paddingBottom: 100 }, // Safe cushion clear of the navigation bars
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 10,
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
  headerTextWrapper: { marginLeft: 16 },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#7A869A",
    fontWeight: "500",
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 120,
  },
  emptyText: { marginTop: 12, fontSize: 15, color: "#999", fontWeight: "600" },

  // Premium Card Summary Architecture
  orderCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 20,
    marginBottom: 16,
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F2F5",
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  statusStripe: {
    width: 5,
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
  },
  cardPressableArea: { flex: 1, padding: 16, paddingLeft: 20 },
  cardHeaderSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  orderIdText: { fontSize: 15, fontWeight: "700", color: "#1A1A1A" },
  orderDateText: {
    fontSize: 12,
    color: "#7A869A",
    fontWeight: "500",
    marginTop: 3,
  },
  rightPriceBadgeColumn: { alignItems: "flex-end" },
  orderPriceText: { fontSize: 16, fontWeight: "800", color: "#1A1A1A" },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
  statusBadgeText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.3 },

  // Accordion Expand Details Drawer Elements
  expandedDrawerContainer: { marginTop: 12, paddingBottom: 4 },
  dividerLine: { height: 1, backgroundColor: "#F0F2F5", marginBottom: 12 },
  drawerSectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#7A869A",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
    marginTop: 8,
  },
  drawerAddressValueText: {
    fontSize: 13,
    color: "#4A5568",
    fontWeight: "500",
    lineHeight: 18,
    marginBottom: 8,
  },
  productItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 3,
  },
  productNameText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1A1A",
    flex: 1,
    marginRight: 16,
  },
  productQtyText: { color: "#E94057", fontWeight: "700" },
  productPriceText: { fontSize: 13, fontWeight: "700", color: "#4A5568" },

  // Interactive Drawer Toggles Bar
  bottomChevronIndicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#FAFAFB",
  },
  viewDetailsPromptText: {
    fontSize: 12,
    color: "#7A869A",
    fontWeight: "600",
    marginRight: 6,
  },
});
