import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback: React.FC = () => {
  const { code, state, error } = useLocalSearchParams();
  const router = useRouter();
  const { processAuthCallback } = useAuth();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: '#fff',
      flex: 1,
      justifyContent: 'center',
    },
    loadingText: {
      fontSize: 16,
      marginTop: 16,
    },
  });

  useEffect(() => {
    console.info('🔄 Auth callback received:', { code, state, error });

    if (error) {
      console.error('❌ OAuth error:', error);
      // Handle error - redirect to login or show error
      router.replace('/');
      return;
    }

    if (code) {
      console.info('✅ Authorization code received:', code);
      // Process the authorization code
      processAuthCallback(code as string, state as string);
      // Redirect to main app
      router.replace('/(tabs)');
    } else {
      console.warn('⚠️ No code received, redirecting to home');
      router.replace('/');
    }
  }, [code, state, error, processAuthCallback, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FC4C02" />
      <Text style={styles.loadingText}>Processing authentication...</Text>
    </View>
  );
};

export default AuthCallback;
