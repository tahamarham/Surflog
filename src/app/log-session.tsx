import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';

export default function LogSessionScreen() {
  const router = useRouter();
  
  // Form State
  const [sessionRating, setSessionRating] = useState<string | null>(null);
  const [conditionIndex, setConditionIndex] = useState<number>(2); // Default to 'Good'
  const [spot, setSpot] = useState('');
  const [thoughts, setThoughts] = useState('');

  const conditionLevels = ['Bad', 'Mid', 'Good', 'Great'];

  const handleSave = () => {
    const sessionData = {
      rating: sessionRating,
      condition: conditionLevels[conditionIndex],
      spot,
      thoughts,
      date: new Date().toISOString(),
    };
    console.log('Saving Session:', sessionData);
    router.back(); // Go back to dashboard after saving
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
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

        {/* QUESTION 2: How were the conditions? (Custom Slider) */}
        <View style={styles.section}>
          <Text style={styles.questionText}>How were the conditions?</Text>
          <View style={styles.sliderContainer}>
            {/* Background Track */}
            <View style={styles.sliderTrack} />
            
            {/* Active Track */}
            <View style={[
              styles.sliderActiveTrack, 
              { width: `${(conditionIndex / (conditionLevels.length - 1)) * 100}%` }
            ]} />

            {/* Stops */}
            <View style={styles.sliderStopsContainer}>
              {conditionLevels.map((level, index) => (
                <TouchableOpacity 
                  key={level} 
                  style={styles.sliderStop}
                  onPress={() => setConditionIndex(index)}
                >
                  <View style={[
                    styles.stopDot, 
                    index <= conditionIndex ? styles.stopDotActive : null
                  ]} />
                  <Text style={[
                    styles.stopLabel,
                    index <= conditionIndex ? styles.stopLabelActive : null
                  ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* QUESTION 3: Where did you surf? */}
        <View style={styles.section}>
          <Text style={styles.questionText}>Where did you surf?</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Ain Diab Plage"
            value={spot}
            onChangeText={setSpot}
            autoCapitalize="words"
          />
        </View>

        {/* QUESTION 4: Thoughts about the session */}
        <View style={styles.section}>
          <Text style={styles.questionText}>Thoughts about the session</Text>
          <Text style={styles.subQuestionText}>
            What do you need to work on? What made you happy today? How did it go?
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="Write your session notes here..."
            value={thoughts}
            onChangeText={setThoughts}
            multiline={true}
            textAlignVertical="top" // Ensures text starts at the top on Android
          />
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  cancelText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
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
  section: {
    marginBottom: 32,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  subQuestionText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    marginTop: -10,
  },
  facesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  faceButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  faceActive: {
    backgroundColor: '#e0f2fe',
    borderColor: '#0ea5e9',
  },
  emoji: {
    fontSize: 42,
  },
  sliderContainer: {
    paddingTop: 10,
    paddingBottom: 20,
    position: 'relative',
  },
  sliderTrack: {
    position: 'absolute',
    top: 22,
    left: 20,
    right: 20,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
  },
  sliderActiveTrack: {
    position: 'absolute',
    top: 22,
    left: 20,
    height: 4,
    backgroundColor: '#0ea5e9',
    borderRadius: 2,
    zIndex: 1,
  },
  sliderStopsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  sliderStop: {
    alignItems: 'center',
    width: 50,
  },
  stopDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 4,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  stopDotActive: {
    borderColor: '#0ea5e9',
  },
  stopLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  stopLabelActive: {
    color: '#0ea5e9',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    minHeight: 120,
  },
});