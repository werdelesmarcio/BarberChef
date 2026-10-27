// theme.js - Padrão Visual Global do Aplicativo (Estilo Veloura / Warm Neutral & Gold)
import { StyleSheet } from 'react-native';

export const COLORS = {
  background: '#f7f4ed',      // Fundo neutro aquecido (Warm Neutral)
  surface: '#ffffff',         // Fundo dos cartões e caixas (Branco puro)
  primary: '#b58d3d',         // Tom de Ouro / Bronze Envelhecido (Ações e destaques)
  primaryActive: '#9c7c38',   // Tom de ouro mais escuro para estados ativos
  textMain: '#1a1a1a',        // Texto principal (Chumbo escuro)
  textMuted: '#888888',       // Texto secundário / legendas
  border: '#e8e2d5',          // Bordas sutis dos cards
  danger: '#ee6666',          // Alertas e cancelamentos
  success: '#3fb950',         // Confirmações e concluídos
  cardDark: '#161b22',        // Opcional para painéis escuros de barbeiro
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: COLORS.surface,
    color: COLORS.textMain,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
});