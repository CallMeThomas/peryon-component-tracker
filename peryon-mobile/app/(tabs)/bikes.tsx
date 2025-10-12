import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Card,
  Text,
  Chip,
  FAB,
  useTheme,
  Appbar,
  Badge,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BikeType } from '../../types';

const BikesScreen: React.FC = () => {
  const theme = useTheme();

  // Mock data - this would come from your API/state management
  const mockBikes = [
    {
      id: '1',
      name: 'Canyon Endurace',
      type: BikeType.Road,
      stravaGearId: 'b12345',
      totalDistance: 5420,
      activeComponents: 8,
      componentsNeedingAttention: 2,
      isActive: true,
    },
    {
      id: '2',
      name: 'Trek Fuel EX',
      type: BikeType.Mountain,
      stravaGearId: 'b67890',
      totalDistance: 3200,
      activeComponents: 10,
      componentsNeedingAttention: 0,
      isActive: true,
    },
    {
      id: '3',
      name: 'Specialized Diverge',
      type: BikeType.Gravel,
      totalDistance: 1850,
      activeComponents: 6,
      componentsNeedingAttention: 1,
      isActive: false,
    },
  ];

  const getBikeTypeIcon = (
    type: BikeType
  ): keyof typeof MaterialIcons.glyphMap => {
    switch (type) {
      case BikeType.Road:
        return 'directions-bike';
      case BikeType.Mountain:
        return 'terrain';
      case BikeType.Gravel:
        return 'landscape';
      case BikeType.Electric:
        return 'electric-bike';
      default:
        return 'directions-bike';
    }
  };

  const getBikeTypeColor = (type: BikeType): string => {
    switch (type) {
      case BikeType.Road:
        return theme.colors.primary;
      case BikeType.Mountain:
        return '#4CAF50';
      case BikeType.Gravel:
        return '#FF9800';
      case BikeType.Electric:
        return '#9C27B0';
      default:
        return theme.colors.outline;
    }
  };

  const styles = StyleSheet.create({
    attentionTextError: {
      color: theme.colors.error,
      fontWeight: 'bold',
    },
    attentionTextSuccess: {
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
    badge: {
      backgroundColor: theme.colors.error,
      position: 'absolute',
      right: -8,
      top: -8,
    },
    badgeContainer: {
      position: 'relative',
    },
    bikeCard: {
      marginBottom: 12,
    },
    bikeIcon: {
      marginRight: 8,
    },
    bikeInfo: {
      flex: 1,
    },
    bikeTitle: {
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 4,
    },
    boldText: {
      fontWeight: 'bold',
    },
    cardHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    emptyState: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      padding: 32,
    },
    emptySubtitle: {
      marginBottom: 24,
      textAlign: 'center',
    },
    emptyTitle: {
      marginBottom: 16,
      textAlign: 'center',
    },
    fab: {
      bottom: 0,
      margin: 16,
      position: 'absolute',
      right: 0,
    },
    flexOne: {
      flex: 1,
    },
    inactiveCard: {
      opacity: 0.6,
    },
    inactiveText: {
      color: theme.colors.error,
    },
    statItem: {
      alignItems: 'center',
    },
    statsRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    subtleText: {
      color: theme.colors.onSurfaceVariant,
    },
    syncedText: {
      color: theme.colors.onSurfaceVariant,
    },
  });

  if (mockBikes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="Bikes" />
          <Appbar.Action icon="plus" onPress={() => console.log('Add bike')} />
        </Appbar.Header>

        <View style={styles.emptyState}>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            No Bikes Yet
          </Text>
          <Text variant="bodyMedium" style={styles.emptySubtitle}>
            Add your first bike to start tracking components
          </Text>
        </View>

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => console.log('Add bike')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Bikes" />
        <Appbar.Action
          icon="sync"
          onPress={() => console.log('Sync with Strava')}
        />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {mockBikes.map(bike => (
          <Card
            key={bike.id}
            style={[styles.bikeCard, !bike.isActive && styles.inactiveCard]}
          >
            <Card.Content>
              <View style={styles.cardHeader}>
                <View style={styles.bikeInfo}>
                  <View style={styles.bikeTitle}>
                    <MaterialIcons
                      name={getBikeTypeIcon(bike.type)}
                      size={24}
                      color={getBikeTypeColor(bike.type)}
                      style={styles.bikeIcon}
                    />
                    <View style={styles.flexOne}>
                      <Text variant="titleMedium">{bike.name}</Text>
                      {bike.stravaGearId && (
                        <Text variant="bodySmall" style={styles.syncedText}>
                          Synced with Strava
                        </Text>
                      )}
                      {!bike.isActive && (
                        <Text variant="bodySmall" style={styles.inactiveText}>
                          Inactive
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                <View style={styles.badgeContainer}>
                  <Chip
                    mode="outlined"
                    textStyle={{ color: getBikeTypeColor(bike.type) }}
                    style={{ borderColor: getBikeTypeColor(bike.type) }}
                  >
                    {bike.type}
                  </Chip>
                  {bike.componentsNeedingAttention > 0 && (
                    <Badge size={20} style={styles.badge}>
                      {bike.componentsNeedingAttention}
                    </Badge>
                  )}
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text variant="titleMedium" style={styles.boldText}>
                    {bike.totalDistance.toLocaleString()}
                  </Text>
                  <Text variant="bodySmall" style={styles.subtleText}>
                    km total
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text variant="titleMedium" style={styles.boldText}>
                    {bike.activeComponents}
                  </Text>
                  <Text variant="bodySmall" style={styles.subtleText}>
                    components
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text
                    variant="titleMedium"
                    style={
                      bike.componentsNeedingAttention > 0
                        ? styles.attentionTextError
                        : styles.attentionTextSuccess
                    }
                  >
                    {bike.componentsNeedingAttention}
                  </Text>
                  <Text variant="bodySmall" style={styles.subtleText}>
                    need attention
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log('Add bike')}
      />
    </SafeAreaView>
  );
};

export default BikesScreen;
