import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Text, Avatar, List, useTheme, Appbar, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen(): JSX.Element {
  const theme = useTheme();
  const { user, logout, stravaAccessToken } = useAuth();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    profileCard: {
      marginBottom: 16,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    userInfo: {
      marginLeft: 16,
      flex: 1,
    },
    statusChip: {
      alignSelf: 'flex-start',
      marginTop: 4,
    },
    settingsCard: {
      marginBottom: 16,
    },
    accountCard: {
      marginBottom: 16,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Profile" />
        <Appbar.Action icon="cog" onPress={() => console.log('Settings')} />
      </Appbar.Header>
      
      <ScrollView style={styles.content}>
        {/* Profile Info */}
        <Card style={styles.profileCard}>
          <Card.Content>
            <View style={styles.profileHeader}>
              <Avatar.Image 
                size={64} 
                source={{ uri: user?.profilePicture || 'https://via.placeholder.com/64' }} 
              />
              <View style={styles.userInfo}>
                <Text variant="headlineSmall">
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {user?.email}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <Text 
                    variant="bodySmall" 
                    style={{ 
                      color: stravaAccessToken ? theme.colors.primary : theme.colors.error,
                      fontWeight: 'bold'
                    }}
                  >
                    {stravaAccessToken ? '● Connected to Strava' : '● Not connected to Strava'}
                  </Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Account Settings */}
        <Card style={styles.accountCard}>
          <Card.Content>
            <Text variant="titleMedium" style={{ marginBottom: 8 }}>
              Account
            </Text>
          </Card.Content>
          
          <List.Item
            title="Strava Connection"
            description={stravaAccessToken ? "Manage Strava integration" : "Connect your Strava account"}
            left={(props) => <List.Icon {...props} icon="link-variant" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Manage Strava connection')}
          />
          
          <Divider />
          
          <List.Item
            title="Sync Settings"
            description="Configure automatic sync with Strava"
            left={(props) => <List.Icon {...props} icon="sync" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Sync settings')}
          />
          
          <Divider />
          
          <List.Item
            title="Privacy Settings"
            description="Manage your data and privacy"
            left={(props) => <List.Icon {...props} icon="shield-account" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Privacy settings')}
          />
        </Card>

        {/* App Settings */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={{ marginBottom: 8 }}>
              App Settings
            </Text>
          </Card.Content>
          
          <List.Item
            title="Notifications"
            description="Manage component maintenance reminders"
            left={(props) => <List.Icon {...props} icon="bell-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Notification settings')}
          />
          
          <Divider />
          
          <List.Item
            title="Units"
            description="Distance and measurement preferences"
            left={(props) => <List.Icon {...props} icon="ruler" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Unit settings')}
          />
          
          <Divider />
          
          <List.Item
            title="Theme"
            description="Appearance settings"
            left={(props) => <List.Icon {...props} icon="palette-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Theme settings')}
          />
          
          <Divider />
          
          <List.Item
            title="Data Export"
            description="Export your component data"
            left={(props) => <List.Icon {...props} icon="export" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Export data')}
          />
        </Card>

        {/* Support */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={{ marginBottom: 8 }}>
              Support
            </Text>
          </Card.Content>
          
          <List.Item
            title="Help & FAQ"
            description="Get help using Peryon"
            left={(props) => <List.Icon {...props} icon="help-circle-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Help')}
          />
          
          <Divider />
          
          <List.Item
            title="Contact Support"
            description="Get in touch with our team"
            left={(props) => <List.Icon {...props} icon="email-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Contact support')}
          />
          
          <Divider />
          
          <List.Item
            title="About"
            description="App version and information"
            left={(props) => <List.Icon {...props} icon="information-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('About')}
          />
          
          <Divider />
          
          <List.Item
            title="Sign Out"
            description="Sign out of your account"
            left={(props) => <List.Icon {...props} icon="logout" color={theme.colors.error} />}
            titleStyle={{ color: theme.colors.error }}
            onPress={logout}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}