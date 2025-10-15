import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from 'react';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  processSessionToken: (sessionToken: string) => Promise<void>;
  refreshTokens: () => Promise<boolean>;
}

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// Storage keys
const TOKEN_KEY = 'strava_tokens';
const USER_KEY = 'user_data';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    null
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const loadingRef = useRef(false);

  const storeTokens = async (tokenData: TokenData) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(tokenData));
    } catch (error) {
      console.error('Error storing tokens:', error);
    }
  };

  const getStoredTokens = async (): Promise<TokenData | null> => {
    try {
      const tokenString = await SecureStore.getItemAsync(TOKEN_KEY);
      return tokenString ? JSON.parse(tokenString) : null;
    } catch (error) {
      console.error('Error retrieving tokens:', error);
      return null;
    }
  };

  const storeUser = async (userData: User) => {
    try {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  const getStoredUser = async (): Promise<User | null> => {
    try {
      const userString = await SecureStore.getItemAsync(USER_KEY);
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  };

  const clearStoredAuth = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.error('Error clearing stored auth:', error);
    }
  };

  const isTokenExpired = (expiresAt: number): boolean => {
    const now = Date.now();
    const buffer = 5 * 60 * 1000; // 5 minutes
    return now >= expiresAt - buffer;
  };

  const refreshTokens = async (): Promise<boolean> => {
    try {
      const storedTokens = await getStoredTokens();
      if (!storedTokens?.refreshToken) {
        console.warn('No refresh token available');
        return false;
      }

      console.info('🔄 Refreshing access token via backend...');

      const apiUrl =
        process.env.EXPO_PUBLIC_API_URL || 'https://localhost:7239/api';

      const response = await fetch(`${apiUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // Current access token for auth
        },
        body: JSON.stringify({
          refresh_token: storedTokens.refreshToken,
        }),
      });

      if (!response.ok) {
        console.error('Failed to refresh token:', response.status);
        return false;
      }

      const responseData = await response.json();
      const newTokenData: TokenData = {
        accessToken: responseData.access_token,
        refreshToken: responseData.refresh_token,
        expiresAt: Date.now() + responseData.expires_in * 1000,
      };

      // Store new tokens
      await storeTokens(newTokenData);

      // Update state
      setAccessToken(newTokenData.accessToken);
      setRefreshToken(newTokenData.refreshToken);

      console.info('✅ Token refreshed successfully');
      return true;
    } catch (error) {
      console.error('❌ Error refreshing token:', error);
      return false;
    }
  };

  const redirectUri = `${process.env.EXPO_PUBLIC_API_URL}/auth/strava/mobile-callback`;

  const discovery = {
    authorizationEndpoint: 'https://www.strava.com/oauth/authorize',
    tokenEndpoint: 'https://www.strava.com/oauth/token',
  };

  const login = async (): Promise<void> => {
    try {
      if (loadingRef.current === true) {
        console.warn('Login already in progress');
        return;
      }
      loadingRef.current = true;

      // Generate random state for security
      const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      const request = new AuthSession.AuthRequest({
        clientId: process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID,
        scopes: ['read,activity:read'],
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        state,
        extraParams: {
          approval_prompt: 'force',
        },
      });

      await request.promptAsync(discovery);
     // The actual handling of the response is done in the AuthCallback component      
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
      setUser(null);
      setAccessToken(null);
    } finally {
      loadingRef.current = false;
    }
  };

  const logout = async (): Promise<void> => {
    await clearStoredAuth();
    setIsAuthenticated(false);
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  const processSessionToken = async (sessionToken: string): Promise<void> => {
    try {
      if (loadingRef.current === true) {
        console.warn('Session token processing already in progress');
        return;
      }

      loadingRef.current = true;
      console.info('🎫 Processing session token...');

      // Exchange session token for actual auth tokens from backend
      const apiUrl =
        process.env.EXPO_PUBLIC_API_URL || 'https://localhost:7239/api';

      const response = await fetch(`${apiUrl}/auth/strava/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionToken: sessionToken,
        }),
      });

      if (!response.ok) {
        throw new Error(`Session token exchange failed: ${response.status}`);
      }

      const responseData = await response.json();

      const user: User = {
        id: responseData.user.id,
        firstName: responseData.user.firstName,
        lastName: responseData.user.lastName,
        email: responseData.user.email,
        stravaId: responseData.user.stravaId,
        profilePicture:
          responseData.user.profilePicture,
      };

      const tokens: TokenData = {
        accessToken: responseData.access_token,
        refreshToken: responseData.refresh_token,
        expiresAt: Date.now() + responseData.expires_in * 1000,
      };

      await Promise.all([storeTokens(tokens), storeUser(user)]);

      setIsAuthenticated(true);
      setUser(user);
      setAccessToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);

      console.info('✅ Session token authentication successful!');
    } catch (error) {
      console.error('❌ Error processing session token:', error);
      setIsAuthenticated(false);
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
    } finally {
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (loadingRef.current === true) {
          console.warn('Auth initialization already in progress');
          return;
        }
        loadingRef.current = true;

        const [storedTokens, storedUser] = await Promise.all([
          getStoredTokens(),
          getStoredUser(),
        ]);

        if (storedTokens && storedUser) {
          if (isTokenExpired(storedTokens.expiresAt)) {
            console.info('🕒 Access token expired, attempting refresh...');

            const refreshSuccessful = await refreshTokens();

            if (refreshSuccessful) {
              setIsAuthenticated(true);
              setUser(storedUser);
            } else {
              console.warn(
                '🚫 Token refresh failed, requiring re-authentication'
              );
              await clearStoredAuth();
            }
          } else {
            console.info('✅ Valid tokens found, restoring session');
            setIsAuthenticated(true);
            setUser(storedUser);
            setAccessToken(storedTokens.accessToken);
            setRefreshToken(storedTokens.refreshToken);
          }
        } else {
          console.info('ℹ️ No stored authentication found');
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        await clearStoredAuth();
      } finally {
        loadingRef.current = false;
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // We want this to run only once on mount

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    accessToken,
    refreshToken,
    loading: loadingRef.current,
    login,
    logout,
    processSessionToken,
    refreshTokens,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
