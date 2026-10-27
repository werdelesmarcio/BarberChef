import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert
} from 'react-native';

import { COLORS, globalStyles } from './theme';

export default function CadastroBarbeariaScreen({ onSalvarBarbearia }: any) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');

  // Serviços dinâmicos
  const [nomeServico1, setNomeServico1] = useState('Corte Degradê');
  const [precoServico1, setPrecoServico1] = useState('45,00');

  const [nomeServico2, setNomeServico2] = useState('Barba Completa');
  const [precoServico2, setPrecoServico2] = useState('30,00');

  const handleSalvar = () => {
    if (!nome.trim() || !endereco.trim()) {
      Alert.alert('Atenção', 'Preencha o nome e o endereço da barbearia.');
      return;
    }

    const novaBarbearia = {
      id: Date.now().toString(),
      nome,
      telefone,
      endereco,
      servicos: [
        { id: 's1', nome: nomeServico1, preco: precoServico1 },
        { id: 's2', nome: 'Barba Completa', preco: '30,00' },
      ],
    };

    if (onSalvarBarbearia) {
      onSalvarBarbearia(novaBarbearia);
    }

    Alert.alert('Sucesso! 💈', 'Barbearia cadastrada com sucesso.');
  };

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: COLORS.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Cadastrar Nova Barbearia</Text>
        <Text style={styles.subtitle}>Insira as informações do estabelecimento</Text>

        <Text style={styles.label}>Nome do Estabelecimento</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Ex: Barbearia Estilo & Corte"
          placeholderTextColor={COLORS.textMuted}
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Telefone / WhatsApp</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Ex: (11) 98888-7777"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={setTelefone}
        />

        <Text style={styles.label}>Endereço Completo</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Ex: Rua das Flores, 100 - Centro"
          placeholderTextColor={COLORS.textMuted}
          value={endereco}
          onChangeText={setEndereco}
        />

        <Text style={styles.sectionTitle}>Serviço Principal</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TextInput
            style={[globalStyles.input, { flex: 2 }]}
            placeholder="Nome do serviço"
            placeholderTextColor={COLORS.textMuted}
            value={nomeServico1}
            onChangeText={setNomeServico1}
          />
          <TextInput
            style={[globalStyles.input, { flex: 1 }]}
            placeholder="Preço (R$)"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="numeric"
            value={precoServico1}
            onChangeText={setPrecoServico1}
          />
        </View>

        <TouchableOpacity style={globalStyles.primaryButton} onPress={handleSalvar}>
          <Text style={globalStyles.primaryButtonText}>Salvar Barbearia</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 4 },
  subtitle: { fontSize: 13, color: COLORS.textMuted, marginBottom: 24 },
  label: { color: COLORS.textMain, fontSize: 13, fontWeight: '600', marginBottom: 6 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain, marginTop: 16, marginBottom: 12 },
});