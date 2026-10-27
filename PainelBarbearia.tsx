import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert
} from 'react-native';

import { COLORS } from './theme';

function formatarData(dataISO: string) {
  if (!dataISO) return 'Hoje';
  const partes = dataISO.split('-');
  if (partes.length !== 3) return dataISO;
  return partes[2] + '/' + partes[1] + '/' + partes[0];
}

export default function PainelBarbearia({
  agendamentos = [],
  barbearias = [],
  onAtualizarStatus
}: any) {
  const [filtro, setFiltro] = useState('todos');

  const totalAtendimentos = agendamentos.length;
  const pendentes = agendamentos.filter((a: any) => a.status === 'pendente').length;
  const concluidos = agendamentos.filter((a: any) => a.status === 'concluido').length;
  const cancelados = agendamentos.filter((a: any) => a.status === 'cancelado').length;

  // Cálculo das porcentagens para o mini-gráfico de barras
  const porcentagemConcluidos = totalAtendimentos > 0 ? (concluidos / totalAtendimentos) * 100 : 0;
  const porcentagemPendentes = totalAtendimentos > 0 ? (pendentes / totalAtendimentos) * 100 : 0;
  const porcentagemCancelados = totalAtendimentos > 0 ? (cancelados / totalAtendimentos) * 100 : 0;

  // Cálculo do Faturamento
  const faturamento = agendamentos
    .filter((a: any) => a.status === 'concluido')
    .reduce((total: number, item: any) => {
      const valorNumerico = parseFloat(String(item.preco).replace(',', '.')) || 0;
      return total + valorNumerico;
    }, 0);

  // Top 10 Usuários/Clientes mais frequentes
  const contagemClientes: { [key: string]: number } = {};
  agendamentos.forEach((item: any) => {
    if (item.cliente) {
      const nomeCliente = item.cliente.trim();
      contagemClientes[nomeCliente] = (contagemClientes[nomeCliente] || 0) + 1;
    }
  });

  const topUsuarios = Object.keys(contagemClientes)
    .map((nome) => ({ nome, total: contagemClientes[nome] }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const listaFiltrada = agendamentos.filter((item: any) => {
    if (filtro === 'todos') return true;
    return item.status === filtro;
  });

  const handleSolicitarPagamentoEConcluir = (item: any) => {
    Alert.alert(
      'Encerrar Atendimento 💳',
      `Serviço: ${item.servico}\nValor: R$ ${item.preco}\n\nEscolha a forma de pagamento do cliente:`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: '💵 Dinheiro',
          onPress: () => onAtualizarStatus && onAtualizarStatus(item.id, 'concluido', 'Dinheiro')
        },
        {
          text: '💠 PIX',
          onPress: () => onAtualizarStatus && onAtualizarStatus(item.id, 'concluido', 'PIX')
        },
        {
          text: '💳 Cartão',
          onPress: () => onAtualizarStatus && onAtualizarStatus(item.id, 'concluido', 'Cartão')
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Painel Administrativo</Text>
            <Text style={styles.subtitle}>
              Métricas e Gestão de Caixa
            </Text>
          </View>
        </View>

        {/* Resumo / Cards Numéricos */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalAtendimentos}</Text>
            <Text style={styles.statLabel}>Total Atend.</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: COLORS.success }]}>{concluidos}</Text>
            <Text style={styles.statLabel}>Concluídos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: COLORS.primary }]}>
              R$ {faturamento.toFixed(2).replace('.', ',')}
            </Text>
            <Text style={styles.statLabel}>Caixa</Text>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* GRÁFICO DE BARRAS PROPORCIONAL (Pagamentos e Status dos Atendimentos)     */}
        {/* ========================================================================= */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>📊 Status dos Atendimentos</Text>
          
          <View style={styles.barBackground}>
            {porcentagemConcluidos > 0 && (
              <View style={[styles.barSegment, { flex: porcentagemConcluidos, backgroundColor: '#3fb950' }]} />
            )}
            {porcentagemPendentes > 0 && (
              <View style={[styles.barSegment, { flex: porcentagemPendentes, backgroundColor: COLORS.primary }]} />
            )}
            {porcentagemCancelados > 0 && (
              <View style={[styles.barSegment, { flex: porcentagemCancelados, backgroundColor: COLORS.danger }]} />
            )}
            {totalAtendimentos === 0 && (
              <View style={[styles.barSegment, { flex: 100, backgroundColor: COLORS.border }]} />
            )}
          </View>

          <View style={styles.chartLegendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#3fb950' }]} />
              <Text style={styles.legendText}>Concluídos ({concluidos})</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.legendText}>Pendentes ({pendentes})</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.danger }]} />
              <Text style={styles.legendText}>Cancelados ({cancelados})</Text>
            </View>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* TOP 10 USUÁRIOS / CLIENTES MAIS FREQUENTES                              */}
        {/* ========================================================================= */}
        <View style={styles.topUsersContainer}>
          <Text style={styles.sectionTitle}>🏆 Top 10 Clientes Frequentes</Text>
          {topUsuarios.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum cliente registrado ainda.</Text>
          ) : (
            topUsuarios.map((user, index) => (
              <View key={index} style={styles.userRankRow}>
                <View style={styles.userRankBadge}>
                  <Text style={styles.userRankNumber}>#{index + 1}</Text>
                </View>
                <Text style={styles.userRankName}>{user.nome}</Text>
                <Text style={styles.userRankCount}>{user.total} atendimento(s)</Text>
              </View>
            ))
          )}
        </View>

        {/* Filtros da Agenda */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, filtro === 'todos' && styles.filterChipActive]}
            onPress={() => setFiltro('todos')}
          >
            <Text style={[styles.filterText, filtro === 'todos' && { color: '#fff' }]}>Todos ({agendamentos.length})</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filtro === 'pendente' && styles.filterChipActive]}
            onPress={() => setFiltro('pendente')}
          >
            <Text style={[styles.filterText, filtro === 'pendente' && { color: '#fff' }]}>Pendentes ({pendentes})</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filtro === 'concluido' && styles.filterChipActive]}
            onPress={() => setFiltro('concluido')}
          >
            <Text style={[styles.filterText, filtro === 'concluido' && { color: '#fff' }]}>Concluídos ({concluidos})</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Agenda de Atendimentos</Text>

        {listaFiltrada.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Nenhum atendimento encontrado neste filtro.</Text>
          </View>
        ) : (
          listaFiltrada.map((item: any) => {
            const isPendente = item.status === 'pendente';
            const isConcluido = item.status === 'concluido';
            const isCancelado = item.status === 'cancelado';

            return (
              <View
                key={item.id}
                style={[
                  styles.card,
                  isConcluido && styles.cardConcluido,
                  isCancelado && styles.cardCancelado
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.timeBadge}>📅 {formatarData(item.data)} às {item.horario}</Text>
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

                <Text style={styles.clientName}>👤 {item.cliente}</Text>
                <Text style={styles.serviceInfo}>
                  ✂️ {item.servico} — <Text style={styles.priceText}>R$ {item.preco}</Text>
                </Text>
                <Text style={styles.barberInfo}>💈 {item.barbearia}</Text>

                {isConcluido && item.formaPagamento && (
                  <Text style={styles.paymentInfo}>💳 Pago via: <Text style={{fontWeight: 'bold'}}>{item.formaPagamento}</Text></Text>
                )}

                {isPendente && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.completeButton]}
                      onPress={() => handleSolicitarPagamentoEConcluir(item)}
                    >
                      <Text style={styles.actionButtonText}>✓ Encerrar / Pagar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.cancelButton]}
                      onPress={() => onAtualizarStatus && onAtualizarStatus(item.id, 'cancelado')}
                    >
                      <Text style={styles.actionButtonText}>✕ Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.textMain },
  subtitle: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statCard: {
    flex: 1, backgroundColor: COLORS.surface, padding: 12, borderRadius: 14,
    alignItems: 'center', marginHorizontal: 4, borderWidth: 1, borderColor: COLORS.border
  },
  statNumber: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 4 },
  statLabel: { fontSize: 11, color: COLORS.textMuted },
  chartContainer: {
    backgroundColor: COLORS.surface, padding: 16, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 20,
  },
  chartTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 12 },
  barBackground: {
    height: 14, backgroundColor: COLORS.background, borderRadius: 7,
    flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border, marginBottom: 12,
  },
  barSegment: { height: '100%' },
  chartLegendRow: { flexDirection: 'row', justifyContent: 'space-around' },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  topUsersContainer: {
    backgroundColor: COLORS.surface, padding: 16, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 20,
  },
  userRankRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: COLORS.background,
  },
  userRankBadge: { width: 30, alignItems: 'center' },
  userRankNumber: { fontSize: 13, fontWeight: 'bold', color: COLORS.primary },
  userRankName: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.textMain },
  userRankCount: { fontSize: 12, color: COLORS.textMuted, fontWeight: 'bold' },
  filterRow: { flexDirection: 'row', marginBottom: 16 },
  filterChip: {
    backgroundColor: COLORS.surface, paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: COLORS.border
  },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { color: COLORS.textMain, fontSize: 12, fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 12 },
  emptyBox: { backgroundColor: COLORS.surface, padding: 24, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  emptyText: { color: COLORS.textMuted, fontSize: 14 },
  card: {
    backgroundColor: COLORS.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 12
  },
  cardConcluido: { borderLeftWidth: 4, borderLeftColor: COLORS.success, opacity: 0.9 },
  cardCancelado: { borderLeftWidth: 4, borderLeftColor: COLORS.danger, opacity: 0.6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  timeBadge: { color: COLORS.textMain, fontWeight: 'bold', fontSize: 13 },
  statusBadge: { fontSize: 11, fontWeight: 'bold', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  statusPendente: { backgroundColor: '#fdf3e2', color: COLORS.primary },
  statusConcluido: { backgroundColor: '#eef9f0', color: COLORS.success },
  statusCancelado: { backgroundColor: '#fde8e8', color: COLORS.danger },
  clientName: { color: COLORS.textMain, fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  serviceInfo: { color: COLORS.textMuted, fontSize: 14, marginBottom: 4 },
  priceText: { color: COLORS.primary, fontWeight: 'bold' },
  barberInfo: { color: COLORS.textMuted, fontSize: 12, marginBottom: 8 },
  paymentInfo: { color: COLORS.textMain, fontSize: 12, backgroundColor: COLORS.background, padding: 6, borderRadius: 6, marginBottom: 10 },
  actionRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 8,
    borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 12
  },
  actionButton: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginHorizontal: 4 },
  completeButton: { backgroundColor: COLORS.success },
  cancelButton: { backgroundColor: COLORS.danger },
  actionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});