<template>
    <div>
        <TransitionRoot as="template" :show="sidebarOpen">
            <Dialog class="relative z-30 lg:hidden" @close="sidebarOpen = false">
                <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-gray-900/80" />
                </TransitionChild>
      
                <div class="fixed inset-0 flex">
                    <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
                        <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
                            <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                                    <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                                        <span class="sr-only">Close sidebar</span>
                                        <PhX class="size-6 text-white" aria-hidden="true" />
                                    </button>
                                </div>
                            </TransitionChild>
                            <!-- Sidebar component, swap this element with another sidebar if you like -->
                            <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 py-4">
                                <div class="flex h-16 shrink-0 items-center">
                                    <img class="h-8 w-auto" :src='logo' alt="Again"/>
                                </div>
                                <nav class="flex flex-1 flex-col">
                                    <ul role="list" class="flex flex-1 flex-col gap-y-7">
                                        <li>
                                            <ul role="list" class="-mx-2 space-y-1">
                                                <li v-for="item in updatedNavigation" :key="item.name">
                                                    <router-link v-if="!item.children" :to="item.href" :class="[item.current ? 'bg-gray-50 text-red-600' : 'text-gray-700 hover:bg-gray-50 hover:text-red-600', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                                                        <component :is="item.icon" :class="[item.current ? 'text-red-600' : 'text-gray-400 group-hover:text-red-600', 'size-6 shrink-0']" aria-hidden="true" />
                                                        {{ item.name }}
                                                    </router-link>
                                                    <Disclosure as="div" v-else v-slot="{ open }">
                                                        <DisclosureButton :class="[item.current ? 'bg-gray-50' : 'hover:bg-gray-50', 'flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm/6 font-semibold text-gray-700']">
                                                            <component :is="item.icon" class="size-6 shrink-0 text-gray-400" aria-hidden="true" />
                                                            {{ item.name }}
                                                            <PhCaretRight :class="[open ? 'rotate-90 text-gray-500' : 'text-gray-400', 'ml-auto size-5 shrink-0']" aria-hidden="true" />
                                                        </DisclosureButton>
                                                        <DisclosurePanel as="ul" class="mt-1 px-2">
                                                            <li v-for="subItem in item.children" :key="subItem.name">
                                                                <router-link :to="subItem.href" :class="[subItem.current ? 'bg-gray-50 text-red-600' : 'text-gray-700 hover:bg-gray-50 hover:text-red-600', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                                                                    <component :is="subItem.icon" :class="[subItem.current ? 'text-red-600' : 'text-gray-400 group-hover:text-red-600', 'size-6 shrink-0']" aria-hidden="true" />
                                                                    {{ subItem.name }}
                                                                </router-link>
                                                            </li>
                                                        </DisclosurePanel>
                                                    </Disclosure>
                                                </li>
                                            </ul>
                                        </li>
                                        <li class="mt-auto">
                                            <router-link to="/settings" class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-red-600">
                                                <PhGear class="size-6 shrink-0 text-gray-400 group-hover:text-red-600" aria-hidden="true" />
                                                Настройки
                                            </router-link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </TransitionRoot>
  
        <!-- Static sidebar for desktop -->
        <div class="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col">
            <!-- Sidebar component, swap this element with another sidebar if you like -->
            <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 py-4">
                <div class="flex h-16 shrink-0 items-center">
                    <img class="h-8 w-auto" :src='logo' alt="Again"/>
                </div>
                <nav class="flex flex-1 flex-col">
                    <ul role="list" class="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul role="list" class="-mx-2 space-y-1">
                                <li v-for="item in updatedNavigation" :key="item.name">
                                    <router-link v-if="!item.children" :to="item.href" :class="[item.current ? 'bg-gray-50 text-red-600' : 'text-gray-700 hover:bg-gray-50 hover:text-red-600', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                                        <component :is="item.icon" :class="[item.current ? 'text-red-600' : 'text-gray-400 group-hover:text-red-600', 'size-6 shrink-0']" aria-hidden="true" />
                                        {{ item.name }}
                                    </router-link>
                                    <Disclosure as="div" v-else v-slot="{ open }">
                                        <DisclosureButton :class="[item.current ? 'bg-gray-50' : 'hover:bg-gray-50', 'flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm/6 font-semibold text-gray-700']">
                                            <component :is="item.icon" class="size-6 shrink-0 text-gray-400" aria-hidden="true" />
                                            {{ item.name }}
                                            <PhCaretRight :class="[open ? 'rotate-90 text-gray-500' : 'text-gray-400', 'ml-auto size-5 shrink-0']" aria-hidden="true" />
                                        </DisclosureButton>
                                        <DisclosurePanel as="ul" class="mt-1 px-2">
                                            <li v-for="subItem in item.children" :key="subItem.name">
                                                <router-link :to="subItem.href" :class="[subItem.current ? 'bg-gray-50 text-red-600' : 'text-gray-700 hover:bg-gray-50 hover:text-red-600', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                                                    <component :is="subItem.icon" :class="[subItem.current ? 'text-red-600' : 'text-gray-400 group-hover:text-red-600', 'size-6 shrink-0']" aria-hidden="true" />
                                                    {{ subItem.name }}
                                                </router-link>
                                            </li>
                                        </DisclosurePanel>
                                    </Disclosure>
                                </li>
                            </ul>
                        </li>
                        <li class="mt-auto">
                            <router-link to="/settings" class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-red-600">
                                <PhGear class="size-6 shrink-0 text-gray-400 group-hover:text-red-600" aria-hidden="true" />
                                Настройки
                            </router-link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
  
        <div class="lg:pl-72">
            <div class="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8">
                <div class="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
                    <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
                        <span class="sr-only">Open sidebar</span>
                        <PhList class="size-6" aria-hidden="true" />
                    </button>

                    <!-- Separator -->
                    <div class="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

                    <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
