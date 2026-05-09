<template>
  <Loader v-if="isLoading"/>

  <div v-else-if="!client" class="p-6 text-sm text-gray-500">
    Клиент не найден
  </div>

  <div v-else class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3 min-w-0">
        <RouterLink
            to="/clients/list"
            class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
        >
          <ChevronLeft class="h-4 w-4"/>
          К списку
        </RouterLink>
        <h1 class="truncate text-xl font-semibold text-gray-900">
          {{ fullName || client.email || `Клиент #${client.id}` }}
        </h1>
      </div>

      <div class="flex items-center gap-2">
        <ClientEditModal
            v-if="clientForModal"
            :client="clientForModal"
            button-name="Редактировать"
            @updated="handleUpdated"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Main column -->
      <div class="space-y-6 lg:col-span-2">
        <!-- Stats cards -->
        <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div class="rounded-lg border bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
            <div class="text-xs text-gray-500">Всего заказов</div>
            <div class="mt-1 text-2xl font-semibold text-gray-900">
              {{ statistics?.total_orders ?? 0 }}
            </div>
          </div>
          <div class="rounded-lg border bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
            <div class="text-xs text-gray-500">Оборот</div>
            <div class="mt-1 text-2xl font-semibold text-gray-900">
              {{ formatPrice(statistics?.total_spent) }}
            </div>
          </div>
          <div class="rounded-lg border bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
            <div class="text-xs text-gray-500">Средний чек</div>
            <div class="mt-1 text-2xl font-semibold text-gray-900">
              {{ formatPrice(statistics?.average_order_value) }}
            </div>
          </div>
          <div class="rounded-lg border bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
            <div class="text-xs text-gray-500">Последний заказ</div>
            <div class="mt-1 text-sm font-medium text-gray-900">
              {{
                statistics?.last_order_date
                    ? formatDateToRussian(statistics.last_order_date)
                    : '—'
              }}
            </div>
          </div>
        </div>

        <!-- Orders -->
        <section class="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
          <header class="flex items-center justify-between border-b px-4 py-3">
            <h3 class="text-sm font-semibold text-gray-900">Заказы</h3>
            <span v-if="ordersMeta?.total" class="text-xs text-gray-500">
              Всего: {{ ordersMeta.total }}
            </span>
          </header>

          <div v-if="ordersLoading" class="flex items-center justify-center py-10">
            <Spinner/>
          </div>

          <div
              v-else-if="!orders.length"
              class="px-4 py-10 text-center text-sm text-muted-foreground"
          >
            У клиента пока нет заказов
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-muted/50 text-left">
              <tr>
                <th class="px-4 py-2 font-medium">№</th>
                <th class="px-4 py-2 font-medium">Дата</th>
                <th class="px-4 py-2 font-medium">Сумма</th>
                <th class="px-4 py-2 font-medium">Статус</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="o in orders" :key="o.id" class="border-t">
                <td class="px-4 py-2 whitespace-nowrap">
                  <RouterLink
                      :to="`/order/${o.id}`"
                      class="text-blue-600 hover:underline"
                  >
                    {{ o.order_number || o.id }}
                  </RouterLink>
                </td>
                <td class="px-4 py-2 whitespace-nowrap">
                  {{ formatDateToRussian(o.created_at) }}
                </td>
                <td class="px-4 py-2 whitespace-nowrap">
                  {{ formatPrice(o.total_amount) }}
                </td>
                <td class="px-4 py-2">
                  <span
                      v-if="getStatus('order', String(o.status ?? '').trim())"
                      :style="{ backgroundColor: getStatus('order', String(o.status ?? '').trim())?.color }"
                      class="rounded px-2 py-1 text-white whitespace-nowrap"
                  >
                    {{ getStatus('order', String(o.status ?? '').trim())?.label }}
                  </span>
                  <span v-else class="text-muted-foreground">—</span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <div
              v-if="ordersMeta && ordersMeta.last_page > 1"
              class="flex items-center justify-between gap-3 border-t px-4 py-3"
          >
            <div class="text-xs text-muted-foreground">
              Стр. {{ ordersMeta.current_page }} из {{ ordersMeta.last_page }}
            </div>
            <div class="flex gap-2">
              <Button
                  variant="outline"
                  size="sm"
                  :disabled="ordersMeta.current_page <= 1 || ordersLoading"
                  @click="changeOrdersPage(ordersMeta.current_page - 1)"
              >
                Назад
              </Button>
              <Button
                  variant="outline"
                  size="sm"
                  :disabled="ordersMeta.current_page >= ordersMeta.last_page || ordersLoading"
                  @click="changeOrdersPage(ordersMeta.current_page + 1)"
              >
                Вперёд
              </Button>
            </div>
          </div>
        </section>
      </div>

      <!-- Side column -->
      <aside class="space-y-6">
        <!-- Контакты -->
        <section class="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
          <h3 class="text-sm font-semibold text-gray-900">Контакты</h3>
          <dl class="mt-3 space-y-2 text-sm">
            <div>
              <dt class="text-xs uppercase text-gray-500">ФИО</dt>
              <dd class="text-gray-900">{{ fullName || '—' }}</dd>
            </div>
            <div>
              <dt class="text-xs uppercase text-gray-500">Email</dt>
              <dd class="text-gray-900">{{ client.email || '—' }}</dd>
            </div>
            <div>
              <dt class="text-xs uppercase text-gray-500">Телефон</dt>
              <dd class="text-gray-900">{{ client.profile?.phone || '—' }}</dd>
            </div>
            <div>
              <dt class="text-xs uppercase text-gray-500">Адрес</dt>
              <dd class="text-gray-900">{{ client.profile?.address || '—' }}</dd>
            </div>
            <div>
              <dt class="text-xs uppercase text-gray-500">Дата рождения</dt>
              <dd class="text-gray-900">
                {{
                  client.profile?.birthday
                      ? formatDateToRussian(client.profile.birthday)
                      : '—'
                }}
              </dd>
            </div>
            <div>
              <dt class="text-xs uppercase text-gray-500">
                Согласие на обработку ПД
              </dt>
              <dd class="text-gray-900">
                {{ client.personal_data_consent ? 'Да' : '—' }}
              </dd>
            </div>
            <div>
              <dt class="text-xs uppercase text-gray-500">Зарегистрирован</dt>
              <dd class="text-gray-900">
                {{ client.created_at ? formatDateToRussian(client.created_at) : '—' }}
              </dd>
            </div>
          </dl>
        </section>

        <!-- Бонусы -->
        <section
            v-if="client.bonus_balance !== undefined && client.bonus_balance !== null"
            class="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5"
        >
          <h3 class="text-sm font-semibold text-gray-900">Бонусы</h3>
          <div class="mt-2 text-xl font-semibold text-gray-900">
            {{ Number(client.bonus_balance).toLocaleString('ru-RU') }}
          </div>
        </section>

        <!-- Теги -->
        <section
            v-if="Array.isArray(client.tags) && client.tags.length"
            class="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5"
        >
          <h3 class="text-sm font-semibold text-gray-900">Теги</h3>
          <div class="mt-3 flex flex-wrap gap-2">
            <span
                v-for="tag in client.tags"
                :key="tag.id"
                class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                :style="tag.color ? { backgroundColor: tag.color, color: '#fff' } : undefined"
                :class="!tag.color ? 'bg-gray-100 text-gray-700' : undefined"
            >
              {{ tag.name }}
            </span>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import {RouterLink, useRoute} from 'vue-router';
