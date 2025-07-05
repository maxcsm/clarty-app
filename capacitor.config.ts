import { CapacitorConfig } from '@capacitor/cli';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isPlatform } from '@ionic/angular';

const config: CapacitorConfig = {
  appId: 'com.calrity',
  appName: 'Clarty',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      // Might help fallback for older devices
      photo: true,
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      iosClientId: '377073682209-edkmntp246jdbb2tke7hchovfq39v181.apps.googleusercontent.com',
      serverClientId: '377073682209-dhp6lcep2md2i4pamohlad730okhj486.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    },
    FacebookConnect: {
      appId: '1447862026131085',
      version: 'v18.0' // ou la version actuelle de l'API Graph
    }
    
  }
};

export default config;
