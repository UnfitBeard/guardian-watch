# GuardianWatch (Expo SDK 54 + Supabase)

## Setup
- Prereqs: Node 18+, npm or yarn, Expo CLI (`npx expo` works).
- Create env file `.env`:
```
VITE_SUPABASE_PROJECT_ID=your_project_ref
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_or_publishable_key
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_FUNCTIONS_URL=https://<project-ref>.functions.supabase.co
```

## Install
```
npm install
npx expo install react-native-gesture-handler react-native-reanimated
```

## Run
```
npx expo start
```

## Notes
- Tabs: Dashboard, Report, Pair.
- Pair uses Supabase edge function `/pair_device`.
- Report posts to `/report_incident` with basic payload.
