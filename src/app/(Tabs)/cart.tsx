import React, { useCallback, useEffect } from 'react';
import { View, Text, FlatList, Image, Pressable, SafeAreaView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from '../../context/authContext'
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router/build/react-navigation';
export default function CartScreen() {
  const { cart, updateQty, removeFromCart,getCart} = useCart();
  const router = useRouter();
  useFocusEffect(
    useCallback(()=>{
      getCart()
    },[getCart])
  )
  const subtotal = cart.reduce((sum: number, item: any) => sum + (item.product.price || 0) * (item.quantity || 1), 0);
  const shipping = subtotal > 0 ? 10.00 : 0;
  const total = subtotal + shipping;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <MotiView 
          animate={{ scale: cart.length ? [1, 1.1, 1] : 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <Text style={styles.headerCount}>{cart.length} items</Text>
        </MotiView>
      </View>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={64} color="#CCC" />
            <Pressable onPress={()=>router.push('/(Tabs)')}><Text style={styles.emptyText}>Your cart is empty</Text></Pressable>
          </View>
        )}
        renderItem={({ item, index }) => (
          <MotiView
            from={{ opacity: 0, translateY: 20, scale: 0.95 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={{ type: 'timing', duration: 300, delay: index * 50 }}
            style={styles.cartCard}>
            <LinearGradient
              colors={['#8A2387', '#E94057']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.gradientBorder}
            />
            <View style={styles.imageWrapper}>
              <Image 
                source={require('../../../assets/images/ceo.jpg')}
                style={styles.productImage} 
              />
            </View>
            <View style={styles.detailsContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.categoryText}>{item.product.category || "Footwear"}</Text>
                <Pressable onPress={() => removeFromCart(item.product.id)} hitSlop={12}>
                  <Ionicons name="trash-outline" size={18} color="#E94057" />
                </Pressable>
              </View>
              <Text style={styles.productName} numberOfLines={1}>
                {item.product.name || "AeroStride Running Shoes"}
              </Text>
              
              <Text style={styles.productDescription} numberOfLines={1}>
                {item.product.description || "Lightweight breathable mesh sneakers designed for comfort."}
              </Text>
              
              <View style={styles.actionRow}>
                <MotiView animate={{ scale: item.qty ? [1, 1.05, 1] : 1 }}>
                  <Text style={styles.productPrice}>
                    ${((item.product.price || 89.99) * (item.quantity || 1)).toFixed(2)}
                  </Text>
                </MotiView>
                <View style={styles.quantityStepper}>
                  <Pressable style={styles.stepperButton} onPress={() => updateQty(item.product.id, 'decrement')}>
                    <Ionicons name="remove" size={14} color="#FFF" />
                  </Pressable>
                  <Text style={styles.quantityText}>{item.quantity || 1}</Text>
                  <Pressable style={styles.stepperButton} onPress={() => updateQty(item.product.id, 'increment')}>
                    <Ionicons name="add" size={14} color="#FFF" />
                  </Pressable>
                </View>
              </View>
            </View>
          </MotiView>
        )}
      />
      {cart.length > 0 && (
        <View style={styles.checkoutFooter}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Price</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>

          <Pressable onPress={() => router.push("/admin/checkOut" as any)}>
            <LinearGradient
              colors={['#8A2387', '#E94057', '#F27121']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.checkoutButton}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </LinearGradient>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

// 4. PRODUCTION ALL-IN-ONE STYLE BLOCKS
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 18, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F0F2F5' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', letterSpacing: -0.5 },
  headerCount: { fontSize: 14, color: '#E94057', fontWeight: '700', backgroundColor: '#FFEBF0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  listContent: { padding: 16 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 100 },
  emptyText: { marginTop: 12, fontSize: 16, color: '#999', fontWeight: '600' },
  cartCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 20, padding: 12, marginBottom: 14, position: 'relative', overflow: 'hidden', shadowColor: '#E94057', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },
  gradientBorder: { position: 'absolute', top: 0, left: 0, bottom: 0, width: 5 },
  imageWrapper: { width: 85, height: 85, borderRadius: 14, backgroundColor: '#F5F5F5', overflow: 'hidden' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  detailsContainer: { flex: 1, marginLeft: 14, justifyContent: 'space-between' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryText: { fontSize: 11, color: '#E94057', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  productName: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  productDescription: { fontSize: 12, color: '#7A869A', marginTop: 1, marginBottom: 4 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  quantityStepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 12, padding: 3 },
  stepperButton: { width: 24, height: 24, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  quantityText: { marginHorizontal: 12, fontSize: 14, fontWeight: '700', color: '#FFF', minWidth: 16, textAlign: 'center' },
  // checkoutFooter: { backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 24, paddingTop: 22, paddingBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: '#7A869A', fontWeight: '500' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  divider: { height: 1, backgroundColor: '#F0F2F5', marginVertical: 14 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  totalValue: { fontSize: 22, fontWeight: '900', color: '#E94057' },
  checkoutButton: { flexDirection: 'row', height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', width: '100%' },
  checkoutButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.3, marginRight: 6 },
  checkoutFooter: {
  backgroundColor: '#FFF',
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
  paddingHorizontal: 22,
  paddingTop: 20,
  paddingBottom: 22,
  
  // 🌟 ADD THESE TWO LINES TO FLOAT IT ABOVE THE TAB BAR:
  marginBottom: 70, // Pushes the entire checkout sheet up out of the tab bar's way
  marginHorizontal: 10, // Optional: Makes the footer float nicely to match the tabs
  borderRadius: 20, // Optional: Rounds the bottom corners to complete the float look
  
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -4 },
  shadowOpacity: 0.06,
  shadowRadius: 15,
  elevation: 10,
},

});
