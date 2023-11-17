import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fictional.cinema.app',
  appName: 'fictional-cinema-app',
  webDir: 'www/browser',
  server: {
    androidScheme: 'https'
  }
};

export default config;
