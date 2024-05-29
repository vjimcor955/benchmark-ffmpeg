import './assets/sass/utilities/reset.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'

import App from './App.vue'
import router from './router/router.js'

import 'vue3-toastify/dist/index.css';

const pinia = createPinia()
pinia.use(piniaPluginPersist)

createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')