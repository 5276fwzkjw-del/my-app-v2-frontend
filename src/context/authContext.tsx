import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as Haptics from "expo-haptics";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest, handleApiError } from "@/lib/api";
type AuthContextType = {
  session: string | null;
  signIn: (token: string) => void;
  signOut: () => void;
};
const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const signIn = async (token: string) => {
    setSession(token);
    await AsyncStorage.setItem("token", token);
  };
  const signOut = async () => {
    await AsyncStorage.removeItem("token");
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useSession() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSession must be used inside AuthProvider");
  }
  return context;
}
const CartContext = createContext<any>(null);
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const getCart = useCallback(async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      if (!token) {
        throw new Error("sorry no token");
      }
      const data = await apiRequest(`/api/getCart`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );
      setCart(data.cart);
    } catch (error) {
      handleApiError(error);
    }
  }, []);
  const addItem = async (product: any) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      const token = await AsyncStorage.getItem("token");
      const data = await apiRequest(`/api/addToCart`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product.id }),
        },
      );
      Alert.alert("Item Added");
    } catch (error) {
      handleApiError(error);
    }
    // setCart((prev: any) => {
    //   const productId = product.id || product._id || product.key;

    //   if (!productId) {
    //     console.warn(
    //       "CRITICAL: Added a product that completely lacks a unique identifier ID key!",
    //       product,
    //     );return prev;
    //   }

    //   const itemExist = prev.find((item: any) => {
    //     const existingId = item.id || item._id || item.key;
    //     return existingId === productId;
    //   });
    //   if (!itemExist) {
    //     const safeProductPacket = {
    //       id: productId,
    //       name: product.name || product.title || "Unnamed Product",
    //       category: product.category || "General",
    //       description:product.description,
    //       price:
    //         typeof product.price === "number"
    //           ? product.price
    //           : parseFloat(product.price) || 0,
    //       qty: 1,
    //     };
    //     return [...prev, safeProductPacket];
    //   } else {
    //     return prev.map((item: any) => {
    //       const existingId = item.id || item._id || item.key;
    //       return existingId === productId
    //         ? { ...item, qty: item.qty + 1 }
    //         : item;
    //     });
    //   }
    // });
  };
  const removeFromCart = async(product: string) => {
     try {
      const token = await AsyncStorage.getItem("token");
      const data = await apiRequest(`/api/deleteItem`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product: product}),
        },
      );
      await getCart();
      Alert.alert("Item Deleted");
    } catch (error) {
      handleApiError(error);
    }
  };
  const updateQty = async (
    product: string,
    type: "increment" | "decrement",
  ) => {
    const token = await AsyncStorage.getItem("token");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      const data = await apiRequest(`/api/updateQty`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            increase: type === "increment",
            decrease: type === "decrement",
            product,
          }),
        },
      );
      await getCart();
    } catch (error) {
      handleApiError(error);
    }
    // setCart((prev: any) =>
    //   prev
    //     .map((item: any) => {
    //       const itemId = item.id || item._id || item.key;
    //       if (itemId === product) {
    //         const newQty = type === "increment" ? item.quantity + 1 : item.quantity- 1;
    //         return { ...item, quantity: newQty };
    //       }
    //       return item;
    //     })
    //     .filter((item: any) => item.quantity > 0),
    // );
  };
  const totalItem = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        totalItem,
        removeFromCart,
        updateQty,
        setCart,
        getCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export const useCart = () => useContext(CartContext);
