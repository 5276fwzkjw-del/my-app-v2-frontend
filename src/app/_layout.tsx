import { Stack } from "expo-router";
import { useSession,AuthProvider, CartProvider } from "@/context/authContext";
import { GetUserProvider } from "@/context/userContext";
function RootNavigator() {
  const {session} = useSession();
  return(
    <Stack>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(Tabs)" options={{headerShown:false}}/>
        
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="signup" options={{headerShown:false}} />
        <Stack.Screen name='login' options={{headerShown:false}}/>
      </Stack.Protected>
    </Stack>
  )
};
export default function RootLayout(){
  return(
    <AuthProvider>
      <GetUserProvider>
        <CartProvider>
          <RootNavigator/>
        </CartProvider>
      </GetUserProvider>
    
    </AuthProvider>
  )
}