<!--                        <form class="grid flex-1 grid-cols-1" action="#" method="GET">-->
<!--                            <input type="search" name="search" aria-label="Search" class="border-none col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-none placeholder:text-gray-400 sm:text-sm/6" placeholder="Search" />-->
<!--                            <PhMagnifyingGlass class="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400" aria-hidden="true" />-->
<!--                        </form>-->
                        <div class="flex items-center gap-x-4 lg:gap-x-6">
                            <button type="button" class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                                <span class="sr-only">View notifications</span>
                                <PhBell class="size-6" aria-hidden="true" />
                            </button>

                            <!-- Separator -->
                            <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                            <!-- Profile dropdown -->
                            <Menu as="div" class="relative">
                                <MenuButton class="-m-1.5 flex items-center p-1.5">
                                    <span class="sr-only">Open user menu</span>
                                    <PhUser class="size-6 shrink-0 text-gray-400 hover:text-red-500" />
<!--                                    <span class="hidden lg:flex lg:items-center">-->
<!--                                        <span class="ml-4 text-sm/6 font-semibold text-gray-900" aria-hidden="true">{{ user.name }}</span>-->
<!--                                        <PhCaretDown class="ml-2 size-5 text-gray-400" aria-hidden="true" />-->
<!--                                    </span>-->
                                </MenuButton>
                                <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                                    <MenuItems class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                        <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                                          <router-link :to="item.href" :class="[active ? 'bg-gray-50 outline-none' : '', 'block px-3 py-1 text-sm/6 text-gray-900']">{{ item.name }}</router-link>
                                        </MenuItem>
                                    </MenuItems>
                                </transition>
                            </Menu>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { Dialog, DialogPanel, Menu, MenuButton, MenuItem, MenuItems, Disclosure, DisclosureButton, DisclosurePanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { PhList, PhBell, PhHouse, PhWarehouse, PhComputerTower, PhDresser, PhFactory, PhBag, PhPackage, PhTruck, PhUserList, PhUnite, PhChartPie, PhChatTeardropDots, PhUser, PhGear, PhCaretDown, PhCaretRight, PhMagnifyingGlass, PhX, } from '@phosphor-icons/vue';

const logo = '/logo.svg'

const store = useStore()

const navigation = [
    { name: 'Главная', href: '/dashboard', icon: PhHouse },
    { name: 'Склад', href: '/warehouses', icon: PhWarehouse,
        children: [
            { name: 'ТехКарты', href: '/warehouses/recipes/list', icon: PhComputerTower },
            { name: 'Материалы', href: '/warehouses/materials/list', icon: PhWarehouse },
            { name: 'Производство', href: '/warehouses/production/list', icon: PhFactory },
        ],
    },
    { name: 'Заказы', href: '/orders/list', icon: PhBag },
    { name: 'Товары', href: '/products/list', icon: PhPackage },
    { name: 'Доставка', href: '/deliveries', icon: PhTruck },
    { name: 'Клиенты', href: '/clients/list', icon: PhUserList },
    { name: 'Интеграции', href: '/integrations', icon: PhUnite },
    { name: 'Аналитика', href: '/analytics', icon: PhChartPie },
    { name: 'Диалоги', href: '/dialogs', icon: PhChatTeardropDots },
]

const userNavigation = [
  { name: 'Ваш профиль', href: '#' },
  { name: 'Выйти', href: '/auth/logout' },
];

const user = computed(() => store.getters['auth/user'])

const route = useRoute()

const updatedNavigation = computed(() =>
    navigation.map(item => ({
        ...item,
        current: route.path === item.href,
    }))
)
  
const sidebarOpen = ref(false)
</script>