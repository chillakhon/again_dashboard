<template>
  <div>
    <!-- Mobile sidebar -->
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog class="relative z-40 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild
            as="template"
            enter="transition-opacity ease-linear duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leave-from="opacity-100"
            leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/80 backdrop-blur-sm"/>
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild
              as="template"
              enter="transition ease-in-out duration-300 transform"
              enter-from="-translate-x-full"
              enter-to="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leave-from="translate-x-0"
              leave-to="-translate-x-full"
          >
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild
                  as="template"
                  enter="ease-in-out duration-300"
                  enter-from="opacity-0"
                  enter-to="opacity-100"
                  leave="ease-in-out duration-300"
                  leave-from="opacity-100"
                  leave-to="opacity-0"
              >
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                      type="button"
                      class="-m-2.5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      @click="sidebarOpen = false"
                  >
                    <span class="sr-only">Close sidebar</span>
                    <PhX class="size-6 text-white" aria-hidden="true"/>
                  </button>
                </div>
              </TransitionChild>

              <!-- Sidebar content -->
              <div
                  class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 py-4 shadow-xl">
                <div class="flex h-16 shrink-0 items-center">
                  <img class="h-8 w-auto" :src='logo' alt="Company Logo"/>
                </div>

                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-4">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in updatedNavigation" :key="item.name">
                          <router-link
                              v-if="!item.children"
                              :to="item.href"
                              :class="[
                              item.current
                                ? 'bg-gradient-to-r from-red-50 to-white text-red-600 border-l-4 border-red-500'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-red-600',
                              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold transition-colors'
                            ]"
                              @click="closeSidebar"
                          >
                            <component
                                :is="item.icon"
                                :class="[
                                item.current
                                  ? 'text-red-600'
                                  : 'text-gray-400 group-hover:text-red-600',
                                'size-6 shrink-0'
                              ]"
                                aria-hidden="true"
                            />
                            {{ item.name }}
                            <span v-if="item.notification"
                                  class="ml-auto inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                              {{ item.notification }}
                            </span>
                          </router-link>

                          <Disclosure as="div" v-else v-slot="{ open }">
                            <DisclosureButton
                                :class="[
                                item.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                                'flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold text-gray-700 transition-colors'
                              ]"
                            >
                              <component :is="item.icon" class="size-6 shrink-0 text-gray-400" aria-hidden="true"/>
                              {{ item.name }}
                              <PhCaretRight
                                  :class="[
                                  open ? 'rotate-90 text-gray-500' : 'text-gray-400',
                                  'ml-auto size-5 shrink-0 transition-transform'
                                ]"
                                  aria-hidden="true"
                              />
                            </DisclosureButton>

                            <DisclosurePanel as="ul" class="mt-1 pl-9">
                              <li v-for="subItem in item.children" :key="subItem.name">
                                <router-link
                                    :to="subItem.href"
                                    @click="closeSidebar"
                                    :class="[
                                    subItem.current
                                    ? 'bg-gradient-to-r from-red-50 to-white text-red-600 border-l-4 border-red-500'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-red-600',
                                    'group flex gap-x-3 rounded-md p-2 text-sm font-semibold transition-colors'
                                  ]"
                                >
                                  <component
                                      :is="subItem.icon"
                                      :class="[
                                      subItem.current
                                        ? 'text-red-600'
                                        : 'text-gray-400 group-hover:text-red-600',
                                      'size-5 shrink-0'
                                    ]"
                                      aria-hidden="true"
                                  />
                                  {{ subItem.name }}
                                </router-link>
                              </li>
                            </DisclosurePanel>
                          </Disclosure>
                        </li>
                      </ul>
                    </li>

                    <li class="mt-auto">

                      <router-link
                          to="/settings"
                          class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                          @click="closeSidebar"
                      >
                        <PhGear class="size-6 shrink-0 text-gray-400 group-hover:text-red-600" aria-hidden="true"/>
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
      <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div class="flex h-16 shrink-0 items-center">
          <img class="h-8 w-auto" :src='logo' alt="Company Logo"/>
        </div>


        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-4">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in updatedNavigation" :key="item.name">
                  <router-link
                      v-if="!item.children"
                      :to="item.href"
                      :class="[
                      item.current
                        ? 'bg-gradient-to-r from-red-50 to-white text-red-600 border-l-4 border-red-500'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-red-600',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-medium transition-colors'
                    ]"
                  >
                    <component
                        :is="item.icon"
                        :class="[
                        item.current
                          ? 'text-red-600'
                          : 'text-gray-400 group-hover:text-red-600',
                        'size-6 shrink-0'
                      ]"
                        aria-hidden="true"
                    />
                    {{ item.name }}
                    <span v-if="item.notification"
                          class="ml-auto inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                      {{ item.notification }}
                    </span>
                  </router-link>

                  <Disclosure as="div" v-else v-slot="{ open }">
                    <DisclosureButton
                        :class="[
                        item.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                        'flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-medium text-gray-700 transition-colors'
                      ]"
                    >
                      <component :is="item.icon" class="size-6 shrink-0 text-gray-400" aria-hidden="true"/>
                      {{ item.name }}
                      <PhCaretRight
                          :class="[
                          open ? 'rotate-90 text-gray-500' : 'text-gray-400',
                          'ml-auto size-5 shrink-0 transition-transform'
                        ]"
                          aria-hidden="true"
                      />
                    </DisclosureButton>

                    <DisclosurePanel as="ul" class="mt-1 pl-9">
                      <li v-for="subItem in item.children" :key="subItem.name">
                        <router-link
                            :to="subItem.href"
                            :class="[
                            subItem.current
                              ? 'bg-gradient-to-r from-red-50 to-white text-red-600 border-l-4 border-red-500'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-red-600',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-medium transition-colors'
                          ]"
                        >
                          <component
                              :is="subItem.icon"
                              :class="[
                              subItem.current
                                ? 'text-red-600'
                                : 'text-gray-400 group-hover:text-red-600',
                              'size-5 shrink-0'
                            ]"
                              aria-hidden="true"
                          />
                          {{ subItem.name }}
                        </router-link>
                      </li>
                    </DisclosurePanel>
                  </Disclosure>
                </li>
              </ul>
            </li>

            <li class="mt-auto">

              <router-link
                  to="/settings"
                  class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
              >
                <PhGear class="size-6 shrink-0 text-gray-400 group-hover:text-red-600" aria-hidden="true"/>
                Настройки
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Main content area -->
    <div class="lg:pl-72">
      <div class="sticky top-0 z-20 lg:mx-auto lg:px-8">
        <div
            class="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none"
        >
          <button
              type="button"
              class="-m-2.5 p-2.5 text-gray-700 lg:hidden rounded-md hover:bg-gray-100 transition-colors"
              @click="sidebarOpen = true"
          >
            <span class="sr-only">Open sidebar</span>
            <PhList class="size-6" aria-hidden="true"/>
          </button>

          <div class="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true"/>

          <div class="flex  flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">


            <div class="flex items-center gap-x-4 lg:gap-x-6">
              <button
                  type="button"
                  class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 relative rounded-md hover:bg-gray-100 transition-colors"
              >
                <span class="sr-only">View notifications</span>
                <PhBell class="size-6"/>
                <span class="absolute top-1 right-1 block size-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>

              <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true"/>

              <!-- Profile dropdown -->
              <Menu as="div" class="relative">
                <MenuButton class="-m-1.5 flex items-center p-1.5">
                  <span class="sr-only">Open user menu</span>
                  <span class="flex items-center">
                    <span
                        class="inline-flex items-center justify-center size-8 rounded-full bg-gradient-to-r from-red-500 to-red-300">
                      <span class="text-sm font-medium leading-none text-white">JD</span>
                    </span>
                    <span class="ml-2 hidden lg:flex lg:items-center">
                      <span class="text-sm font-medium text-gray-700">John Doe</span>
                      <!--                      <PhCaretRight class="ml-1 size-4 text-gray-500"/>-->
                    </span>
                  </span>
                </MenuButton>
                <transition
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems
                      class="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                  >
                    <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                      <router-link
                          :to="item.href"
                          :class="[
                          active ? 'bg-gray-50' : '',
                          'block px-4 py-2 text-sm text-gray-700 flex items-center gap-2'
                        ]"
                      >
                        <component
                            :is="item.icon"
                            class="size-4 text-gray-500"
                            v-if="item.icon"
                        />
                        {{ item.name }}
                      </router-link>
                    </MenuItem>

                    <div class="border-t border-gray-200 my-2"></div>

                    <MenuItem v-slot="{ active }">
                      <a
                          href="#"
                          :class="[
                          active ? 'bg-gray-50' : '',
                          'block px-4 py-2 text-sm text-gray-700 flex items-center gap-2'
                        ]"
                      >
                        <PhQuestion class="size-4 text-gray-500"/>
                        Help & Support
                      </a>
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
import {computed, ref} from 'vue'
import {useRoute} from 'vue-router';
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import {
  PhBag,
  PhBell,
  PhCaretRight,
  PhChartPie,
  PhChatTeardropDots,
  PhComputerTower,
  PhFactory,
  PhGear,
  PhHouse,
  PhList,
  PhPackage,
  PhQuestion,
  PhSignOut,
  PhTruck,
  PhUnite,
  PhUser,
  PhUserList,
  PhWarehouse,
  PhX,
  PhUsers
} from '@phosphor-icons/vue';


