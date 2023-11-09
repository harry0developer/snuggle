import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.charcoal.snuggle',
  appName: 'snuggle',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      splashFullScreen: true

    }
  }
};

export default config;
