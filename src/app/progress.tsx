import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function ProgressScreen() {
  const router = useRouter();

  // Mock data representing saved sessions
  const [sessionHistory] = useState([
    { id: '1', date: 'Jul 22, 2026', spot: 'Ain Diab Plage', rating: '🤩', condition: 'Good', thoughts: 'Felt great on the longboard today. Paddling stamina is improving.' },
    { id: '2', date: 'Jul 18, 2026', spot: 'Ain Diab Plage', rating: '😐', condition: 'Mid', thoughts: 'A bit choppy and crowded. Struggled to catch clean waves.' },
    { id: '3', date: 'Jul 10, 2026', spot: 'Bouznika', rating: '🤩', condition: 'Great', thoughts: 'Perfect glassy conditions. Best session of the month.' },
    { id: '4', date: 'Jun 28, 2026', spot: 'Ain Diab Plage', rating: '😞', condition: 'Bad', thoughts: 'Washed out completely. Went home after 30 minutes.' },
  ]);

return (
  <SafeAreaView style={styles.safeArea}>
    {/* HEADER */}
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Surf Progress</Text>

      <View style={{ width: 50 }} />
    </View>

    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* MONTHLY AVERAGE SECTION */}
      <Text style={styles.sectionTitle}>July 2026 Overview</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Sessions</Text>
          <Text style={styles.statValue}>3</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Avg Vibe</Text>
          <Text style={styles.statEmoji}>🤩</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Conditions</Text>
          <Text style={styles.statValueText}>Good</Text>
        </View>
      </View>

      {/* YEARLY AVERAGE SECTION */}
      <Text style={styles.sectionTitle}>2026 Year-to-Date</Text>

      <View style={styles.yearlyCard}>
        <View style={styles.yearlyRow}>
          <Text style={styles.yearlyLabel}>
            Total Sessions Logged:
          </Text>
          <Text style={styles.yearlyValue}>24</Text>
        </View>

        <View style={styles.yearlyRow}>
          <Text style={styles.yearlyLabel}>
            Most Frequent Spot:
          </Text>
          <Text style={styles.yearlyValue}>
            Ain Diab Plage
          </Text>
        </View>

        <View style={styles.yearlyRow}>
          <Text style={styles.yearlyLabel}>
            Overall Condition Avg:
          </Text>
          <Text style={styles.yearlyValue}>
            Mid / Good
          </Text>
        </View>
      </View>

      {/* SESSION HISTORY LOG */}
      <Text style={styles.sectionTitle}>Recent Records</Text>

      {sessionHistory.map((session) => (
        <View key={session.id} style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <View>
              <Text style={styles.historyDate}>
                {session.date}
              </Text>

              <Text style={styles.historySpot}>
                {session.spot}
              </Text>
            </View>

            <Text style={styles.historyEmoji}>
              {session.rating}
            </Text>
          </View>

          <View style={styles.badgeContainer}>
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionBadgeText}>
                {session.condition}
              </Text>
            </View>
          </View>

          <Text style={styles.historyThoughts}>
            {session.thoughts}
          </Text>
        </View>
      ))}

      {/* Bottom padding */}
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
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: '#ffffff',
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0ea5e9',
  },
  statEmoji: {
    fontSize: 24,
  },
  statValueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  yearlyCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  yearlyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  yearlyLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  yearlyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  historyCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  historyDate: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  historySpot: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  historyEmoji: {
    fontSize: 32,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  conditionBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  conditionBadgeText: {
    color: '#0ea5e9',
    fontSize: 12,
    fontWeight: 'bold',
  },
  historyThoughts: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});
