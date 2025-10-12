# Peryon Mobile

Mobile app for tracking bike components and maintenance with Strava integration.

## Tech Stack

- **React Native** with **Expo** (Development Build)
- **TypeScript** for type safety
- **React Native Paper** (Material Design)
- **Expo Router** for navigation
- **TanStack Query** (React Query) for server state
- **Axios** for HTTP requests  
- **React Context** for auth state management
- **Expo AuthSession** for Strava OAuth

## Setup

1. **Install dependencies**
   ```bash
   yarn install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your actual values:
   - `EXPO_PUBLIC_API_URL`: Your .NET backend URL
   - `EXPO_PUBLIC_STRAVA_CLIENT_ID`: Your Strava app client ID

3. **Start the development server**
   ```bash
   yarn start
   ```

4. **Run on device/emulator**
   - Press `a` for Android
   - Press `w` for web
   - Scan QR code with Expo Go app

## Project Structure

```
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Home/Dashboard
│   │   ├── bikes.tsx      # Bikes management
│   │   ├── components.tsx # Components tracking
│   │   └── profile.tsx    # User profile
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
├── contexts/              # React contexts
│   └── AuthContext.tsx   # Authentication state
├── services/              # API layer
│   ├── hooks/            # React Query hooks
│   │   ├── useAuth.ts    # Auth API hooks
│   │   ├── useBikes.ts   # Bikes API hooks
│   │   ├── useComponents.ts # Components API hooks
│   │   └── useStrava.ts  # Strava API hooks
│   └── apiClient.ts      # Axios configuration
└── types/                # TypeScript types
    └── index.ts          # Global type definitions
```

## Features

### Current Features
- ✅ Tab navigation with Material Design
- ✅ Strava OAuth authentication
- ✅ Bike management screens
- ✅ Component tracking with wear indicators
- ✅ User profile and settings
- ✅ TypeScript throughout
- ✅ React Query for API state management

### Planned Features
- 🔄 Real API integration with .NET backend
- 🔄 Strava activity sync
- 🔄 Component maintenance reminders
- 🔄 Data visualization and analytics
- 🔄 Offline support with local storage
- 🔄 Push notifications

## Development

### Running Tests
```bash
yarn test
```

### Building for Production
```bash
# Development build
yarn build

# Production build
eas build --platform android
```

### API Integration

The app uses custom React Query hooks for API calls:

```typescript
// Authentication
const { mutate: login } = useStravaAuth();

// Bikes
const { data: bikes, isLoading } = useBikes();
const { mutate: createBike } = useCreateBike();

// Components  
const { data: components } = useComponents(bikeId);
const { mutate: updateComponent } = useUpdateComponent();

// Strava
const { mutate: syncStrava } = useStravaSync();
```

## Contributing

1. Create a feature branch
2. Make your changes with TypeScript
3. Test on both Android and web
4. Submit a pull request

## Backend Requirements

This mobile app requires the Peryon .NET backend to be running with the following endpoints:

- `POST /api/auth/strava` - Strava OAuth authentication
- `GET /api/bikes` - Get user's bikes
- `GET/POST/PUT/DELETE /api/components` - Component CRUD
- `POST /api/strava/sync` - Sync with Strava
- And more... (see API hooks for full list)