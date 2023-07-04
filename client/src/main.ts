import './assets/main.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from "axios"
import { useStore } from './store';
import { Popover } from 'bootstrap';

axios.defaults.withCredentials = true;

document.querySelectorAll('[data-bs-toggle="popover"]')
  .forEach(popover => {
    new Popover(popover)
  })

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(router);

const store = useStore();

store.checkAuthentication().then(() => {
  app.mount('#app');
});
