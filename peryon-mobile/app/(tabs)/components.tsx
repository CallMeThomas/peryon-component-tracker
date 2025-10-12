import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Text, Chip, FAB, useTheme, Appbar, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ComponentType } from '../../types';

const ComponentsScreen: React.FC = () => {
  const theme = useTheme();

  // Mock data - this would come from your API/state management
  const mockComponents = [
    {
      id: '1',
      name: 'Shimano Chain',
      type: ComponentType.Chain,
      brandName: 'Shimano',
      modelName: 'CN-HG701',
      currentDistance: 2800,
      maxDistance: 3000,
      bikeName: 'Road Bike',
      isActive: true,
    },
    {
      id: '2',
      name: 'SRAM Cassette',
      type: ComponentType.Cassette,
      brandName: 'SRAM',
      modelName: 'PG-1130',
      currentDistance: 4200,
      maxDistance: 5000,
      bikeName: 'Road Bike',
      isActive: true,
    },
    {
      id: '3',
      name: 'Continental Tires',
      type: ComponentType.Tires,
      brandName: 'Continental',
      modelName: 'Grand Prix 5000',
      currentDistance: 3800,
      maxDistance: 4000,
      bikeName: 'Road Bike',
      isActive: true,
    },
  ];

  const getComponentTypeColor = (type: ComponentType): string => {
    switch (type) {
      case ComponentType.Chain:
        return theme.colors.primary;
      case ComponentType.Cassette:
        return theme.colors.secondary;
      case ComponentType.Tires:
        return theme.colors.tertiary;
      default:
        return theme.colors.outline;
    }
  };

  const getWearPercentage = (current: number, max: number): number => {
    return (current / max) * 100;
  };

  const getWearColor = (percentage: number): string => {
    if (percentage >= 90) return theme.colors.error;
    if (percentage >= 75) return theme.colors.primary;
    return theme.colors.outline;
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
    componentCard: {
      marginBottom: 12,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    componentInfo: {
      flex: 1,
    },
    distanceInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 4,
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
  });

  if (mockComponents.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="Components" />
          <Appbar.Action icon="plus" onPress={() => console.log('Add component')} />
        </Appbar.Header>
        
        <View style={styles.emptyState}>
          <Text variant="headlineSmall" style={{ textAlign: 'center', marginBottom: 16 }}>
            No Components Yet
          </Text>
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginBottom: 24 }}>
            Add your first bike component to start tracking maintenance
          </Text>
        </View>

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => console.log('Add component')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Components" />
        <Appbar.Action icon="filter-variant" onPress={() => console.log('Filter')} />
      </Appbar.Header>
      
      <ScrollView style={styles.content}>
        {mockComponents.map((component) => {
          const wearPercentage = getWearPercentage(component.currentDistance, component.maxDistance);
          const wearColor = getWearColor(wearPercentage);
          
          return (
            <Card key={component.id} style={styles.componentCard}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <View style={styles.componentInfo}>
                    <Text variant="titleMedium">{component.name}</Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {component.brandName} {component.modelName}
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      on {component.bikeName}
                    </Text>
                  </View>
                  <Chip 
                    mode="outlined" 
                    textStyle={{ color: getComponentTypeColor(component.type) }}
                    style={{ borderColor: getComponentTypeColor(component.type) }}
                  >
                    {component.type}
                  </Chip>
                </View>
                
                <View style={styles.distanceInfo}>
                  <Text variant="bodySmall">
                    {component.currentDistance.toLocaleString()} km / {component.maxDistance.toLocaleString()} km
                  </Text>
                  <Text variant="bodySmall" style={{ color: wearColor, fontWeight: 'bold' }}>
                    {wearPercentage.toFixed(0)}% used
                  </Text>
                </View>
                
                <ProgressBar 
                  progress={wearPercentage / 100} 
                  color={wearColor}
                  style={{ height: 6, borderRadius: 3 }}
                />
              </Card.Content>
            </Card>
          );
        })}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log('Add component')}
      />
    </SafeAreaView>
  );
};

export default ComponentsScreen;
