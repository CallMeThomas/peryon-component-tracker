import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Text, Button, useTheme, Appbar } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const { user, isAuthenticated, login, logout } = useAuth();

  const styles = StyleSheet.create({
    boldText: {
      fontWeight: 'bold',
    },
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    errorText: {
      color: theme.colors.error,
      fontWeight: 'bold',
    },
    loginCard: {
      padding: 24,
      width: '100%',
    },
    loginContainer: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      padding: 32,
    },
    overviewText: {
      marginTop: 8,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    sectionTitle: {
      marginBottom: 16,
    },
    statsCard: {
      marginBottom: 16,
    },
    subtleText: {
      color: theme.colors.onSurfaceVariant,
    },
    welcomeCard: {
      marginBottom: 16,
    },
    welcomeSubtitle: {
      marginBottom: 24,
      textAlign: 'center',
    },
    welcomeTitle: {
      marginBottom: 16,
      textAlign: 'center',
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
              <Text variant="headlineSmall" style={styles.welcomeTitle}>
                Welcome to Peryon
              </Text>
              <Text variant="bodyMedium" style={styles.welcomeSubtitle}>
                Track your bike components and maintenance with Strava
                integration
              </Text>
              <Button mode="contained" onPress={login}>
                <Text>Connect with Strava</Text>
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
            <Text variant="bodyMedium" style={styles.overviewText}>
              Here&apos;s an overview of your bike components
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Quick Stats
            </Text>

            <View style={styles.row}>
              <Text variant="bodyMedium">Active Components:</Text>
              <Text variant="bodyMedium" style={styles.boldText}>
                12
              </Text>
            </View>

            <View style={styles.row}>
              <Text variant="bodyMedium">Components Due Soon:</Text>
              <Text variant="bodyMedium" style={styles.errorText}>
                3
              </Text>
            </View>

            <View style={styles.row}>
              <Text variant="bodyMedium">Total Distance:</Text>
              <Text variant="bodyMedium" style={styles.boldText}>
                2,457 km
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Recent Activity
            </Text>
            <Text variant="bodyMedium" style={styles.subtleText}>
              No recent Strava activities found.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
