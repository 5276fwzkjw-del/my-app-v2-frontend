import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, SafeAreaView, ActivityIndicator, Alert, ScrollView, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { useUser } from '../../context/userContext'; 
import { useRouter } from 'expo-router';
import {Stack} from 'expo-router';

const { width } = Dimensions.get('window');

export default function PaymentMethodsScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newCard, setNewCard] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardType: 'Visa'
  });
 useEffect(()=>
    {  if (user?.id){
    setCards([
        { id: 'c1', cardholderName: 'Ibrahim Ssekyanzi', cardNumber: '•••• •••• •••• 4321', expiryDate: '12/29', cardType: 'Visa', gradient: ['#8A2387', '#E94057'] },
        { id: 'c2', cardholderName: 'Ibrahim Ssekyanzi', cardNumber: '•••• •••• •••• 8899', expiryDate: '06/28', cardType: 'Mastercard', gradient: ['#0F2027', '#203A43'] }
      ]);
      setLoading(false);
    }},[user?.id]);

  const handleAddCard = async () => {
    if (!newCard.cardholderName || !newCard.cardNumber || !newCard.expiryDate || !newCard.cvv) {
      Alert.alert("Missing Fields", "Please populate all payment parameters.");
      return;
    }
    const mockCreatedCard = {
      id: Math.random().toString(),
      cardholderName: newCard.cardholderName,
      cardNumber: `•••• •••• •••• ${newCard.cardNumber.slice(-4)}`,
      expiryDate: newCard.expiryDate,
      cardType: newCard.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
      gradient: ['#F27121', '#E94057']
    };
    setCards([...cards, mockCreatedCard]);
    setShowAddForm(false);
    setNewCard({ cardholderName: '', cardNumber: '', expiryDate: '', cvv: '', cardType: 'Visa' });
    Alert.alert("Success", "Secure tokenized card saved to your profile.");
  };

  const handleDeleteCard = (cardId: string) => {
    Alert.alert("Remove Card", "Are you sure you want to delete this payment method?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => setCards(prev => prev.filter(c => c.id !== cardId)) }
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#E94057" />
        <Text style={styles.loadingText}>Loading payment cards...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
    <Stack.Screen options={{headerShown:false}}/>
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </Pressable>
        <View style={styles.headerTextWrapper}>
          <Text style={styles.headerTitle}>Payment Methods</Text>
          <Text style={styles.headerSubtitle}>Manage your secure tokenized wallet info</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Your Saved Digital Cards</Text>
        <View style={{ height: 195 }}>
          <FlatList
            data={cards}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.cardsSliderPadding}
            renderItem={({ item, index }) => (
              <MotiView from={{ opacity: 0, scale: 0.9, translateX: 50 }} animate={{ opacity: 1, scale: 1, translateX: 0 }} transition={{ type: 'spring', delay: index * 80 }} style={styles.creditCardContainer}>
                <LinearGradient colors={item.gradient || ['#8A2387', '#E94057']} style={styles.cardGradientWrapper}>
                  <View style={styles.cardTopRow}>
                    <Text style={styles.cardTypeBrandText}>{item.cardType}</Text>
                    <Pressable onPress={() => handleDeleteCard(item.id)} hitSlop={12}><Ionicons name="trash-outline" size={18} color="#FFF" /></Pressable>
                  </View>
                  <Text style={styles.cardNumberText}>{item.cardNumber}</Text>
                  <View style={styles.cardBottomRow}>
                    <View><Text style={styles.cardLabelField}>CARDHOLDER</Text><Text style={styles.cardHolderValueText}>{item.cardholderName}</Text></View>
                    <View style={{ alignItems: 'flex-end' }}><Text style={styles.cardLabelField}>EXPIRES</Text><Text style={styles.cardHolderValueText}>{item.expiryDate}</Text></View>
                  </View>
                </LinearGradient>
              </MotiView>
            )}
          />
        </View>

        <Pressable style={styles.toggleFormBarBtn} onPress={() => setShowAddForm(!showAddForm)}>
          <Ionicons name={showAddForm ? "close-circle-outline" : "add-circle-outline"} size={22} color="#E94057" />
          <Text style={styles.toggleFormBtnText}>{showAddForm ? "Hide Form Input Panel" : "Add New Payment Card"}</Text>
        </Pressable>

        <AnimatePresence>
          {showAddForm && (
            <MotiView from={{ opacity: 0, height: 0, scaleY: 0.9 }} animate={{ opacity: 1, height: 'auto', scaleY: 1 }} exit={{ opacity: 0, height: 0, scaleY: 0.9 }} style={styles.formContainerCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cardholder Full Name</Text>
                <TextInput style={styles.input} placeholder="e.g. Ibrahim Ssekyanzi" value={newCard.cardholderName} onChangeText={(txt) => setNewCard({...newCard, cardholderName: txt})}/>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Card Number</Text>
                <TextInput style={styles.input} placeholder="4000 1234 5678 9010" keyboardType="numeric" maxLength={16} value={newCard.cardNumber} onChangeText={(txt) => setNewCard({...newCard, cardNumber: txt})}/>
              </View>
              <View style={styles.formSplitRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}><Text style={styles.label}>Expiry MM/YY</Text><TextInput style={styles.input} placeholder="12/29" maxLength={5} value={newCard.expiryDate} onChangeText={(txt) => setNewCard({...newCard, expiryDate: txt})}/></View>
                <View style={[styles.inputGroup, { flex: 1 }]}><Text style={styles.label}>CVV</Text><TextInput style={styles.input} placeholder="321" keyboardType="numeric" secureTextEntry maxLength={3} value={newCard.cvv} onChangeText={(txt) => setNewCard({...newCard, cvv: txt})}/></View>
              </View>
              <Pressable style={styles.btnWrapperSpacer} onPress={handleAddCard}>
                <LinearGradient colors={['#8A2387', '#E94057', '#F27121']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveCardGradientBtn}>
                  <Ionicons name="shield-checkmark-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.saveBtnText}>Securely Save Card</Text>
                </LinearGradient>
              </Pressable>
            </MotiView>
          )}
        </AnimatePresence>
      </ScrollView>
    </SafeAreaView>
    </>
  );
}
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
  cardsSliderPadding: { paddingLeft: 20, paddingRight: 20, alignItems: 'center' },
  creditCardContainer: { width: 300, height: 175, marginRight: 16, borderRadius: 24, overflow: 'hidden', shadowColor: '#1A1A1A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  cardGradientWrapper: { flex: 1, padding: 20, justifyContent: 'space-between' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTypeBrandText: { color: '#FFF', fontSize: 18, fontWeight: '900', fontStyle: 'italic', letterSpacing: -0.5 },
  cardNumberText: { color: '#FFF', fontSize: 20, fontWeight: '700', letterSpacing: 2, marginVertical: 14 },
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardLabelField: { color: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  cardHolderValueText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  toggleFormBarBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: 20, marginTop: 24, height: 52, borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: '#F0F2F5' },
  toggleFormBtnText: { marginLeft: 10, fontSize: 14, fontWeight: '700', color: '#E94057' },
  formContainerCard: { backgroundColor: '#FFF', marginHorizontal: 20, marginTop: 16, borderRadius: 24, padding: 18, borderWidth: 1, borderColor: '#F0F2F5', overflow: 'hidden' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '700', color: '#7A869A', marginBottom: 6, textTransform: 'uppercase' },
  input: { backgroundColor: '#F8F9FB', height: 48, borderRadius: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 14, color: '#1A1A1A', fontWeight: '500' },
  formSplitRow: { flexDirection: 'row' },
  btnWrapperSpacer: { marginTop: 6 },
  saveCardGradientBtn: { height: 52, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' }
});
