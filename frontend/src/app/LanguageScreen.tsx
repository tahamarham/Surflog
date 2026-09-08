import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next'; // <-- The global hook
import { userService } from '@/services/userService';

export default function LanguageScreen() {
  const router = useRouter();
  
  // Destructure t (translator) and i18n (the global engine)
  const { t, i18n } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);

  // Your UUID
  const MY_USER_ID = "0e9c39d8-14b3-4397-8a85-758adf7aa4bd";

  // The languages matching your JSON dictionary files
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
  ];

  const handleLanguageChange = async (code: string) => {
    // If it's already the selected language, do nothing
    if (i18n.language === code || isSaving) return;

    setIsSaving(true);
    try {
      // 1. Change the app language instantly across ALL screens
      await i18n.changeLanguage(code);

      // 2. Fetch your existing data so we don't accidentally erase your name/bio
      const currentUser = await userService.getUserProfile(MY_USER_ID);

      // 3. Save the new preference to your Java PostgreSQL database
      await userService.saveUserProfile({
        id: MY_USER_ID,
        name: currentUser.name,
        bio: currentUser.bio,
        preferredLanguage: code,
        profileImageUrl: currentUser.profileImageUrl
      });

    } catch (error) {
      console.error(error);
      Alert.alert(t('common.error'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} disabled={isSaving}>
          <Text style={styles.backText}>← {t('common.cancel')}</Text>
        </TouchableOpacity>
        
        {/* Use the nested translation key for the title */}
        <Text style={styles.headerTitle}>{t('profile.language')}</Text>
        
        <View style={{ width: 50 }}>
          {isSaving && <ActivityIndicator size="small" color="#0ea5e9" />}
        </View>
      </View>

      <View style={styles.container}>
        {languages.map((lang) => {
          // Check if this is the globally active language
          const isActive = i18n.language === lang.code;

          return (
            <TouchableOpacity 
              key={lang.code}
              style={[styles.languageRow, isActive && styles.languageRowActive]}
              onPress={() => handleLanguageChange(lang.code)}
              disabled={isSaving}
            >
              <Text style={[styles.languageLabel, isActive && styles.languageLabelActive]}>
                {lang.label}
              </Text>
              {isActive && <Text style={styles.checkIcon}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backText: {
    fontSize: 16,
    color: '#0ea5e9',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  container: {
    padding: 24,
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  languageRowActive: {
    borderColor: '#0ea5e9',
    backgroundColor: '#f0f9ff',
  },
  languageLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  languageLabelActive: {
    color: '#0ea5e9',
    fontWeight: 'bold',
  },
  checkIcon: {
    fontSize: 18,
    color: '#0ea5e9',
    fontWeight: 'bold',
  },
});