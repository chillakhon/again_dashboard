import {createApp} from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import axiosPlugin from './plugins/axios';

import store from './store'
import Cookies from 'js-cookie'

import './assets/css/tailwind.css'
import './assets/css/main.css'

require('./store/modules/auth/subscriber.js');

const access_token = Cookies.get('access_token');

store.dispatch('auth/attempt', access_token).then(() => {
    createApp(App)
        .use(store)
        .use(router)
        .use(axiosPlugin)
        .mount('#app')
})