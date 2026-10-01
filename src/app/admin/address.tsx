import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, SafeAreaView, ActivityIndicator, Alert, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { useUser } from '../../context/userContext'; 
import { Stack, useRouter } from 'expo-router';
import { apiRequest, handleApiError } from '@/lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ShippingAddressesScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newAddress, setNewAddress] = useState({
    title: '',
    fullName: '',
    phone: '',
    streetAddress: '',
    city:'',
    country:'',
    isDefault: false
  });
  const fetchAddresses = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const data = await apiRequest(`/api/getShipment`,{
            method:'GET',
            headers:{
                authorization:`Bearer ${token}`
            }
        });
        setAddresses(data.address || data || []);
    } catch (error) {
        handleApiError(error);
    }finally {
    setLoading(false);
    }
    };
     useEffect(() => {
        if (user) fetchAddresses();
        setLoading(false)
    }, [user]);

  const handleSetDefault = async(id:string) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const data = await apiRequest(`/api/isDefault`,{
            method:'PUT',
            headers:{
                'Content-type':'application/json',
                authorization:`Bearer ${token}`
            },
            body:JSON.stringify({
                id:id
            })
        });
        Alert.alert("Success",data.message);
        await fetchAddresses();
    } catch (error) {
        handleApiError(error)
    }
  };

  const handleAddAddress = async() => {
    if (!newAddress.title || !newAddress.fullName || !newAddress.streetAddress) {
      Alert.alert("Missing Fields", "Please populate all destination items.");
      return;
    }
    const token = await AsyncStorage.getItem('token');
    try {
        const data = await apiRequest(`/api/shippingAdd`,{
            method:'POST',
            headers:{
                'Content-type':'application/json',
                authorization:`Bearer ${token}`
            },
            body:JSON.stringify({
                title:newAddress.title,
                fullName:newAddress.fullName,
                phone:newAddress.phone,
                streetAddress:newAddress.streetAddress,
                city:newAddress.city,
                country:newAddress.country
            }),
        });
        Alert.alert("Success", `${data.message}`);
        setShowAddForm(false);
        await fetchAddresses()
    } catch (error) {
        handleApiError(error)
    }
  };

  const handleDeleteAddress = (id: string) => {
    Alert.alert("Remove Address", "Are you sure you want to drop this destination location?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async()=>{
        const token = await AsyncStorage.getItem('token');
        try {
            const data = await apiRequest(`/api/deleteAdd`,{
                method:'DELETE',
                headers:{
                    'Content-type':'application/json',
                    authorization:`Bearer ${token}`
                },
                body:JSON.stringify({id:id})
            });
            Alert.alert('Success',data.message);
            await fetchAddresses();
        } catch (error) {
            handleApiError(error)
        }
      } }
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#E94057" />
        <Text style={styles.loadingText}>Loading locations...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
    <Stack.Screen options={{headerShown:false}} />
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </Pressable>
        <View style={styles.headerTextWrapper}>
          <Text style={styles.headerTitle}>Shipping Addresses</Text>
          <Text style={styles.headerSubtitle}>Manage your destination points</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Saved Delivery Points</Text>

        <FlatList
          data={addresses}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <MotiView 
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={styles.emptyContainer}
                >
                <View style={styles.emptyIconCircle}>
                    <Ionicons name="location-outline" size={32} color="#7A869A" />
                </View>
                <Text style={styles.emptyHeadingText}>No Delivery Points Found</Text>
                <Text style={styles.emptySubtitleText}>You haven't saved any shipping addresses to your profile ledger yet.</Text>
            </MotiView>
            )}
        renderItem={({ item, index }) => (
            <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: index * 50 }} style={[styles.addressCard, item.isDefault && styles.activeBorder]}>
              <View style={styles.cardHeader}>
                <View style={styles.rowCentered}>
                  <Ionicons name={item.title.toLowerCase().includes('home') ? "home" : "business"} size={16} color="#E94057" />
                  <Text style={styles.cardTitleText}>{item.title}</Text>
                  {item.isDefault && <View style={styles.defaultLabel}><Text style={styles.defaultLabelText}>DEFAULT</Text></View>}
                </View>
                <Pressable onPress={() => handleDeleteAddress(item.id)} hitSlop={10}>
                  <Ionicons name="trash-outline" size={16} color="#7A869A" />
                </Pressable>
              </View>

              <Text style={styles.recipientText}>{item.full_name} • {item.phone}</Text>
              <Text style={styles.addressLineText}>{item.address}</Text>
              <Text style={styles.addressLineText}>{item.city}</Text>
              <Text style={styles.addressLineText}>{item.country}</Text>

              {!item.isDefault && (
                <Pressable style={styles.setFlagBtn} onPress={() => handleSetDefault(item.id)}>
                  <Text style={styles.setFlagText}>Set as default destination</Text>
                </Pressable>
              )}
            </MotiView>
          )}
        />

        <Pressable style={styles.toggleFormBarBtn} onPress={() => setShowAddForm(!showAddForm)}>
          <Ionicons name={showAddForm ? "close-circle-outline" : "add-circle-outline"} size={22} color="#E94057" />
          <Text style={styles.toggleFormBtnText}>{showAddForm ? "Hide Address Inputs" : "Add New Shipping Address"}</Text>
        </Pressable>

        <AnimatePresence>
          {showAddForm && (
            <MotiView from={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={styles.formContainerCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Location Label Title</Text>
                <TextInput style={styles.input} placeholder="e.g., Home base, Office space" value={newAddress.title} onChangeText={(txt) => setNewAddress({...newAddress, title: txt})}/>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Recipient Full Name</Text>
                <TextInput style={styles.input} placeholder="Ibrahim Ssekyanzi" value={newAddress.fullName} onChangeText={(txt) => setNewAddress({...newAddress, fullName: txt})}/>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contact Phone Number</Text>
                <TextInput style={styles.input} placeholder="+966 50 000 0000" keyboardType="phone-pad" value={newAddress.phone} onChangeText={(txt) => setNewAddress({...newAddress, phone: txt})}/>
              </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Street Address & Apt Number</Text>
                    <TextInput style={styles.input} placeholder="Olaya Street, Building 14" value={newAddress.streetAddress} onChangeText={(txt) => setNewAddress({...newAddress, streetAddress: txt})}/>
                </View>
                 <View style={styles.inputGroup}>
                    <Text style={styles.label}>City</Text>
                    <TextInput style={styles.input} placeholder="Riyadh" value={newAddress.city} onChangeText={(txt) => setNewAddress({...newAddress, city: txt})}/>
                </View>
                 <View style={styles.inputGroup}>
                    <Text style={styles.label}>Country</Text>
                    <TextInput style={styles.input} placeholder="Saudi-Arabia" value={newAddress.country} onChangeText={(txt) => setNewAddress({...newAddress, country: txt})}/>
                </View>
              <Pressable style={[styles.rowCentered, { marginBottom: 16 }]} onPress={() => setNewAddress({...newAddress, isDefault: !newAddress.isDefault})}>
                <Ionicons name={newAddress.isDefault ? "checkbox" : "square-outline"} size={20} color="#E94057" />
                <Text style={styles.checkboxLabelText}>Set as primary default choice</Text>
              </Pressable>
              <Pressable onPress={handleAddAddress}>
                <LinearGradient colors={['#8A2387', '#E94057', '#F27121']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveGradientBtn}>
                  <Text style={styles.saveBtnText}>Commit Location Node</Text>
                </LinearGradient>
              </Pressable>
            </MotiView>
          )}
        </AnimatePresence>
      </ScrollView>
    </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  centerContainer: { flex: 1, backgroundColor: '#F8F9FB', alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#7A869A', fontWeight: '600' },
  scrollContent: { paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: Platform.OS === 'ios' ? 10 : 20, marginBottom: 14 },
  backBtn: { width: 40, height: 40, backgroundColor: '#FFF', borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F0F2F5' },
  headerTextWrapper: { marginLeft: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 13, color: '#7A869A', fontWeight: '500', marginTop: 2 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#7A869A', textTransform: 'uppercase', letterSpacing: 0.6, marginHorizontal: 20, marginBottom: 14, marginTop: 12 },
  addressCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginHorizontal: 20, marginBottom: 12, borderWidth: 1, borderColor: '#F0F2F5' },
  activeBorder: { borderColor: '#E94057', backgroundColor: '#FFFBFB' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  rowCentered: { flexDirection: 'row', alignItems: 'center' },
  cardTitleText: { marginLeft: 8, fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  defaultLabel: { backgroundColor: '#FFEBF0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 8 },
  defaultLabelText: { color: '#E94057', fontSize: 9, fontWeight: '800' },
  recipientText: { fontSize: 13, fontWeight: '600', color: '#4A5568', marginVertical: 2 },
  addressLineText: { fontSize: 13, color: '#7A869A', lineHeight: 18, marginBottom: 4 },
  setFlagBtn: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F0F2F5' },
  setFlagText: { color: '#E94057', fontSize: 12, fontWeight: '700' },
  toggleFormBarBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: 20, marginTop: 16, height: 52, borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: '#F0F2F5' },
  toggleFormBtnText: { marginLeft: 10, fontSize: 14, fontWeight: '700', color: '#E94057' },
  formContainerCard: { backgroundColor: '#FFF', marginHorizontal: 20, marginTop: 16, borderRadius: 24, padding: 18, borderWidth: 1, borderColor: '#F0F2F5', overflow: 'hidden' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '700', color: '#7A869A', marginBottom: 6, textTransform: 'uppercase' },
  input: { backgroundColor: '#F8F9FB', height: 48, borderRadius: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 14, color: '#1A1A1A', fontWeight: '500' },
  checkboxLabelText: { marginLeft: 8, fontSize: 13, color: '#4A5568', fontWeight: '600' },
  saveGradientBtn: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  emptyContainer: {
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FFF',
  borderRadius: 24,
  paddingVertical: 40,
  paddingHorizontal: 24,
  marginHorizontal: 20,
  marginTop: 10,
  borderWidth: 1,
  borderColor: '#F0F2F5',
  borderStyle: 'dashed',
},
emptyIconCircle: {
  width: 64,
  height: 64,
  borderRadius: 32,
  backgroundColor: '#F8F9FB',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 16,
},
emptyHeadingText: {
  fontSize: 16,
  fontWeight: '700',
  color: '#1A1A1A',
  marginBottom: 6,
},
emptySubtitleText: {
  fontSize: 13,
  color: '#7A869A',
  textAlign: 'center',
  lineHeight: 18,
  fontWeight: '500',
},

});

