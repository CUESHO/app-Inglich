import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useGameStore } from '../store/useGameStore';

export default function HomeScreen() {
  const { userId, userLevel, userXP, userCoins } = useGameStore();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fast English</Text>
        <Text style={styles.subtitle}>¡Aprende Inglés Jugando!</Text>
      </View>

      {userId ? (
        <View style={styles.userSection}>
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Nivel</Text>
              <Text style={styles.statValue}>{userLevel}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>XP</Text>
              <Text style={styles.statValue}>{userXP}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Monedas</Text>
              <Text style={styles.statValue}>{userCoins}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Continuar Jugando</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.loginSection}>
          <Text style={styles.loginText}>Inicia sesión para comenzar tu aventura</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Text style={styles.secondaryButtonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2FE',
  },
  header: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#D97706',
    fontWeight: '600',
  },
  userSection: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  statBox: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#1E3A8A',
    fontWeight: '600',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    color: '#D97706',
    fontWeight: '900',
  },
  loginSection: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 18,
    color: '#1E3A8A',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#D97706',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1E3A8A',
  },
  secondaryButtonText: {
    fontSize: 16,
    color: '#1E3A8A',
    fontWeight: '700',
  },
});
