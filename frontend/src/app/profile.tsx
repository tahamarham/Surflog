import { userService } from '@/services/userService';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';


// --- THEME COLOR DEFINITIONS ---
const THEMES = {
  Light: {
    bg: '#f9fafb', card: '#ffffff', text: '#111827', subText: '#6b7280', 
    border: '#f3f4f6', icon: '#374151', primary: '#0ea5e9'
  },
  Dark: {
    bg: '#111827', card: '#1f2937', text: '#f9fafb', subText: '#9ca3af', 
    border: '#374151', icon: '#d1d5db', primary: '#38bdf8'
  },
  Ocean: {
    // Very light, airy blues
    bg: '#f0f9ff', card: '#e0f2fe', text: '#0c4a6e', subText: '#0284c7', 
    border: '#bae6fd', icon: '#0369a1', primary: '#0ea5e9'
  }
};

export default function ProfileScreen() {
  const router = useRouter();

  // State for Theming
  const [activeTheme, setActiveTheme] = useState<'Light' | 'Dark' | 'Ocean'>('Light');
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
  const { t, i18n } = useTranslation();

  // Get the colors and styles for the currently selected theme
  const colors = THEMES[activeTheme];
  const styles = getDynamicStyles(colors, activeTheme); 

  const [userData, setUserData] = useState({
    name: '',
    bio: '',
    initials: '',
    memberSince: '',
    preferredLanguage: 'English',
    profileImageUrl: null as string | null
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const MY_USER_ID = "0e9c39d8-14b3-4397-8a85-758adf7aa4bd";

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchProfileData();
      return () => {};
    }, [])
  );

  const fetchProfileData = async () => {
    try {
      const data = await userService.getUserProfile(MY_USER_ID);
      const nameParts = data.name ? data.name.split(' ') : ['?', '?'];
      const initials = (nameParts[0][0] + (nameParts.length > 1 ? nameParts[1][0] : '')).toUpperCase();
      const year = data.memberSince ? data.memberSince.substring(0, 4) : '2026';

      setUserData({
        name: data.name,
        bio: data.bio,
        initials: initials,
        memberSince: year,
        preferredLanguage: data.preferredLanguage === 'en' ? 'English' : data.preferredLanguage,
        profileImageUrl: data.profileImageUrl || null
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Connection Error", "Could not connect to the backend.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* OCEAN WAVES BACKGROUND (Only visible if Ocean theme is selected) */}
      {activeTheme === 'Ocean' && (
        <View style={styles.oceanWavesContainer} pointerEvents="none">
          <View style={styles.wave1} />
          <View style={styles.wave2} />
          <View style={styles.wave3} />
        </View>
      )}

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => router.push('/account_details')}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* USER INFO */}
        <View style={styles.profileHeader}>
          {userData.profileImageUrl ? (
            <Image source={{ uri: userData.profileImageUrl }} style={styles.avatarContainer} />
          ) : (
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{userData.initials}</Text>
            </View>
          )}
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userBio}>{userData.bio}</Text>
          <Text style={styles.memberDate}>Surfing with us since {userData.memberSince}</Text>
        </View>

        {/* PREFERENCES */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingsGroup}>
          <TouchableOpacity style={styles.settingsRow} onPress={() => router.push('/account_details')}>
            <View style={styles.settingsLeft}>
              <Text style={styles.settingsIcon}>👤</Text>
              <Text style={styles.settingsText}>Account Details</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingsRow, styles.lastRow]} onPress={() => router.push('/LanguageScreen')}>
            <View style={styles.settingsLeft}>
              <Text style={styles.settingsIcon}>🌍</Text>
              <Text style={styles.settingsText}>Language</Text>
            </View>
            <Text style={styles.settingsValue}>{userData.preferredLanguage}</Text>
          </TouchableOpacity>
        </View>

        {/* APP SETTINGS */}
        <Text style={styles.sectionTitle}>App</Text>
        <View style={styles.settingsGroup}>
          <TouchableOpacity style={styles.settingsRow}>
            <View style={styles.settingsLeft}>
              <Text style={styles.settingsIcon}>📏</Text>
              <Text style={styles.settingsText}>Units</Text>
            </View>
            <Text style={styles.settingsValue}>Metric (ft / °C)</Text>
          </TouchableOpacity>

          {/* THE THEME BUTTON */}
          <TouchableOpacity style={[styles.settingsRow, styles.lastRow]} onPress={() => setIsThemeModalVisible(true)}>
            <View style={styles.settingsLeft}>
              <Text style={styles.settingsIcon}>🎨</Text>
              <Text style={styles.settingsText}>Theme</Text>
            </View>
            <Text style={styles.settingsValue}>{activeTheme}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/')}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* THEME SELECTION MODAL */}
      <Modal visible={isThemeModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Theme</Text>
            
            {['Light', 'Dark', 'Ocean'].map((theme) => (
              <TouchableOpacity 
                key={theme} 
                style={styles.modalOption}
                onPress={() => {
                  setActiveTheme(theme as any);
                  setIsThemeModalVisible(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText, 
                  activeTheme === theme && { color: colors.primary, fontWeight: 'bold' }
                ]}>
                  {theme} {activeTheme === theme && '✓'}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsThemeModalVisible(false)}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// --- DYNAMIC STYLESHEET FUNCTION ---
const getDynamicStyles = (colors: any, activeTheme: string) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 10, paddingBottom: 20, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border },
  backButton: { paddingVertical: 8, width: 60 },
  backText: { fontSize: 16, color: colors.primary, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  editButton: { paddingVertical: 8, width: 60, alignItems: 'flex-end' },
  editText: { fontSize: 16, color: colors.primary, fontWeight: '600' },
  container: { flex: 1, paddingHorizontal: 24, zIndex: 1 },
  profileHeader: { alignItems: 'center', marginTop: 32, marginBottom: 40 },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: '#ffffff', letterSpacing: 2 },
  userName: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  userBio: { fontSize: 16, color: colors.icon, fontWeight: '500', marginBottom: 8, textAlign: 'center' },
  memberDate: { fontSize: 14, color: colors.subText },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 12 },
  settingsGroup: { backgroundColor: colors.card, borderRadius: 16, marginBottom: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, paddingHorizontal: 16 },
  settingsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  lastRow: { borderBottomWidth: 0 },
  settingsLeft: { flexDirection: 'row', alignItems: 'center' },
  settingsIcon: { fontSize: 20, marginRight: 12, color: colors.icon },
  settingsText: { fontSize: 16, color: colors.text, fontWeight: '500' },
  settingsValue: { fontSize: 16, color: colors.subText },
  chevron: { fontSize: 24, color: colors.subText, marginTop: -4 },
  
  // Dynamic styling for the logout button
  logoutButton: { backgroundColor: activeTheme === 'Dark' ? '#7f1d1d' : '#fee2e2', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  logoutText: { color: activeTheme === 'Dark' ? '#fca5a5' : '#ef4444', fontSize: 16, fontWeight: 'bold' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 16, textAlign: 'center' },
  modalOption: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalOptionText: { fontSize: 18, color: colors.text, textAlign: 'center' },
  modalCloseButton: { marginTop: 16, paddingVertical: 16, backgroundColor: colors.bg, borderRadius: 12 },
  modalCloseText: { fontSize: 16, fontWeight: 'bold', color: colors.text, textAlign: 'center' },

  // Ocean Foam CSS Waves (Absolute positioned at the bottom)
  oceanWavesContainer: { position: 'absolute', bottom: -50, left: 0, right: 0, height: 150, zIndex: 0, opacity: 0.6 },
  wave1: { position: 'absolute', bottom: 20, left: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: '#ffffff' },
  wave2: { position: 'absolute', bottom: 0, left: 100, width: 250, height: 250, borderRadius: 125, backgroundColor: '#ffffff', opacity: 0.8 },
  wave3: { position: 'absolute', bottom: -20, right: -50, width: 180, height: 180, borderRadius: 90, backgroundColor: '#ffffff' }
});