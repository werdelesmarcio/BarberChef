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

const HORARIOS_DISPONIVEIS = [
  '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

function gerarProximosDias() {
  const dias = [];
  const hoje = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'numeric' };

  for (let i = 0; i < 7; i++) {
    const dataLoop = new Date();
    dataLoop.setDate(hoje.getDate() + i);

    const nomeFormatado = dataLoop.toLocaleDateString('pt-BR', options);
    const dataISO = dataLoop.toISOString().split('T')[0];

    dias.push({
      id: dataISO,
      label: nomeFormatado.charAt(0).toUpperCase() + nomeFormatado.slice(1)
    });
  }
  return dias;
}

export default function TelaCliente({ barbearias = [], agendamentos = [], onAgendar }: any) {
  const diasDisponiveis = gerarProximosDias();

  const [nomeCliente, setNomeCliente] = useState('');
  const [barbeariaSelecionada, setBarbeariaSelecionada] = useState<any>(barbearias[0] || null);
  const [servicoSelecionado, setServicoSelecionado] = useState<any>(null);
  const [dataSelecionada, setDataSelecionada] = useState<string>(diasDisponiveis[0].id);
  const [horarioSelecionado, setHorarioSelecionado] = useState('');

  // SÓ BLOQUEIA SE O STATUS FOR 'pendente'. Se for 'concluido' ou 'cancelado', libera o horário!
  const verificarHorarioOcupado = (hora: string) => {
    if (!barbeariaSelecionada || !dataSelecionada) return false;

    return agendamentos.some(
      (ag: any) =>
        ag.barbearia === barbeariaSelecionada.nome &&
        ag.data === dataSelecionada &&
        ag.horario === hora &&
        ag.status === 'pendente' // Bloqueia apenas se estiver aguardando atendimento
    );
  };

  const handleConfirmarAgendamento = () => {
    if (!nomeCliente.trim()) {
      Alert.alert('Atenção', 'Digite o seu nome para agendar.');
      return;
    }
    if (!barbeariaSelecionada || !servicoSelecionado || !dataSelecionada || !horarioSelecionado) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    if (verificarHorarioOcupado(horarioSelecionado)) {
      Alert.alert('Ops!', 'Este horário já está ocupado para esta data.');
      setHorarioSelecionado('');
      return;
    }

    const novoAgendamento = {
      id: Date.now().toString(),
      cliente: nomeCliente,
      barbearia: barbeariaSelecionada.nome,
      servico: servicoSelecionado.nome,
      preco: servicoSelecionado.preco,
      data: dataSelecionada,
      horario: horarioSelecionado
    };

    if (onAgendar) {
      onAgendar(novoAgendamento);
    }

    Alert.alert(
      'Agendamento Confirmado! ✂️',
      'Cliente: ' + nomeCliente + '\n' +
      'Local: ' + barbeariaSelecionada.nome + '\n' +
      'Data: ' + dataSelecionada + '\n' +
      'Horário: ' + horarioSelecionado
    );

    setHorarioSelecionado('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Agendar Atendimento</Text>
        <Text style={styles.subtitle}>Escolha a barbearia, o serviço, a data e o horário</Text>

        <Text style={styles.sectionTitle}>1. Seu Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome completo"
          placeholderTextColor="#666"
          value={nomeCliente}
          onChangeText={setNomeCliente}
        />

        <Text style={styles.sectionTitle}>2. Escolha a Barbearia</Text>
        {barbearias.map((barb: any) => {
          const selecionada = barbeariaSelecionada?.id === barb.id;
          return (
            <TouchableOpacity
              key={barb.id}
              style={[styles.card, selecionada && styles.cardSelected]}
              onPress={() => {
                setBarbeariaSelecionada(barb);
                setServicoSelecionado(null);
                setHorarioSelecionado('');
              }}
            >
              <Text style={styles.cardTitle}>💈 {barb.nome}</Text>
              <Text style={styles.cardSub}>{barb.endereco}</Text>
            </TouchableOpacity>
          );
        })}

        {barbeariaSelecionada && (
          <>
            <Text style={styles.sectionTitle}>3. Escolha o Tipo de Atendimento</Text>
            {barbeariaSelecionada.servicos.map((serv: any) => {
              const selecionado = servicoSelecionado?.id === serv.id;
              return (
                <TouchableOpacity
                  key={serv.id}
                  style={[styles.serviceItem, selecionado && styles.serviceSelected]}
                  onPress={() => setServicoSelecionado(serv)}
                >
                  <Text style={styles.serviceName}>{serv.nome}</Text>
                  <Text style={styles.servicePrice}>R$ {serv.preco}</Text>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {servicoSelecionado && (
          <>
            <Text style={styles.sectionTitle}>4. Escolha a Data</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
              {diasDisponiveis.map((dia) => {
                const selecionado = dataSelecionada === dia.id;
                return (
                  <TouchableOpacity
                    key={dia.id}
                    style={[styles.dateChip, selecionado && styles.dateChipSelected]}
                    onPress={() => {
                      setDataSelecionada(dia.id);
                      setHorarioSelecionado('');
                    }}
                  >
                    <Text style={[styles.dateText, selecionado && styles.dateTextSelected]}>
                      {dia.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </>
        )}

        {servicoSelecionado && (
          <>
            <Text style={styles.sectionTitle}>5. Escolha o Horário</Text>
            <View style={styles.timeGrid}>
              {HORARIOS_DISPONIVEIS.map((hora) => {
                const ocupado = verificarHorarioOcupado(hora);
                const selecionado = horarioSelecionado === hora;

                return (
                  <TouchableOpacity
                    key={hora}
                    disabled={ocupado}
                    style={[
                      styles.timeChip,
                      selecionado && styles.timeChipSelected,
                      ocupado && styles.timeChipOccupied
                    ]}
                    onPress={() => setHorarioSelecionado(hora)}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        selecionado && styles.timeTextSelected,
                        ocupado && styles.timeTextOccupied
                      ]}
                    >
                      {ocupado ? hora + ' (Ocupado)' : hora}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        <TouchableOpacity style={styles.primaryButton} onPress={handleConfirmarAgendamento}>
          <Text style={styles.primaryButtonText}>Confirmar Agendamento</Text>
        </TouchableOpacity>

        {agendamentos.length > 0 && (
          <View style={styles.appointmentsSection}>
            <Text style={styles.sectionTitle}>📅 Histórico de Agendamentos</Text>
            {agendamentos.map((ag: any) => (
              <View key={ag.id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.appointmentTitle}>
                    {ag.barbearia} — {ag.data} às {ag.horario}
                  </Text>
                  <Text style={styles.appointmentStatus}>
                    {ag.status === 'concluido'
                      ? '✓ Concluído'
                      : ag.status === 'cancelado'
                      ? '✕ Cancelado'
                      : '⏳ Aguardando'}
                  </Text>
                </View>
                <Text style={styles.appointmentDetail}>
                  Cliente: {ag.cliente} | {ag.servico} (R$ {ag.preco})
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollContent: { padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#3fb950', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginTop: 16, marginBottom: 10 },
  input: {
    backgroundColor: '#1f242c', color: '#fff', paddingHorizontal: 16, paddingVertical: 14,
    borderRadius: 8, fontSize: 14, borderWidth: 1, borderColor: '#333'
  },
  card: {
    backgroundColor: '#1f242c', padding: 16, borderRadius: 10, marginBottom: 10,
    borderWidth: 2, borderColor: '#333'
  },
  cardSelected: { borderColor: '#3fb950', backgroundColor: '#1a2920' },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardSub: { color: '#aaa', fontSize: 13 },
  serviceItem: {
    flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#1f242c',
    padding: 14, borderRadius: 8, marginBottom: 8, borderWidth: 2, borderColor: '#333'
  },
  serviceSelected: { borderColor: '#175ce5', backgroundColor: '#182238' },
  serviceName: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  servicePrice: { color: '#3fb950', fontSize: 15, fontWeight: 'bold' },
  dateScroll: { flexDirection: 'row', marginBottom: 8 },
  dateChip: {
    backgroundColor: '#1f242c', paddingVertical: 12, paddingHorizontal: 16,
    borderRadius: 8, borderWidth: 1, borderColor: '#444', marginRight: 10
  },
  dateChipSelected: { backgroundColor: '#175ce5', borderColor: '#175ce5' },
  dateText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  dateTextSelected: { color: '#fff' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  timeChip: {
    backgroundColor: '#1f242c', paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: 8, borderWidth: 1, borderColor: '#444', marginBottom: 8, marginRight: 8
  },
  timeChipSelected: { backgroundColor: '#3fb950', borderColor: '#3fb950' },
  timeChipOccupied: { backgroundColor: '#1a1617', borderColor: '#4d2222', opacity: 0.6 },
  timeText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  timeTextSelected: { color: '#121212' },
  timeTextOccupied: { color: '#ee6666', textDecorationLine: 'line-through' },
  primaryButton: {
    backgroundColor: '#175ce5', paddingVertical: 16, borderRadius: 12,
    alignItems: 'center', marginTop: 28
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  appointmentsSection: { marginTop: 32, borderTopWidth: 1, borderTopColor: '#333', paddingTop: 16 },
  appointmentCard: {
    backgroundColor: '#1a1f26', padding: 14, borderRadius: 8, marginBottom: 10,
    borderLeftWidth: 4, borderLeftColor: '#3fb950'
  },
  appointmentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  appointmentTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  appointmentStatus: { color: '#aaa', fontSize: 12, fontWeight: 'bold' },
  appointmentDetail: { color: '#bbb', fontSize: 13 },
});