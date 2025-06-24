import {createRouter, createWebHistory} from 'vue-router'
import store from '@/store'

const routes = [
    {
        path: '/auth',
        name: 'auth',
        component: () => import('../views/AuthView.vue'),
        beforeEnter: (to, from, next) => {
            if (store.getters['auth/authenticated']) {
                const redirectTo = to.query.redirect || '/dashboard';
                return next({path: redirectTo});
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
            // {
            //     path: '/warehouses',
            //     name: 'warehouses',
            //     component: () => import('../views/warehouses/WarehousesView.vue'),
            //     children: [
            //         {
            //             path: '/warehouses/materials/list',
            //             name: 'materials-list',
            //             component: () => import('../components/warehouses/materials/list/MaterialsList.vue'),
            //         },
            //         {
            //             path: '/warehouses/materials/create',
            //             name: 'materials-create',
            //             component: () => import('../components/warehouses/materials/create/MaterialCreate.vue'),
            //         },
            //         {
            //             path: '/warehouses/recipes/list',
            //             name: 'recipes-list',
            //             component: () => import('../components/warehouses/recipes/list/RecipesList.vue'),
            //         },
            //         {
            //             path: '/warehouses/recipes/create',
            //             name: 'recipes-create',
            //             component: () => import('../components/warehouses/recipes/create/RecipeCreate.vue'),
            //         },
            //         {
            //             path: '/warehouses/recipes/edit/:id',
            //             name: 'recipes-edit',
            //             component: () => import('../components/warehouses/recipes/edit/RecipeEdit.vue'),
            //         },
            //         {
            //             path: '/warehouses/production/list',
            //             name: 'production-list',
            //             component: () => import('../components/warehouses/production/index.vue'),
            //         },
            //         {
            //             path: '/warehouses/production/create',
            //             name: 'production-create',
            //             component: () => import('../components/warehouses/production/Add/Form.vue'),
            //         },
            //         {
            //             path: '/warehouses/production/edit/:id',
            //             name: 'production-edit',
            //             component: () => import('../components/warehouses/production/edit/index.vue'),
            //         },
            //         {
            //             path: '/warehouses/tech_operations',
            //             name: 'tech_operations',
            //             component: () => import('../components/warehouses/tech_operations/index.vue'),
            //         },
            //     ]
            // },
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
                        path: '/order/create',
                        name: 'orders-create',
                        component: () => import('../components/orders/create/OrderCreate.vue'),
                    },
                    {
                        path: '/order/update/:id',
                        name: 'orders-update',
                        component: () => import('../components/orders/update/order.vue'),
                    },
                    {
                        path: '/orders/tasks',
                        name: 'orders-tasks',
                        component: () => import('../components/orders/tasks'),
                    },
                    {
                        path: '/orders/tasks/create',
                        name: 'orders-tasks-create',
                        component: () => import('../components/orders/tasks/create/index.vue'),
                    },
                ]
            },


            {
                path: '/products',
                name: 'products',
                component: () => import('../views/products/ProductsView.vue'),
                redirect: '/products/list',
                children: [
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
                    {
                        path: '/product/update/:id',
                        name: 'products-update',
                        component: () => import('../components/products/update/ProductUpdate.vue'),
                    },
                    {
                        path: '/products/import',
                        name: 'products-import',
                        component: () => import('../components/products/import/index.vue'),
                    },
                    {
                        path: '/prices_stock',
                        name: 'prices_stock',
                        component: () => import('../components/price_stock/index.vue'),
                    },
                    {
                        path: '/products/reviews',
                        name: 'products-reviews',
                        component: () => import('../components/products/reviews/index.vue'),
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
                children: [
                    {
                        path: '/clients/list',
                        name: 'clients-list',
                        component: () => import('../components/clients/Index.vue'),
                    },
                    // {
                    //     path: '/clients/create',
                    //     name: 'clients-create',
                    //     component: () => import('../components/clients/create/ClientCreate.vue'),
                    // },
                    {
                        path: '/clients/discounts',
                        name: 'clients-discounts',
                        component: () => import('../components/discounts/Index.vue'),
                    },
                ]

            },
            {
                path: '/integrations',
                name: 'integrations',
                redirect: '/integrations/payments',
                component: () => import('../views/integrations/IntegrationsView.vue'),
                children: [
                    {
                        path: '/integrations/payments',
                        name: 'integrations-payments',
                        component: () => import('../components/integrations/payments/index.vue'),
                    },
                    {
                        path: '/integrations/cashboxes',
                        name: 'integrations-cashboxes',
                        component: () => import('../components/integrations/cashboxes/index.vue'),
                    },
                    {
                        path: '/integrations/delivery',
                        name: 'integrations-delivery',
                        component: () => import('../components/integrations/delivery/index.vue'),
                    },
                    {
                        path: '/integrations/messengers',
                        name: 'integrations-messengers',
                        component: () => import('../components/integrations/messengers/index.vue'),
                    },
                    {
                        path: '/integrations/email',
                        name: 'integrations-email',
                        component: () => import('../components/integrations/email/index.vue'),
                    },
                ]
            },
            {
                path: '/analytics',
                name: 'Analytics',
                redirect: '/analytics/summary',
                component: () => import('../views/analytics/AnalyticsView.vue'),
                children: [
                    {
                        path: '/analytics/summary',
                        name: 'analytics-summary',
                        component: () => import('../components/analytics/summary/index.vue'),

                    }
                ]
            },
            {
                path: '/dialogs',
                name: 'dialogs',
                redirect: '/dialogs/whatsapp',
                component: () => import('../views/dialogs/DialogsView.vue'),
                children: [
                    {
                        path: '/dialogs/chats',
                        name: 'dialogs-chats',
                        component: () => import('../components/dialogs/chats/index.vue'),
                    },
                    {
                        path: '/dialogs/whatsapp',
                        name: 'dialogs-whatsapp',
                        component: () => import('../components/dialogs/whatsapp/index.vue'),
                    },
                    {
                        path: '/dialogs/telegram',
                        name: 'dialogs-telegram',
                        component: () => import('../components/dialogs/telegram/index.vue'),

                    }
                ]
            },
            {
                path: '/users',
                name: 'users',
                component: () => import('../views/users/index.vue'),
            },
            {
                path: '/profile',
                name: 'profile',
                redirect: '/user-profile',
                component: () => import('../views/profile/ProfileView.vue'),
                children: [
                    {
                        path: '/user-profile',
                        name: 'user-profile',
                        component: () => import('../components/profile/Index.vue'),
                    },

                ]
            },
            {
                path: '/settings',
                name: 'settings',
                redirect: '/settings',
                component: () => import('../views/settings/SettingsView.vue'),
                children: [
                    {
                        path: '/settings',
                        name: 'settings-layout',
                        component: () => import('../components/settings/index.vue'),
                    },
                    {
                        path: '/settings/product-params',
                        name: 'settings-product-params',
                        component: () => import('../components/settings/product_params/'),
                    },
                    {
                        path: '/settings/variant-props',
                        name: 'settings-variant-props',
                        component: () => import('../components/settings/variant_props/index.vue'),
                    },
                    {
                        path: '/settings/delivery-methods',
                        name: 'settings-delivery-methods',
                        component: () => import('../components/settings/delivery_method/index.vue'),
                    },
                    {
                        path: '/settings/custom-statuses',
                        name: 'settings-custom-statuses',
                        component: () => import('../components/settings/custom_status/index.vue'),
                    },
                    {
                        path: '/settings/one-click-order',
                        name: 'settings-one-click-order',
                        component: () => import('../components/settings/one_click_order/index.vue')
                    }
                ]
            }


            // {
            //     path: '/settings',
            //     name: 'settings',
            //     component: () => import('../views/settings/SettingsView.vue'),
            // },


        ],

        beforeEnter: (to, from, next) => {
            if (!store.getters['auth/authenticated']) {
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
