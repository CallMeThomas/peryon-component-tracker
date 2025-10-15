import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';

const AuthCallback: React.FC = () => {
  const { error, session_token } = useLocalSearchParams();
  const router = useRouter();
  const { processSessionToken } = useAuth();

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
    console.info('🔄 Auth callback received:', { error, session_token });

    if (error) {
      console.error('❌ OAuth error:', error);
      router.replace('/');
      return;
    }

    if (session_token) {
      console.info('🎫 Session token received, exchanging for auth tokens...');
      
      processSessionToken(session_token as string)
        .then(() => {
          console.info('🎉 Authentication processing complete');
          router.replace('/(tabs)');
        })
        .catch((error: any) => {
          console.error('❌ Authentication processing failed:', error);
          router.replace('/');
        });
    }
    else {
      console.warn('⚠️ No session token, redirecting to home');
      router.replace('/');
    }
  }, [error, session_token, processSessionToken, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FC4C02" />
      <Text style={styles.loadingText}>Processing authentication...</Text>
    </View>
  );
};

export default AuthCallback;
