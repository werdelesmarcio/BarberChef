import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, Platform, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { COLORS } from './theme';

export default function MapaBarbearia({ barbearia, onVoltar }: any) {
  // Coordenadas padrão (exemplo: Centro de São Paulo ou use as da barbearia se disponíveis)
  const latitude = barbearia?.latitude || -23.550520;
  const longitude = barbearia?.longitude || -46.633308;

  const abrirNoGPS = () => {
    const url = Platform.select {
      ios: `maps:0,0?q=${encodeURIComponent(barbearia?.nome || 'Barbearia')}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${encodeURIComponent(barbearia?.nome || 'Barbearia')})`
    };
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.containerMaster}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <SafeAreaView style={styles.containerSafe}>
        {/* Barra Superior */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onVoltar} style={styles.backButtonCircle}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.brandTitle}>LOCALIZAÇÃO</Text>
          <View style={{ width: 38 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.salonTitle}>💈 {barbearia?.nome || 'Barbearia Veloura'}</Text>
          <Text style={styles.salonAddress}>📍 {barbearia?.endereco || 'Endereço não informado'}</Text>

          {/* Componente do Mapa */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={{ latitude, longitude }}
                title={barbearia?.nome || 'Barbearia'}
                description={barbearia?.endereco}
              />
            </MapView>
          </View>

          {/* Botão para abrir no GPS Externo */}
          <TouchableOpacity style={styles.primaryButton} onPress={abrirNoGPS}>
            <Text style={styles.primaryButtonText}>Abrir no GPS (Google / Apple Maps)</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerMaster: { flex: 1, backgroundColor: COLORS.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0 },
  containerSafe: { flex: 1, backgroundColor: COLORS.background },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backButtonCircle: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.surface,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  backButtonText: { color: COLORS.textMain, fontSize: 22, fontWeight: '300', marginTop: -2 },
  brandTitle: { color: COLORS.primary, fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  content: { flex: 1, padding: 20 },
  salonTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 4 },
  salonAddress: { fontSize: 14, color: COLORS.textMuted, marginBottom: 16 },
  mapContainer: {
    flex: 1, borderRadius: 16, overflow: 'hidden', borderWidth: 1,
    borderColor: COLORS.border, marginBottom: 16, backgroundColor: COLORS.surface,
  },
  map: { width: '100%', height: '100%' },
  primaryButton: {
    backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 16,
    alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});