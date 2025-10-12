import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Text, Chip, FAB, useTheme, Appbar, Badge } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BikeType } from '../../types';

export default function BikesScreen(): JSX.Element {
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

  const getBikeTypeIcon = (type: BikeType): keyof typeof MaterialIcons.glyphMap => {
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
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    bikeCard: {
      marginBottom: 12,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    bikeInfo: {
      flex: 1,
    },
    bikeTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    bikeIcon: {
      marginRight: 8,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    statItem: {
      alignItems: 'center',
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    inactiveCard: {
      opacity: 0.6,
    },
    badgeContainer: {
      position: 'relative',
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
          <Text variant="headlineSmall" style={{ textAlign: 'center', marginBottom: 16 }}>
            No Bikes Yet
          </Text>
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginBottom: 24 }}>
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
        <Appbar.Action icon="sync" onPress={() => console.log('Sync with Strava')} />
      </Appbar.Header>
      
      <ScrollView style={styles.content}>
        {mockBikes.map((bike) => (
          <Card 
            key={bike.id} 
            style={[
              styles.bikeCard, 
              !bike.isActive && styles.inactiveCard
            ]}
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
                    <View style={{ flex: 1 }}>
                      <Text variant="titleMedium">{bike.name}</Text>
                      {bike.stravaGearId && (
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                          Synced with Strava
                        </Text>
                      )}
                      {!bike.isActive && (
                        <Text variant="bodySmall" style={{ color: theme.colors.error }}>
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
                    <Badge 
                      size={20}
                      style={{ 
                        position: 'absolute', 
                        top: -8, 
                        right: -8,
                        backgroundColor: theme.colors.error 
                      }}
                    >
                      {bike.componentsNeedingAttention}
                    </Badge>
                  )}
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                    {bike.totalDistance.toLocaleString()}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    km total
                  </Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                    {bike.activeComponents}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    components
                  </Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text 
                    variant="titleMedium" 
                    style={{ 
                      fontWeight: 'bold',
                      color: bike.componentsNeedingAttention > 0 ? theme.colors.error : theme.colors.primary 
                    }}
                  >
                    {bike.componentsNeedingAttention}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
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
}