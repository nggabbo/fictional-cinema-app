import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fictional.cinema.app',
  appName: 'fictional-cinema-app',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
