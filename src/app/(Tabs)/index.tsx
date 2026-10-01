import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  TextInput,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCart } from "../../context/authContext";
import { useUser } from "@/context/userContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest, handleApiError } from "@/lib/api";
const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const { addItem } = useCart();
  const [inputValue, setInputValue] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [products,setProducts]=useState<any>(null);
  const {user}=useUser();
  const AllProducts=async()=>{
    try {
      const token = await AsyncStorage.getItem('token')
      const data = await apiRequest(`/api/products`,{
        method:"GET",
        headers:{
          "Content-type":'application/json',
          authorization:`Bearer ${token}`
        },
      });
      setProducts(data.products);
    }catch (error) {
      handleApiError(error);
    }
  };
   useEffect(()=>{
    AllProducts();
  },[]);

  const categories = [
    { name: "Footwear", icon: "footsteps-outline" },
    { name: "Accessories", icon: "watch-outline" },
    { name: "Kitchen & Dining", icon: "fast-food-outline" },
    { name: "Electronics", icon: "hardware-chip-outline" },
    { name: "Apparel", icon: "shirt-outline" },
  ];
  const handleOpenProduct = (product: any) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };
  
  //{ const filteredProducts = [...products!]
//     .filter((product) =>
//       product.name.toLowerCase().includes(inputValue.toLowerCase()),
//     )
//     .sort((a, b) => {
//       const aStarts = a.name.toLowerCase().startsWith(inputValue.toLowerCase());
//       const bStarts = b.name.toLowerCase().startsWith(inputValue.toLowerCase());
//       if (aStarts && !bStarts) return -1; // Pulls 'a' to the absolute top of the grid list
//       if (!aStarts && bStarts) return 1;
//       return 0;
//     });
//   useEffect(() => {
//     const delayTimer = setTimeout(() => {
//       setDebouncedSearch(inputValue);
//     }, 500);

//     return () => clearTimeout(delayTimer); // Clears the timer if user hits another key before 500ms
//   }, [inputValue]);

//   // 3. SEVERE NETWORK SIMULATOR: Runs ONLY when the debounced search updates
//   useEffect(() => {
//     if (debouncedSearch.trim() === "") return;

//     // Tomorrow, this is where your fetch(`http://localhost:5500/api/products?search=${debouncedSearch}`) lives!
  //}, [debouncedSearch]);}
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Pressable
              style={styles.imageWrapper}
              onPress={() => handleOpenProduct(item)}
            >
              <Image
                source={require("../../../assets/images/ceo.jpg")}
                style={styles.productImage}
              />

              <View style={styles.newTag}>
                <Text style={styles.newTagText}>NEW</Text>
              </View>

              <Pressable style={styles.heartButton}>
                <Ionicons name="heart-outline" size={16} color="#E94057" />
              </Pressable>
            </Pressable>

            <View style={styles.cardDetails}>
              <Text style={styles.productCategory}>{item.category}</Text>
              <Text style={styles.productName} numberOfLines={1}>
                {item.name}
              </Text>

              <View style={styles.priceRow}>
                <Text style={styles.productPrice}>
                  ${item.price}
                </Text>

                <Pressable onPress={() => addItem(item)}>
                  <LinearGradient
                    colors={["#8A2387", "#E94057"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.smallAddBtn}
                  >
                    <Ionicons name="add" size={16} color="#FFF" />
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
          </View>
        )}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.topBar}>
              <View>
                <Text style={styles.welcomeText}>{`${user?.name} 👋`||"Hello Guest 👋"}</Text>
                <Text style={styles.welcomeText}>{user?.email}</Text>
                <Text style={styles.discoverText}>Explore Brands</Text>
              </View>
              <Pressable style={styles.bellButton}>
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color="#1A1A1A"
                />
              </Pressable>
            </View>

            <View style={styles.searchBarContainer}>
              <Ionicons
                name="search-outline"
                size={18}
                color="#7A869A"
                style={{ marginRight: 10 }}
              />
              <TextInput
                placeholder="What are you looking for?"
                placeholderTextColor="#7A869A"
                style={styles.searchInput}
                value={inputValue}
                onChangeText={(text) => setInputValue(text)}
              />
            </View>

            <LinearGradient
              colors={["#8A2387", "#E94057", "#F27121"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bannerContainer}
            >
              <View style={styles.bannerTextLeftColumn}>
                <Text style={styles.bannerBadge}>BEST SELLER</Text>
                <Text style={styles.bannerTitle}>
                  Discover your perfect shopping journey!
                </Text>
                <Pressable style={styles.shopNowButton}>
                  <Text style={styles.shopNowText}>Shop Now!</Text>
                </Pressable>
              </View>
              <Image
                source={require("../../../assets/images/ceo.jpg")}
                style={styles.bannerImage}
              />
            </LinearGradient>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <Text style={styles.seeMoreLink}>See all</Text>
            </View>

            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.name}
              contentContainerStyle={styles.categoriesHorizontalList}
              renderItem={({ item }) => (
                <Pressable style={styles.categoryBadgeCard}>
                  <View style={styles.categoryIconCircle}>
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color="#E94057"
                    />
                  </View>
                  <Text style={styles.categoryLabelText}>{item.name}</Text>
                </Pressable>
              )}
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended</Text>
              <Text style={styles.seeMoreLink}>See more</Text>
            </View>
          </View>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlayOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalHeaderCloseRow}>
              <View style={styles.pullDashHandle} />
              <Pressable
                style={styles.modalCloseButtonCircle}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={20} color="#1A1A1A" />
              </Pressable>
            </View>
            <View style={styles.modalImageWindow}>
              <Image
                source={require("../../../assets/images/ceo.jpg")}
                style={styles.modalHeroImage}
              />
            </View>
            <ScrollView
              contentContainerStyle={styles.modalScrollDetails}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.modalCategoryText}>
                {selectedProduct?.category}
              </Text>
              <Text style={styles.modalProductNameText}>
                {selectedProduct?.name}
              </Text>

              <Text style={styles.modalSectionLabel}>Product Details</Text>
              <Text style={styles.modalDescriptionText}>
                {selectedProduct?.description}
              </Text>
            </ScrollView>
            <View style={styles.modalStickyActionFooter}>
              <View>
                <Text style={styles.modalFooterPriceLabel}>Total Price</Text>
                <Text style={styles.modalFooterPriceValue}>
                  ${selectedProduct?.price}
                </Text>
              </View>

              <Pressable
                onPress={() => {
                  addItem(selectedProduct);
                  setModalVisible(false);
                }}
              >
                <LinearGradient
                  colors={["#8A2387", "#E94057", "#F27121"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalPrimaryActionBtn}
                >
                  <Ionicons
                    name="cart-outline"
                    size={18}
                    color="#FFF"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.modalActionBtnText}>Add To Cart</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
