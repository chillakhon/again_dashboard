// src/echo.js - Упрощенная версия
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import Cookies from "js-cookie";

window.Pusher = Pusher;

// Environment variables
const REVERB_KEY = process.env.VUE_APP_REVERB_APP_KEY || '';
const REVERB_HOST = process.env.VUE_APP_REVERB_HOST || window.location.hostname;
const REVERB_PORT = Number(process.env.VUE_APP_REVERB_PORT || 8002);
const REVERB_SCHEME = process.env.VUE_APP_REVERB_SCHEME || (location.protocol === 'https:' ? 'https' : 'http');
const API_BASE = (process.env.VUE_APP_API_BASE_URL || '').replace(/\/$/, '');

const authEndpoint = API_BASE ? `${API_BASE}/broadcasting/auth` : '/broadcasting/auth';
const useTLS = REVERB_SCHEME === 'https';
const access_token = Cookies.get('access_token');

// Простая конфигурация
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: REVERB_KEY,
    cluster: 'mt1',
    wsHost: REVERB_HOST,
    wsPort: REVERB_PORT,
    wssPort: REVERB_PORT,
    forceTLS: useTLS,
    encrypted: useTLS,
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
    authEndpoint: authEndpoint,
    auth: {
        headers: {
            'Authorization': `Bearer ${access_token}`,
        },
    },
});

console.log('Echo instance created:', window.Echo);
export default window.Echo;