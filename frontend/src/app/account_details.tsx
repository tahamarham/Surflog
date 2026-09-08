import { userService } from '@/services/userService';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountDetailsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  // Your test UUID
  const MY_USER_ID = "0e9c39d8-14b3-4397-8a85-758adf7aa4bd";

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [language, setLanguage] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await userService.getUserProfile(MY_USER_ID);
        setName(data.name || '');
        setBio(data.bio || '');
        setLanguage(data.preferredLanguage || 'en');
        setProfileImage(data.profileImageUrl || null); 
      } catch (error) {
        Alert.alert("Error", "Could not load data.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission needed", "You need to allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await userService.saveUserProfile({
        id: MY_USER_ID, 
        name: name,
        bio: bio,
        preferredLanguage: language,
        profileImageUrl: profileImage
      });
      
      Alert.alert("Success", "Profile updated successfully!");
      router.back(); 
      
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator size="small" color="#0ea5e9" />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        
        {/* DEDICATED PROFILE PICTURE SECTION */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionLabel}>Profile Picture</Text>
          
          <View style={styles.imageRow}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>No Image</Text>
              </View>
            )}

            <View style={styles.imageActions}>
              <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
                <Text style={styles.changeText}>
                  {profileImage ? 'Change Picture' : 'Add Picture'}
                </Text>
              </TouchableOpacity>

              {profileImage && (
                <TouchableOpacity style={styles.actionButton} onPress={() => setProfileImage(null)}>
                  <Text style={styles.removeText}>Remove Picture</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <Text style={styles.label}>Name</Text>
        <TextInput 
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput 
          style={[styles.input, styles.textArea]}
          value={bio}
          onChangeText={setBio}
          placeholder="Tell us about your surfing..."
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Language Code</Text>
        <TextInput 
          style={styles.input}
          value={language}
          onChangeText={setLanguage}
          placeholder="e.g., en, fr"
          autoCapitalize="none"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  cancelText: { fontSize: 16, color: '#6b7280' },
  saveText: { fontSize: 16, color: '#0ea5e9', fontWeight: 'bold' },
  formContainer: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  
  // New Image Section Styles
  imageSection: { marginBottom: 24, marginTop: 10 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 12 },
  imageRow: { flexDirection: 'row', alignItems: 'center' },
  profileImage: { width: 80, height: 80, borderRadius: 40, borderWidth: 1, borderColor: '#e5e7eb' },
  imagePlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  imagePlaceholderText: { color: '#9ca3af', fontSize: 12, fontWeight: '500' },
  imageActions: { marginLeft: 20, justifyContent: 'center' },
  actionButton: { paddingVertical: 8 },
  changeText: { color: '#0ea5e9', fontSize: 16, fontWeight: '600' },
  removeText: { color: '#ef4444', fontSize: 16, fontWeight: '600' },
});