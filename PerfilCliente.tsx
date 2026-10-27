import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from './theme';

const STORAGE_KEY_CLIENTE = '@barberapp_dados_cliente';

const HORARIOS_DISPONIVEIS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'
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
      label: nomeFormatado.charAt(0).toUpperCase() + nomeFormatado.slice(1),
      diaNum: dataLoop.getDate().toString()
    });
  }
  return dias;
}

export default function PerfilCliente({
  barbearias = [],
  agendamentos = [],
  onAgendar,
  onAbrirAvaliacao,
  onAbrirMapa,
  onVoltar
}: any) {
  const diasDisponiveis = gerarProximosDias();

  // Informações Pessoais
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [editandoPerfil, setEditandoPerfil] = useState(false);

  // Abas de Navegação ('home', 'search', 'booking', 'my_bookings')
  const [abaAtiva, setAbaAtiva] = useState('home');

  // Fluxo de Agendamento
  const [barbeariaSelecionada, setBarbeariaSelecionada] = useState<any>(barbearias[0] || null);
  const [servicoSelecionado, setServicoSelecionado] = useState<any>(null);
  const [dataSelecionada, setDataSelecionada] = useState<string>(diasDisponiveis[0].id);
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [termoBusca, setTermoBusca] = useState('');

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const dadosSalvos = await AsyncStorage.getItem(STORAGE_KEY_CLIENTE);
        if (dadosSalvos !== null) {
          const perfil = JSON.parse(dadosSalvos);
          if (perfil.nome) setNome(perfil.nome);
          if (perfil.telefone) setTelefone(perfil.telefone);
        }
      } catch (erro) {
        console.log('Erro ao carregar perfil:', erro);
      }
    };
    carregarPerfil();
  }, []);

  const handleSalvarPerfil = async () => {
    if (!nome.trim() || !telefone.trim()) {
      Alert.alert('Atenção', 'Nome e telefone são obrigatórios.');
      return;
    }
    try {
      const perfil = { nome, telefone };
      await AsyncStorage.setItem(STORAGE_KEY_CLIENTE, JSON.stringify(perfil));
      setEditandoPerfil(false);
      Alert.alert('Sucesso', 'Informações pessoais atualizadas!');
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível salvar.');
    }
  };

  const meusAgendamentos = agendamentos.filter((ag: any) => {
    if (!nome) return false;
    return ag.cliente && ag.cliente.trim().toLowerCase() === nome.trim().toLowerCase();
  });

  const totalConcluidos = meusAgendamentos.filter((a: any) => a.status === 'concluido').length;
  const totalPendentes = meusAgendamentos.filter((a: any) => a.status === 'pendente' || !a.status).length;

  const verificarHorarioOcupado = (hora: string) => {
    if (!barbeariaSelecionada || !dataSelecionada) return false;
    return agendamentos.some(
      (ag: any) =>
        ag.barbearia === barbeariaSelecionada.nome &&
        ag.data === dataSelecionada &&
        ag.horario === hora &&
        ag.status === 'pendente'
    );
  };

  const handleConfirmarAgendamento = () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Configure seu nome nas Informações Pessoais antes de agendar.');
      return;
    }
    if (!barbeariaSelecionada || !servicoSelecionado || !dataSelecionada || !horarioSelecionado) {
      Alert.alert('Atenção', 'Selecione o salão, serviço, data e horário.');
      return;
    }

    if (verificarHorarioOcupado(horarioSelecionado)) {
      Alert.alert('Horário Ocupado', 'Este horário já foi reservado. Escolha outro.');
      setHorarioSelecionado('');
      return;
    }

    const novoAgendamento = {
      id: Date.now().toString(),
      cliente: nome,
      telefone: telefone,
      barbearia: barbeariaSelecionada.nome,
      servico: servicoSelecionado.nome,
      preco: servicoSelecionado.preco,
      data: dataSelecionada,
      horario: horarioSelecionado,
      status: 'pendente'
    };

    if (onAgendar) {
      onAgendar(novoAgendamento);
    }

    Alert.alert('Reserva Confirmada ✨', 'Seu agendamento foi concluído com sucesso.');
    setHorarioSelecionado('');
    setAbaAtiva('my_bookings');
  };

  const barbeariasFiltradas = barbearias.filter((b: any) =>
    b.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    b.endereco.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar Estilizada */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onVoltar} style={styles.backButtonCircle}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.brandTitle}>VELOURA</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card / Informações Pessoais */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>👑</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{nome || 'Visitante'}</Text>
            <Text style={styles.profileDetail}>📞 {telefone || 'Adicionar telefone'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.settingsButton} 
            onPress={() => setEditandoPerfil(!editandoPerfil)}
          >
            <Text style={styles.settingsButtonText}>⚙️ Settings</Text>
          </TouchableOpacity>
        </View>

        {editandoPerfil && (
          <View style={styles.cardBox}>
            <Text style={styles.cardHeaderTitle}>Personal Info & Settings</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome Completo"
              placeholderTextColor="#888"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              style={styles.input}
              placeholder="Telefone / WhatsApp"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={telefone}
              onChangeText={setTelefone}
            />
            <TouchableOpacity style={styles.mainButton} onPress={handleSalvarPerfil}>
              <Text style={styles.mainButtonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalConcluidos}</Text>
            <Text style={styles.statLabel}>Concluídos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: COLORS.primary }]}>{totalPendentes}</Text>
            <Text style={styles.statLabel}>Agendados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#3fb950' }]}>R$ 0</Text>
            <Text style={styles.statLabel}>Cashback</Text>
          </View>
        </View>

        {/* Menu de Abas */}
        <View style={styles.navigationTabs}>
          <TouchableOpacity
            style={[styles.navTab, abaAtiva === 'home' && styles.navTabActive]}
            onPress={() => setAbaAtiva('home')}
          >
            <Text style={[styles.navTabText, abaAtiva === 'home' && styles.navTabTextActive]}>🏠 Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navTab, abaAtiva === 'search' && styles.navTabActive]}
            onPress={() => setAbaAtiva('search')}
          >
            <Text style={[styles.navTabText, abaAtiva === 'search' && styles.navTabTextActive]}>🔍 Search</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navTab, abaAtiva === 'my_bookings' && styles.navTabActive]}
            onPress={() => setAbaAtiva('my_bookings')}
          >
            <Text style={[styles.navTabText, abaAtiva === 'my_bookings' && styles.navTabTextActive]}>📅 My Booking</Text>
          </TouchableOpacity>
        </View>

        {/* ABA HOME */}
        {abaAtiva === 'home' && (
          <View>
            <Text style={styles.sectionHeading}>Destaques Próximos (Nearby)</Text>
            {barbearias.map((barb: any) => (
              <View key={barb.id} style={styles.salonCard}>
                <TouchableOpacity
                  onPress={() => {
                    setBarbeariaSelecionada(barb);
                    setAbaAtiva('booking');
                  }}
                >
                  <View style={styles.salonBadge}><Text style={styles.salonBadgeText}>⭐ 4.9</Text></View>
                  <Text style={styles.salonTitle}>💈 {barb.nome}</Text>
                  <Text style={styles.salonSubtitle}>📍 {barb.endereco}</Text>
                </TouchableOpacity>

                <View style={styles.salonCardFooter}>
                  <TouchableOpacity 
                    style={styles.mapLinkButton} 
                    onPress={() => onAbrirMapa && onAbrirMapa(barb)}
                  >
                    <Text style={styles.mapLinkText}>🗺️ Ver no Mapa</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.bookNowMiniBtn}
                    onPress={() => {
                      setBarbeariaSelecionada(barb);
                      setAbaAtiva('booking');
                    }}
                  >
                    <Text style={styles.bookNowMiniText}>Explorar Serviços →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ABA SEARCH */}
        {abaAtiva === 'search' && (
          <View>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nome ou região..."
              placeholderTextColor="#888"
              value={termoBusca}
              onChangeText={setTermoBusca}
            />
            <Text style={styles.sectionHeading}>Resultados da Busca</Text>
            {barbeariasFiltradas.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum salão encontrado.</Text>
            ) : (
              barbeariasFiltradas.map((barb: any) => (
                <View key={barb.id} style={styles.salonCard}>
                  <TouchableOpacity
                    onPress={() => {
                      setBarbeariaSelecionada(barb);
                      setAbaAtiva('booking');
                    }}
                  >
                    <Text style={styles.salonTitle}>💈 {barb.nome}</Text>
                    <Text style={styles.salonSubtitle}>📍 {barb.endereco}</Text>
                  </TouchableOpacity>

                  <View style={styles.salonCardFooter}>
                    <TouchableOpacity 
                      style={styles.mapLinkButton} 
                      onPress={() => onAbrirMapa && onAbrirMapa(barb)}
                    >
                      <Text style={styles.mapLinkText}>🗺️ Ver no Mapa</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.bookNowMiniBtn}
                      onPress={() => {
                        setBarbeariaSelecionada(barb);
                        setAbaAtiva('booking');
                      }}
                    >
                      <Text style={styles.bookNowMiniText}>Explorar Serviços →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* FLUXO DE RESERVA */}
        {abaAtiva === 'booking' && (
          <View style={styles.bookingFlowContainer}>
            <View style={styles.selectedSalonBanner}>
              <Text style={styles.selectedSalonTitle}>Estabelecimento: {barbeariaSelecionada?.nome}</Text>
              <TouchableOpacity onPress={() => setAbaAtiva('home')}>
                <Text style={styles.changeSalonText}>[Trocar]</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionHeading}>Xizmat turini tanlang</Text>
            <View style={styles.servicesRowGrid}>
              {barbeariaSelecionada?.servicos?.map((serv: any) => {
                const selecionado = servicoSelecionado?.id === serv.id;
                return (
                  <TouchableOpacity
                    key={serv.id}
                    style={[styles.serviceCardGrid, selecionado && styles.serviceCardGridActive]}
                    onPress={() => setServicoSelecionado(serv)}
                  >
                    <Text style={styles.serviceTitleGrid}>{serv.nome}</Text>
                    <Text style={styles.serviceDurationGrid}>30 min</Text>
                    <Text style={styles.servicePriceGrid}>R$ {serv.preco}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {servicoSelecionado && (
              <>
                <Text style={styles.sectionHeading}>Sanani tanlang (Data)</Text>
                <View style={styles.dateCardContainer}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesScroll}>
                    {diasDisponiveis.map((dia) => {
                      const selecionado = dataSelecionada === dia.id;
                      return (
                        <TouchableOpacity
                          key={dia.id}
                          style={[styles.dateChip, selecionado && styles.dateChipActive]}
                          onPress={() => {
                            setDataSelecionada(dia.id);
                            setHorarioSelecionado('');
                          }}
                        >
                          <Text style={[styles.dateChipNumber, selecionado && styles.dateChipTextActive]}>
                            {dia.diaNum}
                          </Text>
                          <Text style={[styles.dateChipSub, selecionado && styles.dateChipTextActive]}>
                            {dia.label.split(',')[0]}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                <Text style={styles.sectionHeading}>Vaqtni tanlang (Horário)</Text>
                <View style={styles.timeCardContainer}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timesScroll}>
                    {HORARIOS_DISPONIVEIS.map((hora) => {
                      const ocupado = verificarHorarioOcupado(hora);
                      const selecionado = horarioSelecionado === hora;
                      return (
                        <TouchableOpacity
                          key={hora}
                          disabled={ocupado}
                          style={[
                            styles.timeChip,
                            selecionado && styles.timeChipActive,
                            ocupado && styles.timeChipOccupied
                          ]}
                          onPress={() => setHorarioSelecionado(hora)}
                        >
                          <Text style={[styles.timeChipText, selecionado && styles.timeChipTextActive, ocupado && styles.timeChipTextOccupied]}>
                            {ocupado ? `${hora} (Ocupado)` : hora}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                <TouchableOpacity style={styles.mainActionButton} onPress={handleConfirmarAgendamento}>
                  <Text style={styles.mainActionText}>Saqlash (Confirmar Agendamento)</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* ABA MY BOOKINGS */}
        {abaAtiva === 'my_bookings' && (
          <View>
            <Text style={styles.sectionHeading}>Histórico de Agendamentos</Text>
            {meusAgendamentos.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Nenhum agendamento ativo ou passado.</Text>
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
                    <View style={styles.appointmentCardHeader}>
                      <Text style={styles.appointmentSalonName}>💈 {ag.barbearia}</Text>
                      <Text style={[
                        styles.statusBadgeText,
                        isPendente && { color: COLORS.primary },
                        isConcluido && { color: '#3fb950' },
                        isCancelado && { color: '#ee6666' }
                      ]}>
                        {isPendente ? 'PENDENTE' : isConcluido ? 'CONCLUÍDO' : 'CANCELADO'}
                      </Text>
                    </View>
                    <Text style={styles.appointmentInfoText}>📅 Data: {ag.data} às {ag.horario}</Text>
                    <Text style={styles.appointmentInfoText}>✂️ Serviço: {ag.servico} (R$ {ag.preco})</Text>

                    {isConcluido && ag.formaPagamento && (
                      <Text style={styles.appointmentInfoText}>
                        💳 Forma de Pagamento: <Text style={{fontWeight: 'bold', color: COLORS.textMain}}>{ag.formaPagamento}</Text>
                      </Text>
                    )}

                    {isConcluido && !ag.avaliacao && (
                      <TouchableOpacity 
                        style={styles.rateButton} 
                        onPress={() => onAbrirAvaliacao && onAbrirAvaliacao(ag)}
                      >
                        <Text style={styles.rateButtonText}>⭐ Avaliar Serviço & Rebook</Text>
                      </TouchableOpacity>
                    )}

                    {ag.avaliacao && (
                      <Text style={styles.ratedText}>⭐ Avaliado com nota {ag.avaliacao.nota}/5</Text>
                    )}
                  </View>
                );
              })
            )}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
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
  scrollContent: { padding: 20, paddingBottom: 40 },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    padding: 16, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 16,
  },
  avatarContainer: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: '#fcfbfa',
    justifyContent: 'center', alignItems: 'center', marginRight: 14, borderWidth: 1, borderColor: COLORS.primary,
  },
  avatarEmoji: { fontSize: 24 },
  profileInfo: { flex: 1 },
  profileName: { color: COLORS.textMain, fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
  profileDetail: { color: COLORS.textMuted, fontSize: 13 },
  settingsButton: {
    backgroundColor: '#fcfbfa', paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.border,
  },
  settingsButtonText: { color: COLORS.textMain, fontSize: 12, fontWeight: '600' },
  cardBox: {
    backgroundColor: COLORS.surface, padding: 16, borderRadius: 16, marginBottom: 16,
    borderWidth: 1, borderColor: COLORS.border,
  },
  cardHeaderTitle: { color: COLORS.textMain, fontSize: 15, fontWeight: 'bold', marginBottom: 12 },
  input: {
    backgroundColor: COLORS.background, color: COLORS.textMain, paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: 12, fontSize: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border,
  },
  mainButton: { backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 4 },
  mainButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: COLORS.surface, padding: 12, borderRadius: 14,
    alignItems: 'center', marginHorizontal: 4, borderWidth: 1, borderColor: COLORS.border,
  },
  statValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 2 },
  statLabel: { fontSize: 11, color: COLORS.textMuted },
  navigationTabs: {
    flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 14,
    padding: 4, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border,
  },
  navTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  navTabActive: { backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border },
  navTabText: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600' },
  navTabTextActive: { color: COLORS.textMain, fontWeight: 'bold' },
  sectionHeading: { color: COLORS.textMain, fontSize: 16, fontWeight: 'bold', marginBottom: 12, marginTop: 4 },
  salonCard: {
    backgroundColor: COLORS.surface, padding: 16, borderRadius: 16, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  salonBadge: {
    alignSelf: 'flex-start', backgroundColor: COLORS.background, paddingHorizontal: 8,
    paddingVertical: 3, borderRadius: 6, marginBottom: 6,
  },
  salonBadgeText: { color: COLORS.primary, fontSize: 11, fontWeight: 'bold' },
  salonTitle: { color: COLORS.textMain, fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  salonSubtitle: { color: COLORS.textMuted, fontSize: 13, marginBottom: 8 },
  salonCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, borderTopWidth: 1, borderTopColor: COLORS.background, paddingTop: 10 },
  mapLinkButton: { paddingVertical: 4 },
  mapLinkText: { color: COLORS.primary, fontSize: 13, fontWeight: 'bold' },
  bookNowMiniBtn: { alignSelf: 'flex-end' },
  bookNowMiniText: { color: COLORS.primary, fontSize: 13, fontWeight: 'bold' },
  searchInput: {
    backgroundColor: COLORS.surface, color: COLORS.textMain, paddingHorizontal: 16, paddingVertical: 14,
    borderRadius: 14, fontSize: 14, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border,
  },
  emptyBox: { backgroundColor: COLORS.surface, padding: 24, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  emptyText: { color: COLORS.textMuted, fontSize: 13 },
  bookingFlowContainer: {
    backgroundColor: COLORS.surface, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border,
  },
  selectedSalonBanner: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.background, padding: 10, borderRadius: 10, marginBottom: 14,
  },
  selectedSalonTitle: { color: COLORS.textMain, fontSize: 13, fontWeight: 'bold' },
  changeSalonText: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold' },
  servicesRowGrid: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  serviceCardGrid: {
    flex: 1, backgroundColor: COLORS.background, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  serviceCardGridActive: { borderColor: COLORS.primary, borderWidth: 1.5 },
  serviceTitleGrid: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 4 },
  serviceDurationGrid: { fontSize: 11, color: COLORS.textMuted, marginBottom: 8 },
  servicePriceGrid: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary },
  dateCardContainer: {
    backgroundColor: COLORS.background, borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 16,
  },
  datesScroll: { gap: 8 },
  dateChip: {
    width: 48, height: 60, borderRadius: 12, backgroundColor: COLORS.surface,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  dateChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dateChipNumber: { fontSize: 15, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 2 },
  dateChipSub: { fontSize: 10, color: COLORS.textMuted },
  dateChipTextActive: { color: '#fff' },
  timeCardContainer: {
    backgroundColor: COLORS.background, borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 20,
  },
  timesScroll: { gap: 8 },
  timeChip: {
    paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
  },
  timeChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  timeChipOccupied: { backgroundColor: '#fde8e8', borderColor: '#f5c6cb' },
  timeChipText: { fontSize: 13, fontWeight: '600', color: COLORS.textMain },
  timeChipTextActive: { color: '#fff' },
  timeChipTextOccupied: { color: '#ee6666', textDecorationLine: 'line-through' },
  mainActionButton: {
    backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 16,
    alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  mainActionText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  appointmentCard: {
    backgroundColor: COLORS.surface, padding: 16, borderRadius: 16, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 4, borderLeftColor: COLORS.primary,
  },
  cardConcluido: { borderLeftColor: '#3fb950' },
  cardCancelado: { borderLeftColor: '#ee6666', opacity: 0.7 },
  appointmentCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  appointmentSalonName: { color: COLORS.textMain, fontSize: 15, fontWeight: 'bold' },
  statusBadgeText: { fontSize: 11, fontWeight: 'bold' },
  appointmentInfoText: { color: COLORS.textMuted, fontSize: 13, marginBottom: 2 },
  rateButton: {
    backgroundColor: COLORS.background, paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: 10, borderWidth: 1, borderColor: COLORS.primary, marginTop: 10, alignItems: 'center'
  },
  rateButtonText: { color: COLORS.primary, fontSize: 13, fontWeight: 'bold' },
  ratedText: { color: '#3fb950', fontSize: 12, fontWeight: 'bold', marginTop: 8 }
});