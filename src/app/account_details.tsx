import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import i18n from '../utils/i18n';

export default function AccountDetailsScreen() {
  const router = useRouter();
  
  // State for the form
  const [name, setName] = useState('Taha Marham');
  const [bio, setBio] = useState('Software Engineer • Ain Diab Local');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Derive initials from the current name state
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const pickImage = async () => {
    // Ask for permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to upload a photo.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Force a square crop for the avatar
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    console.log('Saved data:', { name, bio, profileImage });
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{i18n.t('accountDetails')}</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>{i18n.t('save')}</Text>
          </TouchableOpacity>
        </View>

        {/* AVATAR PICKER */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarInitials}>{getInitials(name) || '?'}</Text>
            )}
            <View style={styles.editIconBadge}>
              <Text style={styles.editIconText}>✏️</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>{i18n.t('changePhoto')}</Text>
        </View>

        {/* FORM FIELDS */}
        <View style={styles.formSection}>
          <Text style={styles.label}>{i18n.t('name')}</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            autoCapitalize="words"
          />

          <Text style={styles.label}>{i18n.t('bio')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself"
            multiline
            maxLength={150}
          />
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 30,
  },
  cancelText: {
    fontSize: 16,
    color: '#6b7280',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  saveText: {
    fontSize: 16,
    color: '#0ea5e9',
    fontWeight: 'bold',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarInitials: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2,
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editIconText: {
    fontSize: 16,
  },
  changePhotoText: {
    fontSize: 14,
    color: '#0ea5e9',
    fontWeight: '600',
  },
  formSection: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    marginBottom: 24,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
});