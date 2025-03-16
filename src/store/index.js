import { createStore } from 'vuex'

import authModule from './modules/auth/auth.js';

import warehousesModule from './modules/warehouses/warehouses.js';

import ordersModule from './modules/orders/orders.js';
import orderModule from './modules/orders/order.js';
import orderActionsModule from './modules/orders/actions.js';

import productsModule from './modules/products/products.js';
import productModule from './modules/products/product.js';
import productActionsModule from './modules/products/actions.js';

import clientsModule from './modules/clients/clients.js';
import clientModule from './modules/clients/client.js';
import clientActionsModule from './modules/clients/actions.js';



const store = createStore ({
    modules: {
        auth: authModule, 

        warehouses: warehousesModule,

        orders: ordersModule,
        order: orderModule,
        orderActions: orderActionsModule,

        products: productsModule,
        product: productModule, 
        productActions: productActionsModule,
        
        clients: clientsModule,
        client: clientModule, 
        clientActions: clientActionsModule,

    }
})

export default store;
