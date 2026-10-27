import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_CLIENTE = '@barberapp_dados_cliente';

export default function MeusAgendamentos({ agendamentos = [], onVoltar }: any) {
  const [nomeClienteLogado, setNomeClienteLogado] = useState('');

  // Carrega o nome do cliente logado na memória do celular
  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const dadosSalvos = await AsyncStorage.getItem(STORAGE_KEY_CLIENTE);
        if (dadosSalvos !== null) {
          const perfil = JSON.parse(dadosSalvos);
          if (perfil.nome) {
            setNomeClienteLogado(perfil.nome.trim().toLowerCase());
          }
        }
      } catch (erro) {
        console.log('Erro ao carregar perfil do cliente:', erro);
      }
    };
    carregarPerfil();
  }, []);

  // Filtra apenas os agendamentos pertencentes a este cliente
  const meusAgendamentos = agendamentos.filter((ag: any) => {
    if (!nomeClienteLogado) return false;
    return ag.cliente && ag.cliente.trim().toLowerCase() === nomeClienteLogado;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={onVoltar}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>📅 Meus Agendamentos</Text>
        <Text style={styles.subtitle}>
          {nomeClienteLogado 
            ? 'Exibindo agendamentos para: ' + nomeClienteLogado 
            : 'Cadastre seu nome na tela "Meu Perfil" para ver seus horários'}
        </Text>

        {meusAgendamentos.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Você ainda não possui agendamentos cadastrados.</Text>
          </View>
        ) : (
          meusAgendamentos.map((ag: any) => {
            const isConcluido = ag.status === 'concluido';
            const isCancelado = ag.status === 'cancelado';
            const isPendente = ag.status === 'pendente' || !ag.status;

            return (
              <View
                key={ag.id}
                style={[
                  styles.appointmentCard,
                  isConcluido && styles.cardConcluido,
                  isCancelado && styles.cardCancelado
                ]}
              >
                <View style={styles.appointmentHeader}>
                  <Text style={styles.appointmentTitle}>
                    💈 {ag.barbearia}
                  </Text>
                  <Text
                    style={[
                      styles.statusBadge,
                      isPendente && styles.statusPendente,
                      isConcluido && styles.statusConcluido,
                      isCancelado && styles.statusCancelado
                    ]}
                  >
                    {isPendente ? 'AGUARDANDO' : isConcluido ? 'CONCLUÍDO' : 'CANCELADO'}
                  </Text>
                </View>

                <Text style={styles.appointmentDetail}>
                  📅 Data: <Text style={styles.boldText}>{ag.data || 'Hoje'}</Text> às <Text style={styles.boldText}>{ag.horario}</Text>
                </Text>
                <Text style={styles.appointmentDetail}>
                  ✂️ Serviço: <Text style={styles.boldText}>{ag.servico}</Text> (R$ {ag.preco})
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollContent: { padding: 24 },
  backButton: { marginBottom: 16 },
  backButtonText: { color: '#175ce5', fontSize: 15, fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#3fb950', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#888', marginBottom: 24 },
  emptyBox: { backgroundColor: '#1a1f26', padding: 24, borderRadius: 10, alignItems: 'center' },
  emptyText: { color: '#777', fontSize: 14, textAlign: 'center' },
  appointmentCard: {
    backgroundColor: '#1f242c', padding: 16, borderRadius: 10,
    marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#fac858'
  },
  cardConcluido: { borderLeftColor: '#3fb950', opacity: 0.85 },
  cardCancelado: { borderLeftColor: '#ee6666', opacity: 0.6 },
  appointmentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  appointmentTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  statusBadge: { fontSize: 11, fontWeight: 'bold', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  statusPendente: { backgroundColor: '#3b3218', color: '#fac858' },
  statusConcluido: { backgroundColor: '#1a3322', color: '#3fb950' },
  statusCancelado: { backgroundColor: '#3b1c1c', color: '#ee6666' },
  appointmentDetail: { color: '#ccc', fontSize: 14, marginBottom: 4 },
  boldText: { color: '#fff', fontWeight: 'bold' },
});