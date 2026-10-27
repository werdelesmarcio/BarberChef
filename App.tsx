import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Alert,
  StatusBar,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLORS } from './theme';
import CadastroBarbeariaScreen from './CadastroBarbearia';
import CadastroCliente from './CadastroCliente';
import PerfilCliente from './PerfilCliente';
import PainelBarbearia from './PainelBarbearia';
import LoginBarbeiro from './LoginBarbeiro';
import SettingsScreen from './SettingsScreen';
import PaymentMethodsScreen from './PaymentMethodsScreen';

const STORAGE_KEY_BARBEARIAS = '@barberapp_barbearias';
const STORAGE_KEY_AGENDAMENTOS = '@barberapp_agendamentos';
const STORAGE_KEY_CLIENTE = '@barberapp_dados_cliente';

const BARBEARIAS_INICIAIS = [
  {
    id: '1',
    nome: 'Barbearia Navalha de Ouro',
    telefone: '(11) 99999-0000',
    endereco: 'Av. Principal, 123 - Centro',
    servicos: [
      { id: 's1', nome: 'Corte Degradê', preco: '45,00' },
      { id: 's2', nome: 'Barba Completa', preco: '30,00' },
      { id: 's3', nome: 'Combo Corte + Barba', preco: '65,00' },
    ],
  },
];

const AGENDAMENTOS_INICIAIS = [
  {
    id: '101',
    cliente: 'Carlos Eduardo',
    barbearia: 'Barbearia Navalha de Ouro',
    servico: 'Combo Corte + Barba',
    preco: '65,00',
    data: new Date().toISOString().split('T')[0],
    horario: '14:00',
    status: 'pendente',
  },
];

