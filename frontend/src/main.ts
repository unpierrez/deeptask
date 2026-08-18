import { createApp } from 'vue';
import './style.css';
import { Quasar, Notify, Loading } from 'quasar';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css';
import 'quasar/dist/quasar.css';
import App from './App.vue';
import router from './router';
import i18n from './i18n';

createApp(App)
  .use(router)
  .use(i18n)
  .use(Quasar, {
    plugins: { Notify, Loading },
    config: {
      brand: {
        primary: '#0f0f0f',
        secondary: '#374151',
        accent: '#1f2937',
        dark: '#111827',
        positive: '#16a34a',
        negative: '#dc2626',
        info: '#0284c7',
        warning: '#f97316',
      },
    },
  })
  .mount('#app');
