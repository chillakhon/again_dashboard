import { createStore } from 'vuex'

import authModule from './modules/auth/auth.js';

import productsModule from './modules/products/products.js';
import productModule from './modules/products/product.js';
import productActionsModule from './modules/products/actions.js';


const store = createStore ({
    modules: {
        auth: authModule, 

        products: productsModule,
        product: productModule, 
        productActions: productActionsModule,

    }
})

export default store;
