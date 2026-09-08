import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  Pressable,
  Animated,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

export default function DashboardScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  // -- UI State --
  const [isMenuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  // -- Mock Data --
  const [userName] = useState('Taha'); 
  const [todayActivities] = useState([
    { id: '1', type: 'Surf', time: '07:00 AM', detail: 'Ain Diab' },
    { id: '2', type: 'Workout', time: '06:00 PM', detail: 'Circuit Training' }
  ]);

  // -- Live Forecast State --
  const [liveForecast, setLiveForecast] = useState<any>(null);
  const [isLoadingForecast, setIsLoadingForecast] = useState(true);

  useEffect(() => {
    // Automatically fetch live data for Aïn Diab when the dashboard loads
    const fetchAinDiabForecast = async () => {
      try {
        const url = `https://marine-api.open-meteo.com/v1/marine?latitude=33.5934&longitude=-7.6745&hourly=wave_height,wave_period&timezone=auto`;
        const response = await fetch(url);
        const data = await response.json();

        const currentHour = new Date().getHours();
        const waveHeight = data.hourly.wave_height[currentHour];
        const wavePeriod = data.hourly.wave_period[currentHour];

        const isSurfable = waveHeight >= 0.6 && wavePeriod >= 6;

        setLiveForecast({
          waveHeight: waveHeight.toFixed(1),
          wavePeriod: Math.round(wavePeriod),
          condition: isSurfable ? 'Surfable' : 'Flat / Choppy',
          bgColor: isSurfable ? '#0ea5e9' : '#6b7280' // Blue if good, Gray if bad
        });
      } catch (error) {
        console.error("Failed to fetch dashboard forecast:", error);
        setLiveForecast({ error: true });
      } finally {
        setIsLoadingForecast(false);
      }
    };

    fetchAinDiabForecast();
  }, []);

  // -- Menu Animations --
  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -DRAWER_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>{new Date().toDateString()}</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* GREETING SECTION */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Hi {userName},</Text>
          <Text style={styles.greetingSubtitle}>Ready to tackle today's plan?</Text>
        </View>

        {/* LIVE FORECAST SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How are the waves today?</Text>
          
          <TouchableOpacity 
            style={[
              styles.forecastCard, 
              liveForecast?.bgColor ? { backgroundColor: liveForecast.bgColor } : {}
            ]} 
            activeOpacity={0.8}
            onPress={() => router.push('/forecast')}
          >
            <View style={styles.forecastHeader}>
              <Text style={styles.spotName}>Aïn Diab Plage</Text>
              
              {/* Dynamic Wave Height or Loading Spinner */}
              {isLoadingForecast ? (
                <ActivityIndicator color="#ffffff" />
              ) : liveForecast && !liveForecast.error ? (
                <Text style={styles.waveHeight}>{liveForecast.waveHeight} m</Text>
              ) : (
                <Text style={styles.waveHeight}>-- m</Text>
              )}
            </View>
            
            {/* Dynamic Conditions Text */}
            {isLoadingForecast ? (
              <Text style={styles.forecastDetail}>Fetching buoy data...</Text>
            ) : liveForecast && !liveForecast.error ? (
              <Text style={styles.forecastDetail}>
                {liveForecast.condition} • {liveForecast.wavePeriod}s period
              </Text>
            ) : (
              <Text style={styles.forecastDetail}>Unable to load ocean data</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* TODAY'S PLANNER SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Planner</Text>
          {todayActivities.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityLeft}>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
              <View style={styles.activityRight}>
                <Text style={styles.activityType}>{activity.type}</Text>
                <Text style={styles.activityDetail}>{activity.detail}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* FLOATING ACTION BUTTON */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={() => router.push('/log-session')}>
          <Text style={styles.fabText}>Did you surf today?</Text>
        </TouchableOpacity>
      </View>

      {/* SIDE MENU MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={closeMenu}
      >
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalOverlay} onPress={closeMenu} />
          
          <Animated.View style={[styles.sideDrawer, { transform: [{ translateX: slideAnim }] }]}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>SurfLog</Text>
              <TouchableOpacity onPress={closeMenu}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.drawerItem} onPress={() => {
              closeMenu();
              setTimeout(() => router.push('/profile'), 250);
            }}>
              <Text style={styles.drawerItemText}>👤 Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.drawerItem} onPress={() => {
              closeMenu();
              setTimeout(() => router.push('/planner'), 250);
            }}>
              <Text style={styles.drawerItemText}>📅 Planner</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.drawerItem} onPress={() => {
              closeMenu();
              setTimeout(() => router.push('/progress'), 250);
            }}>
              <Text style={styles.drawerItemText}>📈 Surf Progress</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 10, paddingBottom: 20,
  },
  menuButton: { padding: 8, marginLeft: -8 },
  menuIcon: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  dateText: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  container: { flex: 1, paddingHorizontal: 24 },
  greetingSection: { marginBottom: 32 },
  greetingTitle: { fontSize: 32, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  greetingSubtitle: { fontSize: 16, color: '#6b7280' },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginBottom: 16 },
  
  forecastCard: {
    backgroundColor: '#0ea5e9', padding: 20, borderRadius: 16,
    shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  forecastHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  spotName: { fontSize: 20, fontWeight: 'bold', color: '#ffffff' },
  waveHeight: { fontSize: 24, fontWeight: '900', color: '#ffffff' },
  forecastDetail: { fontSize: 14, color: '#e0f2fe', fontWeight: '500' },
  
  activityCard: {
    flexDirection: 'row', backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 12,
    borderWidth: 1, borderColor: '#e5e7eb',
  },
  activityLeft: { justifyContent: 'center', paddingRight: 16, borderRightWidth: 1, borderRightColor: '#e5e7eb', width: 90 },
  activityTime: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  activityRight: { paddingLeft: 16, justifyContent: 'center' },
  activityType: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  activityDetail: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  
  fabContainer: { padding: 24, backgroundColor: 'transparent' },
  fab: {
    backgroundColor: '#111827', paddingVertical: 18, borderRadius: 12, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5,
  },
  fabText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  
  // --- SIDE MENU STYLES ---
  modalContainer: { flex: 1, flexDirection: 'row' },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' },
  sideDrawer: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: DRAWER_WIDTH, backgroundColor: '#ffffff',
    paddingTop: 60, paddingHorizontal: 24, shadowColor: '#000', shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10,
  },
  drawerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 },
  drawerTitle: { fontSize: 24, fontWeight: '900', color: '#0ea5e9' },
  closeIcon: { fontSize: 24, color: '#6b7280', fontWeight: 'bold' },
  drawerItem: { paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  drawerItemText: { fontSize: 18, color: '#374151', fontWeight: '500' },
});