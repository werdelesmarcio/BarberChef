import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';

// Importa o tema global
import { COLORS, globalStyles } from './theme';

export default function LoginBarbeiro({ onLoginSucesso, onVoltar }: any) {
  const [senha, setSenha] = useState('');
  const SENHA_MESTRE = '1234';

  const handleEntrar = () => {
    if (senha === SENHA_MESTRE) {
      setSenha('');
      onLoginSucesso();
    } else {
      Alert.alert('Senha incorreta', 'A senha padrão de teste é 1234.');
      setSenha('');
    }
  };

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: COLORS.background }]}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={onVoltar}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.logo}>🔐 Acesso Restrito</Text>
        <Text style={styles.subtitle}>Digite a senha para acessar o Painel do Barbeiro</Text>

        <TextInput
          style={[globalStyles.input, styles.inputCenter]}
          placeholder="Senha (Ex: 1234)"
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry
          keyboardType="numeric"
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={globalStyles.primaryButton} onPress={handleEntrar}>
          <Text style={globalStyles.primaryButtonText}>Entrar no Painel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 24,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputCenter: {
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 4,
  },
});