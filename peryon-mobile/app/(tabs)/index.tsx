import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Text, Button, useTheme, Appbar } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen(): JSX.Element {
  const theme = useTheme();
  const { user, isAuthenticated, login, logout } = useAuth();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    welcomeCard: {
      marginBottom: 16,
    },
    statsCard: {
      marginBottom: 16,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    loginContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    loginCard: {
      width: '100%',
      padding: 24,
    },
  });

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="Peryon" />
        </Appbar.Header>
        <View style={styles.loginContainer}>
          <Card style={styles.loginCard}>
            <Card.Content>
              <Text variant="headlineSmall" style={{ textAlign: 'center', marginBottom: 16 }}>
                Welcome to Peryon
              </Text>
              <Text variant="bodyMedium" style={{ textAlign: 'center', marginBottom: 24 }}>
                Track your bike components and maintenance with Strava integration
              </Text>
              <Button mode="contained" onPress={login}>
                Connect with Strava
              </Button>
            </Card.Content>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Dashboard" />
        <Appbar.Action icon="logout" onPress={logout} />
      </Appbar.Header>
      
      <ScrollView style={styles.content}>
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Text variant="headlineSmall">
              Welcome back, {user?.firstName}!
            </Text>
            <Text variant="bodyMedium" style={{ marginTop: 8 }}>
              Here's an overview of your bike components
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={{ marginBottom: 16 }}>
              Quick Stats
            </Text>
            
            <View style={styles.row}>
              <Text variant="bodyMedium">Active Components:</Text>
              <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>12</Text>
            </View>
            
            <View style={styles.row}>
              <Text variant="bodyMedium">Components Due Soon:</Text>
              <Text variant="bodyMedium" style={{ fontWeight: 'bold', color: theme.colors.error }}>3</Text>
            </View>
            
            <View style={styles.row}>
              <Text variant="bodyMedium">Total Distance:</Text>
              <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>2,457 km</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={{ marginBottom: 16 }}>
              Recent Activity
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              No recent Strava activities found.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}