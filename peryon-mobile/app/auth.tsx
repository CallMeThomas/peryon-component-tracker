import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function AuthCallback() {
  const { code, state, error } = useLocalSearchParams();
  const router = useRouter();
  const { processAuthCallback } = useAuth();

  useEffect(() => {
    console.log('🔄 Auth callback received:', { code, state, error });
    
    if (error) {
      console.error('❌ OAuth error:', error);
      // Handle error - redirect to login or show error
      router.replace('/');
      return;
    }

    if (code) {
      console.log('✅ Authorization code received:', code);
      // Process the authorization code
      processAuthCallback(code as string, state as string);
      // Redirect to main app
      router.replace('/(tabs)');
    } else {
      console.log('⚠️ No code received, redirecting to home');
      router.replace('/');
    }
  }, [code, state, error]);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#fff'
    }}>
      <ActivityIndicator size="large" color="#FC4C02" />
      <Text style={{ marginTop: 16, fontSize: 16 }}>
        Processing authentication...
      </Text>
    </View>
  );
}