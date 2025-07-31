// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css' // Add this line
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


// Default Vuetify theme
const defaultTheme = {
  dark: false,
  colors: {
    primary: '#DC143C',      // Classic red (like movie theater red)
    secondary: '#FFD700',    // Golden yellow (like butter popcorn)
    accent: '#000000',       // Black (classic contrast)
    error: '#DC143C',        // Red for errors
    warning: '#FFA500',      // Orange for warnings
    info: '#FFD700',         // Yellow for info
    success: '#32CD32',      // Green for success
    surface: '#FFFFFF',      // White surface
    background: '#FFFEF7',   // Cream white background (like popcorn kernels)
    'on-primary': '#FFFFFF', // White text on red
    'on-secondary': '#000000', // Black text on yellow
    'on-surface': '#000000', // Black text on white
    'on-background': '#000000', // Black text on cream
  }

}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: defaultTheme,
    }
  }
})
