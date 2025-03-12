import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardStyle, KeyboardResize } from '@capacitor/keyboard';  // ✅ Importaciones correctas

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'appwebbess',
  webDir: 'www',
  plugins: {
    Keyboard: {
      resize: KeyboardResize.Body,  // ✅ Uso correcto del tipo
      style: KeyboardStyle.Dark,  
      resizeOnFullScreen: true
    }
  }
};

export default config;
