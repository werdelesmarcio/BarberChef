import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert
} from 'react-native';

export default function PaymentMethodsScreen({ onVoltar }: any) {
  const [cartoes, setCartoes] = useState([
    { id: '1', numero: '•••• •••• •••• 4242', bandeira: 'Mastercard', principal: true },
    { id: '2', numero: '•••• •••• •••• 8888', bandeira: 'Visa', principal: false },
  ]);

  const [mostrarNovoCartao, setMostrarNovoCartao] = useState(false);
  const [numCartao, setNumCartao] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');

  const handleAdicionarCartao = () => {
    if (!numCartao || !validade || !cvv) {
      Alert.alert('Atenção', 'Preencha todos os campos do cartão.');
      return;
    }

    const novo = {
      id: Date.now().toString(),
      numero: '•••• •••• •••• ' + numCartao.slice(-4),
      bandeira: 'Cartão de Crédito',
      principal: false
    };

    setCartoes([...cartoes, novo]);
    setNumCartao('');
    setValidade('');
    setCvv('');
    setMostrarNovoCartao(false);
    Alert.alert('Sucesso', 'Novo método de pagamento adicionado!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onVoltar} style={styles.backButtonCircle}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.brandTitle}>PAYMENT METHODS</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionHeader}>Seus Cartões Salvos</Text>

        {cartoes.map((cartao) => (
          <View key={cartao.id} style={styles.cardBox}>
            <View>
              <Text style={styles.cardBrand}>💳 {cartao.bandeira}</Text>
              <Text style={styles.cardNumber}>{cartao.numero}</Text>
            </View>
            {cartao.principal && (
              <View style={styles.badgePrincipal}>
                <Text style={styles.badgePrincipalText}>Principal</Text>
              </View>
            )}
          </View>
        ))}

        {!mostrarNovoCartao ? (
          <TouchableOpacity style={styles.addCardButton} onPress={() => setMostrarNovoCartao(true)}>
            <Text style={styles.addCardButtonText}>+ Adicionar Novo Cartão</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.formNovoCartao}>
            <Text style={styles.sectionHeader}>Novo Cartão de Crédito</Text>
            <TextInput
              style={styles.input}
              placeholder="Número do Cartão"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={numCartao}
              onChangeText={setNumCartao}
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="MM/AA"
                placeholderTextColor="#666"
                value={validade}
                onChangeText={setValidade}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="CVV"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={cvv}
                onChangeText={setCvv}
              />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleAdicionarCartao}>
              <Text style={styles.saveButtonText}>Salvar Cartão</Text>
            </TouchableOpacity>
          </View>
        )}
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
  sectionHeader: { color: '#8b949e', fontSize: 13, fontWeight: 'bold', marginBottom: 12, marginTop: 10, textTransform: 'uppercase' },
  cardBox: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#161b22', padding: 16, borderRadius: 12, marginBottom: 12,
    borderWidth: 1, borderColor: '#30363d',
  },
  cardBrand: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  cardNumber: { color: '#8b949e', fontSize: 14, letterSpacing: 1 },
  badgePrincipal: { backgroundColor: '#21262d', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgePrincipalText: { color: '#3fb950', fontSize: 11, fontWeight: 'bold' },
  addCardButton: {
    backgroundColor: '#161b22', paddingVertical: 14, borderRadius: 12,
    alignItems: 'center', borderWidth: 1, borderColor: '#30363d', borderStyle: 'dashed', marginTop: 8,
  },
  addCardButtonText: { color: '#a370f0', fontSize: 14, fontWeight: 'bold' },
  formNovoCartao: {
    backgroundColor: '#161b22', padding: 16, borderRadius: 14, marginTop: 8,
    borderWidth: 1, borderColor: '#30363d',
  },
  input: {
    backgroundColor: '#0d1117', color: '#fff', paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: 8, fontSize: 14, marginBottom: 10, borderWidth: 1, borderColor: '#30363d',
  },
  saveButton: {
    backgroundColor: '#3fb950', paddingVertical: 12, borderRadius: 8,
    alignItems: 'center', marginTop: 10,
  },
  saveButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});