// Append these rules safely inside your bottom StyleSheet config block
const styles = StyleSheet.create({
  // ... Keep all previous Home Screen styles completely identical ...
  container: { flex: 1, backgroundColor: "#F8F9FB" },
  listContent: { paddingBottom: 110 }, // 🌟 Safe buffer cushion to scroll clear of floating tab bar
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 16,
  },
  welcomeText: { fontSize: 13, color: "#7A869A", fontWeight: "600" },
  discoverText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  bellButton: {
    width: 44,
    height: 44,
    backgroundColor: "#FFF",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F0F2F5",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#F0F2F5",
    marginBottom: 20,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#1A1A1A", fontWeight: "500" },
  bannerContainer: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    overflow: "hidden",
  },
  bannerTextLeftColumn: { flex: 1, zIndex: 2 },
  bannerBadge: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFF",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFF",
    lineHeight: 24,
    marginBottom: 14,
  },
  shopNowButton: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  shopNowText: { color: "#E94057", fontSize: 12, fontWeight: "700" },
  bannerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -0.3,
  },
  seeMoreLink: { fontSize: 13, color: "#E94057", fontWeight: "700" },
  categoriesHorizontalList: {
    paddingLeft: 20,
    paddingRight: 10,
    marginBottom: 24,
  },
  categoryBadgeCard: { alignItems: "center", marginRight: 20 },
  categoryIconCircle: {
    width: 56,
    height: 56,
    backgroundColor: "#FFF",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F0F2F5",
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
  },
  categoryLabelText: {
    fontSize: 12,
    color: "#4A5568",
    fontWeight: "600",
    textAlign: "center",
  },
  productRow: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  productCard: {
    width: (width - 54) / 2,
    backgroundColor: "#FFF",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F2F5",
  },
  imageWrapper: {
    width: "100%",
    height: 130,
    backgroundColor: "#F5F5F5",
    position: "relative",
  },
  productImage: { width: "100%", height: "100%", resizeMode: "cover" },
  newTag: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#E94057",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  newTagText: { color: "#FFF", fontSize: 9, fontWeight: "800" },
  heartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FFF",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardDetails: { padding: 12 },
  productCategory: {
    fontSize: 10,
    color: "#7A869A",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 2,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: { fontSize: 15, fontWeight: "800", color: "#1A1A1A" },
  smallAddBtn: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // 🌟 NEW MODAL DESIGN SYSTEM ARCHITECTURE RULES
  modalOverlayOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Dims the background canvas beautifully
    justifyContent: "flex-end",
  },
  modalSheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: height * 0.62, // Slides up to fill exactly 82% of any phone viewport height
    paddingTop: 14,
  },
  modalHeaderCloseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingBottom: 10,
  },
  pullDashHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
  },
  modalCloseButtonCircle: {
    position: "absolute",
    right: 20,
    top: -4,
    backgroundColor: "#F1F5F9",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  modalImageWindow: {
    width: width,
    height: height * 0.28,
    backgroundColor: "#F8FAFC",
    overflow: "hidden",
  },
  modalHeroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain", // Scale product layout naturally without crop bounds bleed
  },
  modalScrollDetails: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  modalCategoryText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#E94057",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalProductNameText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    marginTop: 4,
    marginBottom: 20,
  },
  modalSectionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  modalDescriptionText: {
    fontSize: 14,
    color: "#4A5568",
    lineHeight: 22,
    fontWeight: "500",
  },
  modalStickyActionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 20, // Pad safely above iOS swipe home lines bars
  },
  modalFooterPriceLabel: {
    fontSize: 12,
    color: "#7A869A",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  modalFooterPriceValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1A1A1A",
    marginTop: 2,
  },
  modalPrimaryActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 54,
    paddingHorizontal: 36,
    borderRadius: 16,
    shadowColor: "#E94057",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  modalActionBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
