import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest, handleApiError } from '@/lib/api';
import { router, Stack } from 'expo-router';
export default function AdminUploadScreen() {
  const [message,setError]=useState<any>();
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '', // Default pick
    description: '',
    inventory_count: '10'
  });

  const handleUpload = async() => {
    const token = await AsyncStorage.getItem('token');
    if (!form.name || !form.price || !form.description) {
      Alert.alert("Missing Fields", "Please complete all fields before saving.");
      return;
    }
    try {
      const data = await apiRequest(`/api/createProduct`,{
        method:'POST',
        headers:{
          'Content-type':'application/json',
          authorization:`Bearer ${token}`
        },
        body:JSON.stringify(form)
      });
      setError(data.message);
      setForm({
        name: '',
        price: '',
        category: '',
        description: '',
        inventory_count: ''
      });

    } catch (error:any) {
      handleApiError(error)
    }
  
  };

  return (
    <>
    <Stack.Screen options={{headerShown:false}}/>
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {message? (<Text style={styles.label}>{message}</Text>): <View>
          
          <Text style={styles.title}>
             <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
          </Pressable>
            Upload Product
            </Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g., AeroStride Blitz" 
            value={form.name}
            onChangeText={(txt) => setForm({...form, name: txt})}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
            <Text style={styles.label}>Price ($)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="89.99" 
              keyboardType="numeric"
              value={form.price}
              onChangeText={(txt) => setForm({...form, price: txt})}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Stock Quantity</Text>
            <TextInput 
              style={styles.input} 
              placeholder="10" 
              keyboardType="numeric"
              value={form.inventory_count}
              onChangeText={(txt) => setForm({...form, inventory_count: txt})}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Footwear" 
            value={form.category}
            onChangeText={(txt) => setForm({...form, category: txt})}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Detailed Description</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Describe the product specifications..." 
            multiline
            numberOfLines={4}
            value={form.description}
            onChangeText={(txt) => setForm({...form, description: txt})}
          />
        </View>

        <Pressable onPress={handleUpload} style={styles.btnWrapper}>
          <LinearGradient
            colors={['#8A2387', '#E94057', '#F27121']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.uploadButton}
          >
            <Ionicons name="cloud-upload-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.uploadBtnText}>Publish to Store</Text>
          </LinearGradient>
        </Pressable></View>}
      </ScrollView>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  scrollContent: { padding: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', marginBottom: 24 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#7A869A', marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#FFF', height: 50, borderRadius: 14, paddingHorizontal: 16, borderWidth: 1, borderColor: '#F0F2F5', fontSize: 15, color: '#1A1A1A', fontWeight: '500' },
  row: { flexDirection: 'row' },
  textArea: { height: 100, paddingTop: 14, paddingBottom: 14 },
  btnWrapper: { marginTop: 12 },
  uploadButton: { height: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  uploadBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  backBtn: { width: 40, height: 40, backgroundColor: '#FFF', borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F0F2F5' },
});
