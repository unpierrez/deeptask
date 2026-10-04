import { createApp } from 'vue';
import './styles/tokens.css';
import { Quasar, Notify, Loading } from 'quasar';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css';
import 'quasar/dist/quasar.css';
// After quasar.css so the global overrides win on equal specificity
import './style.css';
import App from './App.vue';
import router from './router';
import i18n from './i18n';

createApp(App)
  .use(router)
  .use(i18n)
  .use(Quasar, {
    plugins: { Notify, Loading },
    config: {
      dark: true,
      brand: {
        primary: '#ececee',
        secondary: '#a1a1aa',
        accent: '#3ddc84',
        dark: '#111113',
        'dark-page': '#0a0a0b',
        positive: '#3ddc84',
        negative: '#ff7a59',
        info: '#7aa2f7',
        warning: '#e5c15c',
      },
    },
  })
  .mount('#app');
