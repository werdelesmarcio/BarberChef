import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert
} from 'react-native';

export default function SettingsScreen({ onVoltar }: any) {
  const [notificacoes, setNotificacoes] = useState(true);
  const [modoEscuro, setModoEscuro] = useState(true);
  const [biometria, setBiometria] = useState(false);

  const handleSalvarConfig = () => {
    Alert.alert('Sucesso', 'Configurações atualizadas com sucesso!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onVoltar} style={styles.backButtonCircle}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.brandTitle}>SETTINGS</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionHeader}>Preferências do Aplicativo</Text>

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>Notificações Push</Text>
            <Text style={styles.settingSubtitle}>Lembretes de agendamentos e promoções</Text>
          </View>
          <Switch
            value={notificacoes}
            onValueChange={setNotificacoes}
            trackColor={{ false: '#21262d', true: '#a370f0' }}
            thumbColor={'#fff'}
          />
        </View>

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>Modo Escuro (Dark Theme)</Text>
            <Text style={styles.settingSubtitle}>Padrão visual Veloura Dark</Text>
          </View>
          <Switch
            value={modoEscuro}
            onValueChange={setModoEscuro}
            trackColor={{ false: '#21262d', true: '#a370f0' }}
            thumbColor={'#fff'}
          />
        </View>

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>Autenticação por Biometria</Text>
            <Text style={styles.settingSubtitle}>Entrar usando Face ID / Impressão Digital</Text>
          </View>
          <Switch
            value={biometria}
            onValueChange={setBiometria}
            trackColor={{ false: '#21262d', true: '#a370f0' }}
            thumbColor={'#fff'}
          />
        </View>

        <Text style={styles.sectionHeader}>Conta & Suporte</Text>

        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Privacidad", "Seus dados estão protegidos pela LGPD.")}>
          <Text style={styles.menuItemText}>🔒 Política de Privacidade</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Suporte", "Entre em contato via suporte@veloura.app")}>
          <Text style={styles.menuItemText}>💬 Ajuda e Suporte</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSalvarConfig}>
          <Text style={styles.saveButtonText}>Salvar Preferências</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117' },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#21262d',
  },
  backButtonCircle: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#161b22',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#30363d',
  },
  backButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  brandTitle: { color: '#a370f0', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  scrollContent: { padding: 20 },
  sectionHeader: { color: '#8b949e', fontSize: 13, fontWeight: 'bold', marginBottom: 12, marginTop: 16, textTransform: 'uppercase' },
  settingRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#161b22', padding: 16, borderRadius: 12, marginBottom: 10,
    borderWidth: 1, borderColor: '#30363d',
  },
  settingTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  settingSubtitle: { color: '#8b949e', fontSize: 12 },
  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#161b22', padding: 16, borderRadius: 12, marginBottom: 10,
    borderWidth: 1, borderColor: '#30363d',
  },
  menuItemText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  menuArrow: { color: '#8b949e', fontSize: 18 },
  saveButton: {
    backgroundColor: '#a370f0', paddingVertical: 14, borderRadius: 12,
    alignItems: 'center', marginTop: 24,
  },
  saveButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});