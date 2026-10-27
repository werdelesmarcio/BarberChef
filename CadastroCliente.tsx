import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from './theme';

const STORAGE_KEY_CLIENTE = '@barberapp_dados_cliente';

export default function CadastroCliente({ onCadastroSucesso, onVoltar }: any) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');

  const handleSalvarCadastro = async () => {
    if (!nome.trim() || !email.trim() || !telefone.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      const novoCliente = {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        telefone: telefone.trim(),
        senha: senha.trim()
      };

      // Salva os dados do novo cliente na memória local
      await AsyncStorage.setItem(STORAGE_KEY_CLIENTE, JSON.stringify(novoCliente));
      
      Alert.alert('Sucesso ✨', 'Conta de cliente criada com sucesso!');
      
      if (onCadastroSucesso) {
        onCadastroSucesso(novoCliente);
      }
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível salvar o cadastro.');
    }
  };

  return (
    <View style={styles.containerMaster}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <SafeAreaView style={styles.containerSafe}>
        <View style={styles.headerVoltarContainer}>
          <TouchableOpacity style={styles.botaoVoltar} onPress={onVoltar}>
            <Text style={styles.textoVoltar}>← Voltar ao Login</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Criar Conta de Cliente</Text>
          <Text style={styles.subtitle}>Preencha seus dados para começar a agendar</Text>

          <View style={styles.cardBox}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Marcio Silva"
              placeholderTextColor="#888"
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: marcio@email.com"
              placeholderTextColor="#888"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Telefone / WhatsApp</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: (11) 98888-7777"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={telefone}
              onChangeText={setTelefone}
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Crie uma senha"
              placeholderTextColor="#888"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />

            <TouchableOpacity style={styles.primaryButton} onPress={handleSalvarCadastro}>
              <Text style={styles.primaryButtonText}>Cadastrar e Entrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerMaster: { flex: 1, backgroundColor: COLORS.background },
  containerSafe: { flex: 1, backgroundColor: COLORS.background },
  headerVoltarContainer: { backgroundColor: COLORS.background },
  botaoVoltar: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  textoVoltar: { color: COLORS.primary, fontSize: 14, fontWeight: 'bold' },
  scrollContent: { padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 4 },
  subtitle: { fontSize: 13, color: COLORS.textMuted, marginBottom: 24 },
  cardBox: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: { color: COLORS.textMain, fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: COLORS.background,
    color: COLORS.textMain,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});