import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import i18n from '../utils/i18n';

export default function LanguageScreen() {
  const router = useRouter();
  
  // Track the locally selected language
  const [currentLocale, setCurrentLocale] = useState(i18n.locale);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' },
    { code: 'it', label: 'Italiano' },
  ];

  const changeLanguage = (code: string) => {
    i18n.locale = code;
    setCurrentLocale(code);
    // Note: In a production app, you would save this choice to AsyncStorage here
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{i18n.t('language')}</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.container}>
        {languages.map((lang) => (
          <TouchableOpacity 
            key={lang.code}
            style={[
              styles.languageRow, 
              currentLocale === lang.code && styles.languageRowActive
            ]}
            onPress={() => changeLanguage(lang.code)}
          >
            <Text style={[
              styles.languageLabel,
              currentLocale === lang.code && styles.languageLabelActive
            ]}>
              {lang.label}
            </Text>
            {currentLocale === lang.code && <Text style={styles.checkIcon}>✓</Text>}
          </TouchableOpacity>
        ))}
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