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
        },
    },

    {
        path: '/auth/logout',
        name: 'logout',
        component: () => import('../views/LogOut.vue'),
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
                children: [
                    {
                        path: '/warehouses/materials/list',
                        name: 'materials-list',
                        component: () => import('../components/warehouses/materials/list/MaterialsList.vue'),
                    },
                    {
                        path: '/warehouses/materials/create',
                        name: 'materials-create',
                        component: () => import('../components/warehouses/materials/create/MaterialCreate.vue'),
                    },
                    {
                        path: '/warehouses/recipes/list',
                        name: 'recipes-list',
                        component: () => import('../components/warehouses/recipes/list/RecipesList.vue'),
                    },
                    {
                        path: '/warehouses/recipes/create',
                        name: 'recipes-create',
                        component: () => import('../components/warehouses/recipes/create/RecipeCreate.vue'),
                    },
                    {
                        path: '/warehouses/production/list',
                        name: 'production-list',
                        component: () => import('../components/warehouses/production/list/ProductionList.vue'),
                    },
                    {
                        path: '/warehouses/production/create',
                        name: 'production-create',
                        component: () => import('../components/warehouses/production/create/ProductionCreate.vue'),
                    },
                ]
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
