import './assets/sass/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'vue3-toastify/dist/index.css';

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