import axios from 'axios';
import {toast} from 'vue-sonner';
import {ChevronLeft} from 'lucide-vue-next';

import Loader from '@/components/common/Loader.vue';
import {Spinner} from '@/components/ui/spinner';
import {Button} from '@/components/ui/button';
import ClientEditModal from '@/components/clients/Edit/ClientEditModal.vue';

import {useDateFormat} from '@/composables/useDateFormat';
import {usePriceFormatter} from '@/composables/usePriceFormatter';
import {useStatusFunctions} from '@/composables/useStatusFunctions';

const route = useRoute();
const {formatDateToRussian} = useDateFormat();
const {formatPrice} = usePriceFormatter();
const {getStatus, getAllStatuses, cachedStatuses} = useStatusFunctions();

const isLoading = ref(true);
const client = ref<any>(null);
const statistics = ref<any>(null);

const orders = ref<any[]>([]);
const ordersMeta = ref<any | null>(null);
const ordersLoading = ref(false);
const ordersPage = ref(1);
const ordersPerPage = 20;

const fullName = computed(() => {
  if (!client.value) return '';
  const p = client.value.profile || {};
  return (
      [p.last_name, p.first_name, p.middle_name]
          .filter(Boolean)
          .join(' ')
          .trim() || client.value.name || ''
  );
});

// Для передачи в ClientEditModal (ожидает тип из @/types/client)
const clientForModal = computed(() => {
  if (!client.value) return null;
  const c = client.value;
  return {
    id: c.id,
    name: fullName.value || c.email || '',
    email: c.email ?? '',
    profile: c.profile ?? undefined,
    tags: c.tags ?? undefined,
    created_at: c.created_at ?? '',
    updated_at: c.updated_at ?? undefined,
  };
});

async function fetchClient(id: number | string) {
  isLoading.value = true;
  try {
    const {data} = await axios.get(`/clients/${id}`);
    client.value = data?.client ?? data ?? null;
    statistics.value = data?.statistics ?? null;
  } catch (e) {
    console.error('Не удалось загрузить клиента', e);
    toast.error('Не удалось загрузить клиента');
    client.value = null;
    statistics.value = null;
  } finally {
    isLoading.value = false;
  }
}

async function fetchOrders(id: number | string) {
  ordersLoading.value = true;
  try {
    if (!cachedStatuses.value) {
      await getAllStatuses();
    }
    const {data} = await axios.get('/orders', {
      params: {
        client_id: id,
        per_page: ordersPerPage,
        page: ordersPage.value,
      },
    });
    orders.value = data?.data ?? [];
    ordersMeta.value = data?.meta ?? null;
  } catch (e) {
    console.error(e);
    toast.error('Не удалось загрузить заказы клиента');
    orders.value = [];
    ordersMeta.value = null;
  } finally {
    ordersLoading.value = false;
  }
}

function changeOrdersPage(p: number) {
  ordersPage.value = p;
  if (client.value?.id) fetchOrders(client.value.id);
}

function handleUpdated() {
  if (client.value?.id) {
    fetchClient(client.value.id);
  }
}

onMounted(async () => {
  const id = route.params.id;
  if (!id) return;
  await fetchClient(id as string);
  if (client.value?.id) fetchOrders(client.value.id);
});

// На случай перехода между /clients/:id -> /clients/:другой_id
watch(
    () => route.params.id,
    async (newId, oldId) => {
      if (!newId || newId === oldId) return;
      ordersPage.value = 1;
      await fetchClient(newId as string);
      if (client.value?.id) fetchOrders(client.value.id);
    },
);
</script>
