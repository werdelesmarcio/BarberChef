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

export default function RatingScreen({ agendamento, onEnviarAvaliacao, onVoltar }: any) {
  const [nota, setNota] = useState(5); // Padrão 5 estrelas
  const [comentario, setComentario] = useState('');

  const handleEnviar = () => {
    if (!comentario.trim()) {
      Alert.alert('Atenção', 'Escreva um breve comentário sobre o atendimento.');
      return;
    }

    const avaliacao = {
      nota,
      comentario,
      dataAvaliacao: new Date().toLocaleDateString('pt-BR')
    };

    if (onEnviarAvaliacao) {
      onEnviarAvaliacao(agendamento.id, avaliacao);
    }

    Alert.alert('Obrigado! ⭐', 'Sua avaliação foi enviada com sucesso.');
    onVoltar();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onVoltar} style={styles.backButtonCircle}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.brandTitle}>RATING & REVIEW</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.salonName}>💈 {agendamento?.barbearia || 'Estabelecimento'}</Text>
        <Text style={styles.serviceInfo}>Serviço: {agendamento?.servico}</Text>
        <Text style={styles.questionText}>Como foi a sua experiência?</Text>

        {/* Seletor de Estrelas Interativo */}
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setNota(star)}>
              <Text style={styles.starText}>{star <= nota ? '⭐' : '☆'}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.notaLabel}>{nota} de 5 estrelas</Text>

        {/* Caixa de Texto para Review */}
        <TextInput
          style={styles.textArea}
          placeholder="Conte como foi o atendimento, pontualidade e resultado..."
          placeholderTextColor="#666"
          multiline
          numberOfLines={4}
          value={comentario}
          onChangeText={setComentario}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleEnviar}>
          <Text style={styles.primaryButtonText}>Enviar Avaliação</Text>
        </TouchableOpacity>
      </View>
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
  content: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  salonName: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' },
  serviceInfo: { color: '#8b949e', fontSize: 14, marginBottom: 24 },
  questionText: { color: '#c9d1d9', fontSize: 16, fontWeight: '600', marginBottom: 16 },
  starsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  starText: { fontSize: 36 },
  notaLabel: { color: '#a370f0', fontSize: 13, fontWeight: 'bold', marginBottom: 24 },
  textArea: {
    width: '100%', backgroundColor: '#161b22', color: '#fff', padding: 16,
    borderRadius: 12, fontSize: 14, height: 120, borderWidth: 1, borderColor: '#30363d',
    textAlignVertical: 'top', marginBottom: 24,
  },
  primaryButton: {
    width: '100%', backgroundColor: '#a370f0', paddingVertical: 16,
    borderRadius: 12, alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});