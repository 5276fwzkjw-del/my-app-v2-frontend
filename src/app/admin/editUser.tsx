import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, SafeAreaView, ActivityIndicator, Alert, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useUser } from '../../context/userContext'; 
import { useRouter } from 'expo-router';
import {Stack }from 'expo-router';
import { apiRequest, handleApiError } from '@/lib/api';
export default function EditProfileScreen() {
  const { user, getUser } = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.user?.name || '',
    phone: user?.user?.phone || '',
    email: user?.user?.email || '',
  });
  useEffect(() => {
    if (user?.user) {
      setForm({
        name: user.user.name || '',
        phone: user.user.phone || '',
        email: user.user.email || ''
      });
    }
  }, [user]);
  const handleUpdateProfile = async () => {
    if(!form.name || !form.phone){
        Alert.alert("All fields are required");
        return;
    }
    setLoading(true);
    try {
      const token = await require('@react-native-async-storage/async-storage').default.getItem('token');

      const data= await apiRequest(`/api/updateUser`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone
        })
      });
      await getUser();
      Alert.alert("Success 🎉", "Profile information saved successfully.", [
        { text: "Awesome", onPress: () => router.back() }
        ]);
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Stack.Screen options={{headerShown:false}}/>
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </Pressable>
        <View style={styles.headerTextWrapper}>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <Text style={styles.headerSubtitle}>Update your personal account credentials</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} style={styles.formCard}>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Ibrahim Ssekyanzi" 
              value={form.name}
              onChangeText={(txt) => setForm({...form, name: txt})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. +966 50 000 0000" 
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(txt) => setForm({...form, phone: txt})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address (Read-Only)</Text>
            <TextInput 
              style={[styles.input, styles.disabledInput]} 
              value={user.email}
              editable={false}
              selectTextOnFocus={false}
            />
          </View>

          <Pressable style={styles.btnSpacer} onPress={handleUpdateProfile} disabled={loading}>
            <LinearGradient colors={['#8A2387', '#E94057', '#F27121']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveGradientBtn}>
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </>
              )}
            </LinearGradient>
          </Pressable>

        </MotiView>
      </ScrollView>
    </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: Platform.OS === 'ios' ? 10 : 20, marginBottom: 14 },
  backBtn: { width: 40, height: 40, backgroundColor: '#FFF', borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F0F2F5' },
  headerTextWrapper: { marginLeft: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 13, color: '#7A869A', fontWeight: '500', marginTop: 2 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  formCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F0F2F5', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.01, shadowRadius: 10, elevation: 1 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 11, fontWeight: '700', color: '#7A869A', marginBottom: 6, textTransform: 'uppercase' },
  input: { backgroundColor: '#F8F9FB', height: 48, borderRadius: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 14, color: '#1A1A1A', fontWeight: '500' },
  disabledInput: { backgroundColor: '#ECEFF1', color: '#90A4AE', borderColor: '#CFD8DC' },
  btnSpacer: { marginTop: 8 },
  saveGradientBtn: { height: 52, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' }
});

