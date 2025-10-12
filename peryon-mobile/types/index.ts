// User and Authentication types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  stravaId: string;
  profilePicture?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  stravaAccessToken: string | null;
  loading: boolean;
}

// Bike Component types
export interface BikeComponent {
  id: string;
  name: string;
  type: ComponentType;
  brandName: string;
  modelName: string;
  purchaseDate: string;
  initialDistance: number;
  currentDistance: number;
  maxDistance?: number;
  isActive: boolean;
  bikeId: string;
  notes?: string;
}

export interface Bike {
  id: string;
  name: string;
  type: BikeType;
  stravaGearId?: string;
  components: BikeComponent[];
  isActive: boolean;
}

export enum ComponentType {
  Chain = 'chain',
  Cassette = 'cassette',
  ChainRing = 'chainring',
  BrakePads = 'brakepads',
  Tires = 'tires',
  Tubes = 'tubes',
  Cables = 'cables',
  Other = 'other',
}

export enum BikeType {
  Road = 'road',
  Mountain = 'mountain',
  Gravel = 'gravel',
  Hybrid = 'hybrid',
  Electric = 'electric',
  Other = 'other',
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

// Strava types
export interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  type: string;
  start_date: string;
  gear_id?: string;
}

export interface StravaGear {
  id: string;
  name: string;
  primary: boolean;
  distance: number;
  brand_name?: string;
  model_name?: string;
  description?: string;
}
