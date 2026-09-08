import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { useTranslation } from 'react-i18next';


export default function ForecastScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [selectedCoord, setSelectedCoord] = useState<{latitude: number, longitude: number} | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [liveData, setLiveData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Default starting region (Casablanca coastline)
  const initialRegion = {
    latitude: 33.5934,
    longitude: -7.6745,
    latitudeDelta: 0.8,
    longitudeDelta: 0.8,
  };

  // Helper to retrieve the actual location name using Reverse Geocoding
  const fetchLocationName = async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
        {
          headers: {
            'User-Agent': 'SurfLogApp/1.0', // Required by OpenStreetMap terms of use
          },
        }
      );
      const data = await response.json();

      if (data && data.address) {
        const addr = data.address;
        // Prioritize coastal landmarks -> suburb -> village/town -> city
        const spotName = 
          addr.beach || 
          addr.suburb || 
          addr.neighbourhood || 
          addr.village || 
          addr.town || 
          addr.city || 
          addr.county;

        const region = addr.city || addr.state || addr.country;

        if (spotName && region && spotName !== region) {
          return `${spotName}, ${region}`;
        }
        return spotName || region || 'Coastal Spot';
      }
      return 'Ocean Spot';
    } catch (error) {
      console.error('Failed to reverse geocode location:', error);
      return 'Coastal Spot';
    }
  };

  // Triggered when tapping anywhere on the map
  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    
    setSelectedCoord({ latitude, longitude });
    setIsLoading(true);
    setLiveData(null);
    setLocationName('Finding location...');

    try {
      // Execute both API calls concurrently for faster loading
      const [placeName, marineResponse] = await Promise.all([
        fetchLocationName(latitude, longitude),
        fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&hourly=wave_height,wave_period,sea_surface_temperature&timezone=auto`)
      ]);

      setLocationName(placeName);

      const data = await marineResponse.json();
      
      if (data.error) {
         setLiveData({ error: true, statusText: 'Cannot fetch data for this region.' });
         setIsLoading(false);
         return;
      }

      const currentHourIndex = new Date().getHours();
      const waveHeight = data.hourly.wave_height[currentHourIndex];
      const wavePeriod = data.hourly.wave_period[currentHourIndex];
      const waterTemp = data.hourly.sea_surface_temperature[currentHourIndex];

      // Land Detection: Open-Meteo returns null for wave data inland
      if (waveHeight === null) {
         setLiveData({ error: true, statusText: 'No ocean waves here. Tap on the sea!' });
         setIsLoading(false);
         return;
      }

      // Surfability Logic
      const isSurfable = waveHeight >= 0.6 && wavePeriod >= 6;
      
      setLiveData({
        waveHeight: waveHeight.toFixed(1),
        wavePeriod: Math.round(wavePeriod),
        waterTemp: waterTemp ? Math.round(waterTemp) : '--',
        isSurfable: isSurfable,
        statusText: isSurfable ? 'Surfable 🏄‍♂️' : 'Not Surfable 🛑',
        color: isSurfable ? '#10b981' : '#ef4444'
      });

    } catch (error) {
      console.error('Failed to fetch forecast:', error);
      setLiveData({ error: true, statusText: 'Network connection failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Surf Map</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.mapContainer}>
        <MapView 
          style={styles.map} 
          initialRegion={initialRegion} 
          showsUserLocation={true}
          onPress={handleMapPress} 
        >
          {selectedCoord && (
            <Marker coordinate={selectedCoord}>
              <View style={styles.markerPin}>
                <Text style={styles.markerText}>📍</Text>
              </View>
            </Marker>
          )}
        </MapView>

        {selectedCoord && (
          <View style={styles.floatingCardContainer}>
            <View style={styles.spotCard}>
              
              <View style={[styles.statusStrip, { backgroundColor: liveData?.color || '#d1d5db' }]} />
              
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={styles.spotName} numberOfLines={1}>{locationName}</Text>
                    <Text style={styles.spotDistance}>
                      {selectedCoord.latitude.toFixed(4)}, {selectedCoord.longitude.toFixed(4)}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedCoord(null)}>
                    <Text style={styles.closeIcon}>✕</Text>
                  </TouchableOpacity>
                </View>

                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0ea5e9" />
                    <Text style={styles.loadingText}>Identifying spot & reading swell...</Text>
                  </View>
                ) : liveData?.error ? (
                  <View style={styles.errorContainer}>
                     <Text style={styles.errorIcon}>🏜️</Text>
                     <Text style={styles.errorText}>{liveData.statusText}</Text>
                  </View>
                ) : liveData ? (
                  <>
                    <View style={[styles.waveBadge, { borderColor: liveData.color, backgroundColor: liveData.color + '15' }]}>
                      <Text style={[styles.waveHeight, { color: liveData.color }]}>
                        {liveData.statusText}
                      </Text>
                    </View>

                    <View style={styles.detailsGrid}>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Wave Height</Text>
                        <Text style={styles.detailValue}>{liveData.waveHeight} m</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Period</Text>
                        <Text style={styles.detailValue}>{liveData.wavePeriod} sec</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Water Temp</Text>
                        <Text style={styles.detailValue}>{liveData.waterTemp} °C</Text>
                      </View>
                    </View>
                  </>
                ) : null}

              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 10, paddingBottom: 20, backgroundColor: '#ffffff', zIndex: 10,
  },
  backButton: { paddingVertical: 8, width: 60 },
  backText: { fontSize: 16, color: '#0ea5e9', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  
  mapContainer: { flex: 1, position: 'relative' },
  map: { width: '100%', height: '100%' },
  markerPin: {
    padding: 6, borderRadius: 20, backgroundColor: '#111827', borderWidth: 2, borderColor: '#ffffff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,
  },
  markerText: { fontSize: 14 },

  floatingCardContainer: { position: 'absolute', bottom: 30, left: 20, right: 20 },
  spotCard: {
    flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8, overflow: 'hidden',
  },
  statusStrip: { width: 8 },
  cardContent: { flex: 1, padding: 20, minHeight: 180 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  spotName: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  spotDistance: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  closeIcon: { fontSize: 20, color: '#9ca3af', padding: 5, marginTop: -5, marginRight: -5 },
  
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  loadingText: { marginTop: 12, color: '#6b7280', fontWeight: '500' },
  
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 10 },
  errorIcon: { fontSize: 32, marginBottom: 8 },
  errorText: { color: '#ef4444', textAlign: 'center', fontWeight: '600', fontSize: 16 },
  
  waveBadge: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1,
    alignSelf: 'flex-start', marginBottom: 16,
  },
  waveHeight: { fontSize: 16, fontWeight: '900' },
  
  detailsGrid: {
    flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 16,
  },
  detailItem: { flex: 1 },
  detailLabel: { fontSize: 12, color: '#9ca3af', fontWeight: '600', marginBottom: 4, textTransform: 'uppercase' },
  detailValue: { fontSize: 16, color: '#111827', fontWeight: '700' },
});