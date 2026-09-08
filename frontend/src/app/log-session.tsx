import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LogSessionScreen() {
  const router = useRouter();
  
  // Form State
  const [sessionRating, setSessionRating] = useState<string | null>(null);
  const [conditionIndex, setConditionIndex] = useState<number>(2);
  const [thoughts, setThoughts] = useState('');
  
  // Autocomplete Search State
  const [spot, setSpot] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const conditionLevels = ['Bad', 'Mid', 'Good', 'Great'];

  // Triggered every time the user types in the input
  const handleSearch = async (text: string) => {
    setSpot(text);

    // Only search if the user has typed at least 3 characters
    if (text.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Call the free OpenStreetMap search API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=jsonv2&addressdetails=1&limit=5`,
        {
          headers: { 'User-Agent': 'SurfLogApp/1.0' },
        }
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Triggered when a user taps a result from the dropdown
  const selectLocation = (locationData: any) => {
    // Grab the short name (e.g., "Aïn Diab Plage") instead of the massive full address
    const shortName = locationData.name || locationData.display_name.split(',')[0];
    setSpot(shortName);
    setSearchResults([]); // Hide the dropdown
    Keyboard.dismiss();   // Close the keyboard
  };

  const handleSave = () => {
    const sessionData = {
      rating: sessionRating,
      condition: conditionLevels[conditionIndex],
      spot,
      thoughts,
      date: new Date().toISOString(),
    };
    console.log('Saving Session:', sessionData);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // Allows tapping dropdown items without just closing the keyboard
        >
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Session</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* QUESTION 1: How was the session? */}
          <View style={styles.section}>
            <Text style={styles.questionText}>How was the session?</Text>
            <View style={styles.facesContainer}>
              <TouchableOpacity 
                style={[styles.faceButton, sessionRating === 'sad' && styles.faceActive]}
                onPress={() => setSessionRating('sad')}
              >
                <Text style={styles.emoji}>😞</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.faceButton, sessionRating === 'neutral' && styles.faceActive]}
                onPress={() => setSessionRating('neutral')}
              >
                <Text style={styles.emoji}>😐</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.faceButton, sessionRating === 'happy' && styles.faceActive]}
                onPress={() => setSessionRating('happy')}
              >
                <Text style={styles.emoji}>🤩</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* QUESTION 2: How were the conditions? */}
          <View style={styles.section}>
            <Text style={styles.questionText}>How were the conditions?</Text>
            <View style={styles.sliderContainer}>
              <View style={styles.sliderTrack} />
              <View style={[
                styles.sliderActiveTrack, 
                { width: `${(conditionIndex / (conditionLevels.length - 1)) * 100}%` }
              ]} />
              <View style={styles.sliderStopsContainer}>
                {conditionLevels.map((level, index) => (
                  <TouchableOpacity 
                    key={level} 
                    style={styles.sliderStop}
                    onPress={() => setConditionIndex(index)}
                  >
                    <View style={[styles.stopDot, index <= conditionIndex ? styles.stopDotActive : null]} />
                    <Text style={[styles.stopLabel, index <= conditionIndex ? styles.stopLabelActive : null]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* QUESTION 3: Where did you surf? (AUTOCOMPLETE SEARCH) */}
          <View style={[styles.section, { zIndex: 10 }]}>
            <Text style={styles.questionText}>Where did you surf?</Text>
            
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for a spot..."
                value={spot}
                onChangeText={handleSearch}
                autoCapitalize="words"
              />
            </View>

            {/* FLOATING DROPDOWN LIST */}
            {(isSearching || searchResults.length > 0) && (
              <View style={styles.dropdownContainer}>
                {isSearching ? (
                  <ActivityIndicator size="small" color="#0ea5e9" style={styles.loader} />
                ) : (
                  searchResults.map((result) => (
                    <TouchableOpacity 
                      key={result.place_id} 
                      style={styles.dropdownItem}
                      onPress={() => selectLocation(result)}
                    >
                      <Text style={styles.dropdownItemName}>
                        {result.name || result.display_name.split(',')[0]}
                      </Text>
                      <Text style={styles.dropdownItemAddress} numberOfLines={1}>
                        {result.display_name}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}
          </View>

          {/* QUESTION 4: Thoughts about the session */}
          {/* We lower the zIndex here so the dropdown from above overlaps this input */}
          <View style={[styles.section, { zIndex: 1 }]}>
            <Text style={styles.questionText}>Thoughts about the session</Text>
            <Text style={styles.subQuestionText}>
              What do you need to work on? What made you happy today?
            </Text>
            <TextInput
              style={styles.textArea}
              placeholder="Write your session notes here..."
              value={thoughts}
              onChangeText={setThoughts}
              multiline={true}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1 },
  scrollContainer: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 },
  cancelText: { fontSize: 16, color: '#6b7280', fontWeight: '500' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  saveText: { fontSize: 16, color: '#0ea5e9', fontWeight: 'bold' },
  section: { marginBottom: 32 },
  questionText: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 16 },
  subQuestionText: { fontSize: 14, color: '#6b7280', marginBottom: 12, marginTop: -10 },
  facesContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  faceButton: { flex: 1, alignItems: 'center', paddingVertical: 16, marginHorizontal: 4, borderRadius: 16, backgroundColor: '#f3f4f6', borderWidth: 2, borderColor: 'transparent' },
  faceActive: { backgroundColor: '#e0f2fe', borderColor: '#0ea5e9' },
  emoji: { fontSize: 42 },
  
  sliderContainer: { paddingTop: 10, paddingBottom: 20, position: 'relative' },
  sliderTrack: { position: 'absolute', top: 22, left: 20, right: 20, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2 },
  sliderActiveTrack: { position: 'absolute', top: 22, left: 20, height: 4, backgroundColor: '#0ea5e9', borderRadius: 2, zIndex: 1 },
  sliderStopsContainer: { flexDirection: 'row', justifyContent: 'space-between', zIndex: 2 },
  sliderStop: { alignItems: 'center', width: 50 },
  stopDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#ffffff', borderWidth: 4, borderColor: '#e5e7eb', marginBottom: 8 },
  stopDotActive: { borderColor: '#0ea5e9' },
  stopLabel: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  stopLabelActive: { color: '#0ea5e9', fontWeight: 'bold' },
  
  // -- AUTOCOMPLETE STYLES --
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 85, // Positions it right under the input field
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  loader: {
    padding: 16,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  dropdownItemAddress: {
    fontSize: 12,
    color: '#6b7280',
  },

  textArea: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, fontSize: 16, color: '#111827', minHeight: 120, textAlignVertical: 'top' },
});