export default function App() {
  const [telaAtual, setTelaAtual] = useState('login_principal');
  const [barbeiroLogado, setBarbeiroLogado] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);

  const [barbearias, setBarbearias] = useState<any[]>(BARBEARIAS_INICIAIS);
  const [agendamentos, setAgendamentos] = useState<any[]>(AGENDAMENTOS_INICIAIS);

  const [inputEmail, setInputEmail] = useState('');
  const [inputSenha, setInputSenha] = useState('');

  useEffect(() => {
    const carregarDadosDaMemoria = async () => {
      try {
        const barbeariasSalvas = await AsyncStorage.getItem(STORAGE_KEY_BARBEARIAS);
        const agendamentosSalvos = await AsyncStorage.getItem(STORAGE_KEY_AGENDAMENTOS);

        if (barbeariasSalvas !== null) setBarbearias(JSON.parse(barbeariasSalvas));
        if (agendamentosSalvos !== null) setAgendamentos(JSON.parse(agendamentosSalvos));
      } catch (erro) {
        console.log('Erro ao carregar dados:', erro);
      } finally {
        setCarregandoDados(false);
      }
    };
    carregarDadosDaMemoria();
  }, []);

  const handleFazerLogin = async () => {
    if (!inputEmail.trim() || !inputSenha.trim()) {
      Alert.alert('Atenção', 'Preencha o e-mail e a senha.');
      return;
    }

    try {
      const clienteSalvo = await AsyncStorage.getItem(STORAGE_KEY_CLIENTE);
      let usuarioCadastrado = false;

      if (clienteSalvo !== null) {
        const perfil = JSON.parse(clienteSalvo);
        if (perfil.email && perfil.email.toLowerCase() === inputEmail.trim().toLowerCase()) {
          if (perfil.senha && perfil.senha === inputSenha.trim()) {
            usuarioCadastrado = true;
          }
        }
      }

      if (inputEmail.trim().toLowerCase() === 'cliente@veloura.app' && inputSenha === '123456') {
        usuarioCadastrado = true;
      }

      if (!usuarioCadastrado) {
        Alert.alert('Acesso Negado', 'Usuário não cadastrado.');
        return;
      }

      setTelaAtual('perfil_cliente');
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível realizar o login.');
    }
  };

  const handleAbrirOpcoesCadastro = () => {
    Alert.alert(
      'Criar Nova Conta',
      'Você deseja se cadastrar como cliente ou cadastrar uma barbearia?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sou Cliente',
          onPress: () => setTelaAtual('cadastro_cliente') // Redireciona para o cadastro limpo de cliente
        },
        {
          text: 'Sou Barbeiro',
          onPress: () => setTelaAtual('cadastro_barbearia') // Redireciona para o cadastro de barbearia
        }
      ]
    );
  };

  const handleAdicionarBarbearia = async (novaBarbearia: any) => {
    try {
      const novaLista = [...barbearias, novaBarbearia];
      setBarbearias(novaLista);
      await AsyncStorage.setItem(STORAGE_KEY_BARBEARIAS, JSON.stringify(novaLista));
      setTelaAtual('painel_barbearia');
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível salvar a barbearia.');
    }
  };

  const handleNovoAgendamento = async (novoAgendamento: any) => {
    try {
      const agendamentoComStatus = { ...novoAgendamento, status: 'pendente' };
      const novaLista = [agendamentoComStatus, ...agendamentos];
      setAgendamentos(novaLista);
      await AsyncStorage.setItem(STORAGE_KEY_AGENDAMENTOS, JSON.stringify(novaLista));
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível salvar o agendamento.');
    }
  };

  const handleAtualizarStatus = async (idAgendamento: string, novoStatus: string, formaPagamento?: string) => {
    try {
      const listaAtualizada = agendamentos.map((item) => {
        if (item.id === idAgendamento) {
          return { 
            ...item, 
            status: novoStatus, 
            formaPagamento: formaPagamento || item.formaPagamento 
          };
        }
        return item;
      });
      setAgendamentos(listaAtualizada);
      await AsyncStorage.setItem(STORAGE_KEY_AGENDAMENTOS, JSON.stringify(listaAtualizada));
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível atualizar o status.');
    }
  };

  if (carregandoDados) {
    return (
      <View style={styles.containerMaster}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <SafeAreaView style={styles.containerSafe}>
          <View style={styles.content}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{ color: COLORS.textMuted, marginTop: 12 }}>Carregando dados...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (telaAtual === 'login_barbeiro') {
    return (
      <View style={styles.containerMaster}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <SafeAreaView style={styles.containerSafe}>
          <LoginBarbeiro
            onLoginSucesso={() => {
              setBarbeiroLogado(true);
              setTelaAtual('painel_barbearia');
            }}
            onVoltar={() => setTelaAtual('login_principal')}
          />
        </SafeAreaView>
      </View>
    );
  }

  if (telaAtual === 'painel_barbearia') {
    if (!barbeiroLogado) {
      setTelaAtual('login_barbeiro');
      return null;
    }
    return (
      <View style={styles.containerMaster}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <SafeAreaView style={styles.containerSafe}>
          <View style={styles.headerVoltarContainer}>
            <TouchableOpacity
              style={styles.botaoVoltar}
              onPress={() => {
                setBarbeiroLogado(false);
                setTelaAtual('login_principal');
              }}
            >
              <Text style={styles.textoVoltar}>← Sair / Voltar ao Início</Text>
            </TouchableOpacity>
          </View>
          <PainelBarbearia
            agendamentos={agendamentos}
            barbearias={barbearias}
            onAtualizarStatus={handleAtualizarStatus}
          />
        </SafeAreaView>
      </View>
    );
  }

  // ROTA DE CADASTRO DE CLIENTE
  if (telaAtual === 'cadastro_cliente') {
    return (
      <CadastroCliente
        onCadastroSucesso={() => setTelaAtual('perfil_cliente')}
        onVoltar={() => setTelaAtual('login_principal')}
      />
    );
  }

  // ROTA DE CADASTRO DE BARBEARIA
  if (telaAtual === 'cadastro_barbearia') {
    return (
      <View style={styles.containerMaster}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <SafeAreaView style={styles.containerSafe}>
          <View style={styles.headerVoltarContainer}>
            <TouchableOpacity
              style={styles.botaoVoltar}
              onPress={() => setTelaAtual('login_principal')}
            >
              <Text style={styles.textoVoltar}>← Voltar ao Início</Text>
            </TouchableOpacity>
          </View>
          <CadastroBarbeariaScreen onSalvarBarbearia={handleAdicionarBarbearia} />
        </SafeAreaView>
      </View>
    );
  }

  if (telaAtual === 'perfil_cliente') {
    return (
      <View style={styles.containerMaster}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <SafeAreaView style={styles.containerSafe}>
          <PerfilCliente
            barbearias={barbearias}
            agendamentos={agendamentos}
            onAgendar={handleNovoAgendamento}
            onVoltar={() => setTelaAtual('login_principal')}
          />
        </SafeAreaView>
      </View>
    );
  }

  if (telaAtual === 'settings') {
    return (
      <View style={styles.containerMaster}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <SafeAreaView style={styles.containerSafe}>
          <SettingsScreen onVoltar={() => setTelaAtual('perfil_cliente')} />
        </SafeAreaView>
      </View>
    );
  }

  if (telaAtual === 'payment_methods') {
    return (
      <View style={styles.containerMaster}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <SafeAreaView style={styles.containerSafe}>
          <PaymentMethodsScreen onVoltar={() => setTelaAtual('perfil_cliente')} />
        </SafeAreaView>
      </View>
    );
  }

  // TELA PRINCIPAL DE LOGIN
  return (
    <View style={styles.containerMaster}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <SafeAreaView style={styles.containerSafe}>
        <View style={styles.content}>
          <Text style={styles.logo}>VELOURA</Text>
          <Text style={styles.subtitle}>Entre com sua conta para continuar</Text>

          <View style={styles.loginCard}>
            <Text style={styles.label}>E-mail ou Usuário</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor="#888"
              autoCapitalize="none"
              value={inputEmail}
              onChangeText={setInputEmail}
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Sua senha secreta"
              placeholderTextColor="#888"
              secureTextEntry
              value={inputSenha}
              onChangeText={setInputSenha}
            />

            <TouchableOpacity style={styles.primaryButton} onPress={handleFazerLogin}>
              <Text style={styles.primaryButtonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signupLinkContainer} onPress={handleAbrirOpcoesCadastro}>
              <Text style={styles.signupText}>
                Não tem uma conta? <Text style={styles.signupHighlight}>Cadastre-se</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.footerLinkContainer}
            onPress={() => {
              if (barbeiroLogado) {
                setTelaAtual('painel_barbearia');
              } else {
                setTelaAtual('login_barbeiro');
              }
            }}
          >
            <Text style={styles.footerLinkText}>É dono de barbearia? <Text style={styles.footerLinkHighlight}>Acesse o painel →</Text></Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerMaster: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  containerSafe: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 24 
  },
  logo: { 
    fontSize: 36, 
    fontWeight: '900', 
    color: COLORS.primary, 
    marginBottom: 4, 
    textAlign: 'center', 
    letterSpacing: 3 
  },
  subtitle: { 
    fontSize: 13, 
    color: COLORS.textMuted, 
    textAlign: 'center', 
    marginBottom: 28 
  },
  loginCard: {
    width: '100%',
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  label: { 
    color: COLORS.textMain, 
    fontSize: 13, 
    fontWeight: '600', 
    marginBottom: 6 
  },
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
  primaryButtonText: { 
    color: '#fff', 
    fontSize: 15, 
    fontWeight: 'bold' 
  },
  signupLinkContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  signupText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  signupHighlight: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  footerLinkContainer: {
    marginTop: 12,
    padding: 10,
  },
  footerLinkText: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  footerLinkHighlight: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  headerVoltarContainer: {
    backgroundColor: COLORS.background,
  },
  botaoVoltar: { 
    paddingHorizontal: 20, 
    paddingTop: 10, 
    paddingBottom: 10 
  },
  textoVoltar: { 
    color: COLORS.primary, 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
});