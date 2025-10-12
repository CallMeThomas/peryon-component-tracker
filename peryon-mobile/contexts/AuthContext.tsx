import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  stravaAccessToken: string | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
  processAuthCallback: (code: string, state: string) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [stravaAccessToken, setStravaAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Strava OAuth configuration
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'peryon',
    path: 'auth',
  });
  
  console.log('🔗 Redirect URI:', redirectUri);

  const discovery = {
    authorizationEndpoint: 'https://www.strava.com/oauth/authorize',
    tokenEndpoint: 'https://www.strava.com/oauth/token',
  };

  const login = async (): Promise<void> => {
    try {
      setLoading(true);

      // Create code verifier and challenge for PKCE
      const codeChallenge = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        'code_verifier_here', // In production, generate a random string
        { encoding: Crypto.CryptoEncoding.BASE64 }
      );

      console.log('🚀 Starting login with Client ID:', process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID);
      console.log('🔗 Using Redirect URI:', redirectUri);
      
      const request = new AuthSession.AuthRequest({
        clientId: process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID || 'your_strava_client_id',
        scopes: ['read,activity:read'],
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        state: 'random_state_string',
        extraParams: {
          approval_prompt: 'force',
        },
      });

      const result = await request.promptAsync(discovery);
      
      console.log('📱 OAuth result:', result);

      if (result.type === 'success') {
        const { code } = result.params;
        
        // Exchange code for access token
        // This should be done through your backend API for security
        // For now, we'll simulate a successful login
        
        const mockUser: User = {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          stravaId: '12345',
          profilePicture: 'https://via.placeholder.com/150',
        };

        setIsAuthenticated(true);
        setUser(mockUser);
        setStravaAccessToken('mock_access_token');
      } else {
        // Login cancelled or failed
        setIsAuthenticated(false);
        setUser(null);
        setStravaAccessToken(null);
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
      setUser(null);
      setStravaAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    setIsAuthenticated(false);
    setUser(null);
    setStravaAccessToken(null);
  };

  const refreshUserData = async (): Promise<void> => {
    try {
      setLoading(true);
      // This would typically call your backend API to refresh user data
      // For now, we'll just simulate a refresh
      console.log('Refreshing user data...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAuthCallback = async (code: string, state: string): Promise<void> => {
    try {
      setLoading(true);
      console.log('🔄 Processing auth callback with code:', code);
      
      // In a real app, you would:
      // 1. Send the authorization code to your backend
      // 2. Your backend exchanges it for an access token with Strava
      // 3. Your backend returns user data and stores the token securely
      
      // For now, we'll simulate a successful token exchange
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        stravaId: '12345',
        profilePicture: 'https://via.placeholder.com/150',
      };

      setIsAuthenticated(true);
      setUser(mockUser);
      setStravaAccessToken('mock_access_token');
      
      console.log('✅ Authentication successful!');
      
    } catch (error) {
      console.error('❌ Error processing auth callback:', error);
      setIsAuthenticated(false);
      setUser(null);
      setStravaAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is already authenticated on app start
    // This would typically check stored tokens or session
    // For now, we'll just set loading to false
    setLoading(false);
  }, []);

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    stravaAccessToken,
    loading,
    login,
    logout,
    refreshUserData,
    processAuthCallback,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};