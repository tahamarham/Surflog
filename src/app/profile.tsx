import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  // Mock User Data
  const user = {
    name: 'Taha Marham',
    bio: 'Software Engineer • Ain Diab Local',
    initials: 'TM',
    memberSince: '2026',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* USER INFO SECTION */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user.initials}</Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userBio}>{user.bio}</Text>
          <Text style={styles.memberDate}>Surfing with us since {user.memberSince}</Text>
        </View>

        {/* SETTINGS GROUPS */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.settingsGroup}>
          <TouchableOpacity style={styles.settingsRow} onPress={() => router.push('/account_details')}>
            <View style={styles.settingsLeft}>
              <Text style={styles.settingsIcon}>👤</Text>
              <Text style={styles.settingsText}>Account Details</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsRow}>
            <View style={styles.settingsLeft}>
              <Text style={styles.settingsIcon}>🔔</Text>
              <Text style={styles.settingsText}>Notifications</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingsRow, styles.lastRow]} onPress={() => router.push('/language')}>
            <View style={styles.settingsLeft}>
              <Text style={styles.settingsIcon}>🌍</Text>
              <Text style={styles.settingsText}>Language</Text>
              
            </View>
            <Text style={styles.settingsValue}>English</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>App</Text>
        
        <View style={styles.settingsGroup}>
          <TouchableOpacity style={styles.settingsRow}>
            <View style={styles.settingsLeft}>
              <Text style={styles.settingsIcon}>📏</Text>
              <Text style={styles.settingsText}>Units</Text>
            </View>
            <Text style={styles.settingsValue}>Metric (ft / °C)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingsRow, styles.lastRow]}>
            <View style={styles.settingsLeft}>
              <Text style={styles.settingsIcon}>🎨</Text>
              <Text style={styles.settingsText}>Theme</Text>
            </View>
            <Text style={styles.settingsValue}>Light</Text>
          </TouchableOpacity>
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => {
            // For now, just route back to the index/auth screen
            router.replace('/');
          }}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  backButton: {
    paddingVertical: 8,
    width: 60,
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
  editButton: {
    paddingVertical: 8,
    width: 60,
    alignItems: 'flex-end',
  },
  editText: {
    fontSize: 16,
    color: '#0ea5e9',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  userBio: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 8,
  },
  memberDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  settingsGroup: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    paddingHorizontal: 16,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingsText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  settingsValue: {
    fontSize: 16,
    color: '#6b7280',
  },
  chevron: {
    fontSize: 24,
    color: '#9ca3af',
    marginTop: -4,
  },
  logoutButton: {
    backgroundColor: '#fee2e2', // Light red
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: '#ef4444', // Red
    fontSize: 16,
    fontWeight: 'bold',
  },
});