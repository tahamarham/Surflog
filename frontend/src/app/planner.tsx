import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const getActivityColor = (type: string) => {
  switch (type) {
    case 'Surfing': return '#0ea5e9';
    case 'Lifting': return '#f97316';
    case 'Running': return '#10b981';
    case 'Team Sports': return '#ef4444';
    case 'Stretching': return '#8b5cf6';
    default: return '#6b7280';
  }
};

type Activity = { id: string; type: string; time: string; duration: number; notes: string };

const HOUR_HEIGHT = 60;

export default function PlannerScreen() {
  const router = useRouter();
  
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [isFormVisible, setFormVisible] = useState(false);

  const { t, i18n } = useTranslation();
  const [formDay, setFormDay] = useState('Mon');
  const [formTime, setFormTime] = useState('09:00');
  const [formDuration, setFormDuration] = useState('60');
  const [formActivity, setFormActivity] = useState('Surfing');
  const [formNotes, setFormNotes] = useState('');

  const [schedule, setSchedule] = useState<Record<string, Activity[]>>({
    'Mon': [],
    'Tue': [{ id: '1', type: 'Surfing', time: '06:30', duration: 90, notes: 'Dawn patrol. Focusing on bottom turns.' }],
    'Wed': [{ id: '2', type: 'Lifting', time: '18:00', duration: 60, notes: 'Upper body power. Pull-ups and overhead press.' }],
    'Thu': [],
    'Fri': [],
    'Sat': [{ id: '3', type: 'Running', time: '07:00', duration: 45, notes: 'Zone 2 recovery run, 5km.' }],
    'Sun': [{ id: '4', type: 'Stretching', time: '09:00', duration: 30, notes: 'Yoga and shoulder mobility.' }],
  });

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activityTypes = ['Surfing', 'Lifting', 'Running', 'Team Sports', 'Stretching'];
  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);

  const calculateTopOffset = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return 0;
    return (hours * HOUR_HEIGHT) + minutes;
  };

  const handleSaveActivity = () => {
    if (!formTime.includes(':')) {
      Alert.alert('Invalid Time', 'Please use HH:mm format (e.g., 14:30)');
      return;
    }
    
    const newActivity: Activity = {
      id: Date.now().toString(),
      type: formActivity,
      time: formTime,
      duration: parseInt(formDuration) || 60,
      notes: formNotes,
    };

    setSchedule(prev => ({
      ...prev,
      [formDay]: [...prev[formDay], newActivity]
    }));

    setFormTime('09:00');
    setFormDuration('60');
    setFormNotes('');
    setFormVisible(false);
  };

  const handleDeleteActivity = (activityId: string, day: string) => {
    Alert.alert(
      "Delete Activity",
      "Are you sure you want to remove this session?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            setSchedule(prev => ({
              ...prev,
              [day]: prev[day].filter(act => act.id !== activityId)
            }));
          }
        }
      ]
    );
  };

  const currentActivities = schedule[selectedDay] || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agenda</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.calendarStrip}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarScroll}>
          {daysOfWeek.map((day) => {
            const isSelected = selectedDay === day;
            return (
              <TouchableOpacity 
                key={day} 
                style={[styles.dayCard, isSelected && styles.dayCardActive]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={[styles.dayName, isSelected && styles.dayTextActive]}>{day}</Text>
                {schedule[day].length > 0 && !isSelected ? <View style={styles.activeDot} /> : null}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.gridScrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.gridInner}>
          
          {hoursOfDay.map(hour => (
            <View key={`line-${hour}`} style={styles.hourRow}>
              <Text style={styles.timeLabel}>
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </Text>
              <View style={styles.hourLine} />
            </View>
          ))}

          <View style={styles.eventsContainer}>
            {currentActivities.map((activity) => {
              const topOffset = calculateTopOffset(activity.time);
              const height = activity.duration;

              return (
                <TouchableOpacity 
                  key={activity.id} 
                  style={[
                    styles.activityBlock, 
                    { 
                      top: topOffset, 
                      height: height,
                      backgroundColor: getActivityColor(activity.type) + '20',
                      borderLeftColor: getActivityColor(activity.type),
                    }
                  ]}
                  onLongPress={() => handleDeleteActivity(activity.id, selectedDay)}
                  delayLongPress={400}
                >
                  <Text style={[styles.blockType, { color: getActivityColor(activity.type) }]}>
                    {activity.type} • {activity.time}
                  </Text>
                  {activity.notes ? (
                    <Text style={styles.blockNotes} numberOfLines={1}>{activity.notes}</Text>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
          
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity 
        style={styles.hugeFab} 
        onPress={() => {
          setFormDay(selectedDay);
          setFormVisible(true);
        }}
      >
        <Text style={styles.hugeFabText}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        visible={isFormVisible}
        onRequestClose={() => setFormVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <KeyboardAvoidingView 
            style={styles.modalContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setFormVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>New Session</Text>
              <TouchableOpacity onPress={handleSaveActivity}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              
              <View style={styles.formSection}>
                <Text style={styles.label}>Day</Text>
                <View style={styles.chipRow}>
                  {daysOfWeek.map((day) => (
                    <TouchableOpacity 
                      key={day}
                      style={[styles.chip, formDay === day && styles.chipActive]}
                      onPress={() => setFormDay(day)}
                    >
                      <Text style={[styles.chipText, formDay === day && styles.chipTextActive]}>{day}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.timeDurationRow}>
                <View style={[styles.formSection, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Time (HH:mm)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="14:30"
                    value={formTime}
                    onChangeText={setFormTime}
                    keyboardType="numbers-and-punctuation"
                  />
                </View>
                <View style={[styles.formSection, { flex: 1, marginLeft: 10 }]}>
                  <Text style={styles.label}>Duration (Mins)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="60"
                    value={formDuration}
                    onChangeText={setFormDuration}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.label}>Activity</Text>
                <View style={styles.chipGrid}>
                  {activityTypes.map((act) => (
                    <TouchableOpacity 
                      key={act}
                      style={[
                        styles.activityChip, 
                        formActivity === act && { borderColor: getActivityColor(act), backgroundColor: getActivityColor(act) + '20' }
                      ]}
                      onPress={() => setFormActivity(act)}
                    >
                      <Text style={[
                        styles.activityChipText, 
                        formActivity === act && { color: getActivityColor(act), fontWeight: 'bold' }
                      ]}>{act}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.label}>Session Plan / Notes</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="What exercises? Spot conditions?"
                  value={formNotes}
                  onChangeText={setFormNotes}
                  multiline={true}
                />
              </View>

            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 10, paddingBottom: 20, backgroundColor: '#ffffff',
  },
  backButton: { paddingVertical: 8, width: 60 },
  backText: { fontSize: 16, color: '#0ea5e9', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  
  calendarStrip: {
    backgroundColor: '#ffffff', paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: '#f3f4f6', zIndex: 10,
  },
  calendarScroll: { paddingHorizontal: 16 },
  dayCard: {
    alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 16,
    marginHorizontal: 4, borderRadius: 16, backgroundColor: '#f3f4f6', minWidth: 60, position: 'relative',
  },
  dayCardActive: { backgroundColor: '#111827' },
  dayName: { fontSize: 16, color: '#6b7280', fontWeight: 'bold' },
  dayTextActive: { color: '#ffffff' },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#0ea5e9', position: 'absolute', bottom: 6 },
  
  gridScrollContainer: { flex: 1, backgroundColor: '#f9fafb' },
  gridInner: { position: 'relative', paddingTop: 20 },
  hourRow: { flexDirection: 'row', height: HOUR_HEIGHT, width: '100%' },
  timeLabel: { width: 60, textAlign: 'right', paddingRight: 10, fontSize: 12, color: '#9ca3af', marginTop: -7 },
  hourLine: { flex: 1, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  
  eventsContainer: { position: 'absolute', top: 20, left: 60, right: 10, bottom: 0 },
  activityBlock: {
    position: 'absolute', left: 0, right: 0,
    borderRadius: 8, borderLeftWidth: 4, paddingHorizontal: 10, paddingVertical: 6,
    overflow: 'hidden',
  },
  blockType: { fontSize: 14, fontWeight: 'bold' },
  blockNotes: { fontSize: 12, color: '#374151', marginTop: 2 },
  
  hugeFab: {
    position: 'absolute', bottom: 30, right: 24,
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#0ea5e9',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8,
  },
  hugeFabText: { fontSize: 40, color: '#ffffff', fontWeight: '300', marginTop: -4 },
  
  modalSafeArea: { flex: 1, backgroundColor: '#ffffff' },
  modalContainer: { flex: 1, paddingHorizontal: 24 },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', marginBottom: 20,
  },
  cancelText: { fontSize: 16, color: '#6b7280' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  saveText: { fontSize: 16, color: '#0ea5e9', fontWeight: 'bold' },
  formSection: { marginBottom: 24 },
  timeDurationRow: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 16, fontWeight: '700', color: '#374151', marginBottom: 12 },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, fontSize: 16, color: '#111827' },
  textArea: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, fontSize: 16, color: '#111827', minHeight: 120, textAlignVertical: 'top' },
  
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#f3f4f6' },
  chipActive: { backgroundColor: '#111827' },
  chipText: { fontSize: 14, color: '#6b7280', fontWeight: '600' },
  chipTextActive: { color: '#ffffff' },
  
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  activityChip: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb' },
  activityChipText: { fontSize: 14, color: '#374151', fontWeight: '600' },
});