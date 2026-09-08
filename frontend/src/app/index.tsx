// app/index.tsx
import { useRouter } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Get device height to ensure each page fills exactly one screen
const { height, width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScrollView 
      style={styles.container}
      pagingEnabled // This makes it snap perfectly to the next screen
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {/* PAGE 1: The Welcome Screen */}
      <View style={[styles.page, { backgroundColor: '#0ea5e9' }]}>
        <Text style={styles.header}>SurfLog</Text>
        <Text style={styles.subtext}>Swipe up to begin</Text>
      </View>

      {/* PAGE 2: The Login / Sign Up Screen */}
      <View style={[styles.page, { backgroundColor: '#ffffff' }]}>
        <Text style={[styles.header, { color: '#0ea5e9' }]}>Catch the Next Wave</Text>
        
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={styles.buttonPrimary} 
            onPress={() => router.push('/dashboard')}
          >
            <Text style={styles.buttonPrimaryText}>Log In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.buttonSecondary} 
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.buttonSecondaryText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    height: height,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 18,
    color: '#f0f9ff',
  },
  buttonGroup: {
    width: '100%',
    marginTop: 40,
    gap: 15,
    paddingHorizontal: 20,
  },
  buttonPrimary: {
    backgroundColor: '#0ea5e9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPrimaryText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  buttonSecondaryText: {
    color: '#0ea5e9',
    fontSize: 18,
    fontWeight: '600',
  },
});