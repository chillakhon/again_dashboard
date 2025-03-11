import { createStore } from 'vuex'

import authModule from './modules/auth/auth.js';


const store = createStore ({
    modules: {
        auth: authModule, 

    }
})

export default store;
