# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

GuardianWatch is a React Native mobile app built with Expo SDK 54 and Supabase for backend services. The app provides parental monitoring functionality with device pairing, incident reporting, and dashboard features.

## Common Commands

### Development
```bash
# Start development server (use this to run the app)
npx expo start

# Run on specific platforms
npx expo start --android
npx expo start --ios
npx expo start --web
```

### Initial Setup
```bash
# Install dependencies
npm install

# Install required native dependencies (after npm install)
npx expo install react-native-gesture-handler react-native-reanimated
```

## Architecture

### Project Structure
- **src/screens/** - Three main tab screens: Dashboard, Report, Pair
- **src/api/** - Backend integration modules for Supabase
  - `supabaseClient.ts` - Supabase client initialization
  - `pairing.ts` - Device pairing with parent account via edge function
  - `incidents.ts` - Incident reporting to backend
- **src/components/** - Reusable UI components (e.g., IncidentCard)
- **src/utils/** - Utility functions (currently storage helpers for AsyncStorage)

### Configuration & Environment
- **app.config.js** - Expo configuration that reads environment variables and exposes them via `Constants.expoConfig.extra`
- **.env** - Environment variables for Supabase connection (URL, anon key, functions URL)
- All Supabase configuration is accessed via `Constants.expoConfig.extra` in the app code

### Key Architectural Patterns

**Navigation**: Bottom tab navigator with three screens (Dashboard, Report, Pair)

**Backend Integration**: 
- Direct Supabase client for database queries (initialized in `src/api/supabaseClient.ts`)
- Axios calls to Supabase Edge Functions for:
  - `/pair_device` - Pairs child device using 6-digit code
  - `/report_incident` - Reports incidents with image and metadata

**State Management**: Currently uses component-level state (useState). Device pairing stores deviceId in AsyncStorage.

**Styling**: Uses NativeWind (Tailwind for React Native) via className prop

### Data Flow
1. **Pairing**: User enters code → calls edge function → stores deviceId locally
2. **Reporting**: User picks image → calls edge function with incident payload → shows confirmation
3. **Dashboard**: Placeholder for displaying child device activity/alerts

## Important Notes

- Environment variables must be configured in `.env` before running
- Device ID is stored in AsyncStorage after successful pairing
- TypeScript strict mode is enabled
- The app uses Expo Go for development (no native build required initially)
- Image picker requires appropriate permissions on device
