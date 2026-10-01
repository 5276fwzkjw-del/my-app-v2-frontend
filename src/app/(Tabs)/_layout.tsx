import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { CartProvider, useCart } from '../../context/authContext'; // Ensure this matches your context path

function TabBarIconLayout({ name, focused, label }: { name: any; focused: boolean; label: string }) {
  return (
    <View style={styles.iconContainer}>
      <Ionicons 
        name={name} 
        size={22} 
        color={focused ? '#E94057' : '#7A869A'} 
        style={focused ? styles.activeIconAnimation : null}
      />
      <Text style={[styles.tabLabel, { color: focused ? '#E94057' : '#7A869A', fontWeight: focused ? '700' : '500' }]}>
        {label}
      </Text>
      {focused && <View style={styles.activeIndicatorLine} />}
    </View>
  );
}

export default function TabLayout() {
  return (
    // Safely wrapping the Navigator container from the absolute outside!
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false, // Hides native labels so we can use our unified custom rows
          tabBarActiveTintColor: '#E94057',
          tabBarInactiveTintColor: '#7A869A',
          tabBarStyle: styles.tabBarFloatingCard,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIconLayout 
                name={focused ? 'home' : 'home-outline'} 
                focused={focused} 
                label="Home" 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            tabBarIcon: ({ focused }) => {
              const { totalItems } = useCart(); // Read the live badge total right here!
              return (
                <View style={{ position: 'relative' }}>
                  <TabBarIconLayout 
                    name={focused ? 'cart' : 'cart-outline'} 
                    focused={focused} 
                    label="Cart" 
                  />
                  {totalItems > 0 && (
                    <View style={styles.badgeContainer}>
                      <Text style={styles.badgeText}>{totalItems}</Text>
                    </View>
                  )}
                </View>
              );
            },
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIconLayout 
                name={focused ? 'person' : 'person-outline'} 
                focused={focused} 
                label="Profile" 
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  // The Floating Bottom Nav Menu Shell
  tabBarFloatingCard: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 14,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 68,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderTopWidth: 0, // Gets rid of that old default gray hairline line split
    paddingBottom: 0,  // Flattens padding for custom alignment rows
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: Platform.OS === 'ios' ? 12 : 0,
    height: '100%',
    width:60,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  // Small subtle indicator bar under the active button icon
  activeIndicatorLine: {
    width: 14,
    height: 3,
    backgroundColor: '#E94057',
    borderRadius: 2,
    marginTop: 4,
  },
  activeIconAnimation: {
    transform: [{ scale: 1.05 }],
  },
  // Live Cart Badge Counter
  badgeContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 6 : -4,
    right: 4,
    backgroundColor: '#E94057',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
  },
});