const logo = '/logo.svg'

const navigation = [
  {name: 'Главная', href: '/dashboard', icon: PhHouse, notification: 3},
  {
    name: 'Заказы', href: '/orders/list', icon: PhBag,
    children: [
      {name: 'Все заказы', href: '/orders/list', icon: PhList, notification: 100,},
      {name: 'Задачи', href: '/orders/tasks', icon: PhList},
    ],
  },
  {
    name: 'Товары', href: '/products/list', icon: PhPackage,
    children: [
      {name: 'Каталог товаров', href: '/products/list', icon: PhList},
      // {name: 'Импорт/Экспорт', href: '/products/import', icon: PhComputerTower},
      {name: 'Цены и остатки', href: '/prices_stock', icon: PhWarehouse},
      {name: 'Отзывы', href: '/products/reviews', icon: PhChatTeardropDots},
    ],
  },
  {
    name: 'Клиенты', href: '/clients/list', icon: PhUserList,
    children: [
      {name: 'Все клиенты', href: '/clients/list', icon: PhUserList},
      {name: 'Скидки и промокоды', href: '/clients/discounts', icon: PhUnite},
    ]
  },
  {
    name: 'Интеграции', href: '/integrations', icon: PhUnite,
    children: [
      {name: 'Системы платежей', href: '/integrations/payments', icon: PhBag},
      {name: 'Облачные кассы', href: '/integrations/cashboxes', icon: PhComputerTower},
      {name: 'Сервисы доставки', href: '/integrations/delivery', icon: PhTruck},
      {name: 'Email-рассылки', href: '/integrations/email', icon: PhChatTeardropDots},
      {name: 'Мессенджеры', href: '/integrations/messengers', icon: PhChatTeardropDots},
    ]
  },
  {
    name: 'Аналитика', href: '/analytics', icon: PhChartPie,
    children: [
      {name: 'Сводка', href: '/analytics/summary', icon: PhChartPie}
    ]
  },
  {
    name: 'Диалоги', href: '/dialogs', icon: PhChatTeardropDots,
    children: [
      {name: 'Сообщения', href: '/dialogs/chats', icon: PhChatTeardropDots},
      {name: 'Whatsapp', href: '/dialogs/whatsapp', icon: PhChatTeardropDots},
      {name: 'Telegram', href: '/dialogs/telegram', icon: PhChatTeardropDots},
    ]
  },
  {
    name: 'Склад', href: '/warehouses', icon: PhWarehouse,
    children: [
      {name: 'Техкарты', href: '/warehouses/recipes/list', icon: PhList},
      // {name: 'Техоперации', href: '/warehouses/tech_operations', icon: PhPackage},
      {name: 'Производственные задания', href: '/warehouses/production/list', icon: PhFactory},
    ],
  },
  {name: 'Доставка', href: '/deliveries', icon: PhTruck},
  {name: 'Пользователи', href: '/users', icon: PhUsers},
]

const userNavigation = [
  {name: 'Ваш профиль', href: '/profile', icon: PhUser},
  // {name: 'Настройки', href: '/settings', icon: PhGear},
  {name: 'Выйти', href: '/auth/logout', icon: PhSignOut},
];

const route = useRoute()

const updatedNavigation = computed(() =>
    navigation.map(item => ({
      ...item,
      current: route.path.startsWith(item.href) ||
          (item.children && item.children.some(child => route.path.startsWith(child.href))),
      children: item.children?.map(child => ({
        ...child,
        current: route.path.startsWith(child.href)
      }))
    }))
)

const sidebarOpen = ref(false)

const closeSidebar = () => {
  sidebarOpen.value = false;
};
</script>