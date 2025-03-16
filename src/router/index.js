import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
    {
        path: '/auth',
        name: 'auth',
        component: () => import('../views/AuthView.vue'),
        beforeEnter: (to, from, next) => {
            if (store.getters['auth/authenticated']) {
                const redirectTo = to.query.redirect || '/dashboard';
                return next({ path: redirectTo });
            }
            next()
        }
    },
    {
        path: '/',
        name: 'MainView',
        component: () => import('../views/MainView.vue'),
        redirect: '/dashboard',
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('../views/dashboard/DashboardView.vue'),
            },
            {
                path: '/warehouses',
                name: 'warehouses',
                component: () => import('../views/warehouses/WarehousesView.vue'),
            },
            {
                path: '/orders',
                name: 'orders',
                component: () => import('../views/orders/OrdersView.vue'),
                redirect: '/orders/list',
                children: [
                    {
                        path: '/orders/list',
                        name: 'orders-list',
                        component: () => import('../components/orders/list/OrdersList.vue'),
                    },
                    {
                        path: '/orders/create',
                        name: 'orders-create',
                        component: () => import('../components/orders/create/OrderCreate.vue'),
                    },
                ]
            },
            {
                path: '/products',
                name: 'products',
                component: () => import('../views/products/ProductsView.vue'),
                redirect: '/products/list',
                children:[
                    {
                        path: '/products/list',
                        name: 'products-list',
                        component: () => import('../components/products/list/ProductsList.vue'),
                    },
                    {
                        path: '/products/create',
                        name: 'products-create',
                        component: () => import('../components/products/create/ProductCreate.vue'),
                    },
                ]
            },
            {
                path: '/deliveries',
                name: 'Deliveries',
                component: () => import('../views/deliveries/DeliveriesView.vue'),
            },
            {
                path: '/clients',
                name: 'clients',
                redirect: '/clients/list',
                component: () => import('../views/clients/ClientsView.vue'),
                children:[
                    {
                        path: '/clients/list',
                        name: 'clients-list',
                        component: () => import('../components/clients/list/ClientsList.vue'),
                    },
                    {
                        path: '/clients/create',
                        name: 'clients-create',
                        component: () => import('../components/clients/create/ClientCreate.vue'),
                    },
                ]

            },
            {
                path: '/integrations',
                name: 'integrations',
                component: () => import('../views/integrations/IntegrationsView.vue'),
            },
            {
                path: '/analytics',
                name: 'Analytics',
                component: () => import('../views/analytics/AnalyticsView.vue'),
            },
            {
                path: '/dialogs',
                name: 'dialogs',
                component: () => import('../views/dialogs/DialogsView.vue'),
            },
            {
                path: '/profile',
                name: 'profile',
                component: () => import('../views/profile/ProfileView.vue'),
            },
            {
                path: '/settings',
                name: 'settings',
                component: () => import('../views/settings/SettingsView.vue'),
            },
            
        ],

        beforeEnter: (to, from, next) => {
            if ( !store.getters['auth/authenticated'] ) {
                return next({
                    path: '/auth'
                })
            }
            next()
        }
    }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
