<template>
  <div
    class="-mx-4 px-4 py-8 ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-6 lg:col-span-1"
  >
    <h3 class="text-sm/6 font-medium text-gray-900">Добавить клиента</h3>
    <p class="mt-1 text-sm text-gray-500">
      Выберите существующего клиента или быстро создайте нового.
    </p>

    <ModalDialog
      v-if="!resolvedSelectedClient"
      ref="modalRef"
      title="Добавить клиента"
      description="Найдите клиента по имени, телефону или email, либо создайте нового."
      dynamic-style="sm:max-w-2xl"
    >
      <template #trigger>
        <Button type="button" variant="outline" class="mt-5 w-full gap-2">
          <Plus class="h-4 w-4" />
          Выбрать или создать клиента
        </Button>
      </template>

      <template #content>
        <div class="space-y-6">
          <div class="space-y-4">
            <div class="relative">
              <Search
                class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              />
              <input
                v-model.trim="search"
                type="text"
                placeholder="Поиск клиента (имя, телефон, email)"
                class="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div
              class="max-h-72 overflow-y-auto rounded-md border border-gray-200"
            >
              <div v-if="sending" class="px-4 py-6 text-sm text-gray-500">
                Поиск клиентов...
              </div>

              <div
                v-else-if="filteredClients.length"
                class="divide-y divide-gray-200"
              >
                <button
                  v-for="client in filteredClients"
                  :key="client.id"
                  type="button"
                  class="flex w-full items-start justify-between gap-4 px-4 py-3 text-left transition hover:bg-gray-50"
                  @click="handleSelectExistingClient(client)"
                >
                  <div class="min-w-0">
                    <p class="truncate text-sm font-medium text-gray-900">
                      {{ client.first_name }} {{ client.last_name }}
                    </p>
                    <p class="mt-1 text-xs text-gray-500">
                      {{ client.phone || "Телефон не указан" }}
                    </p>
                  </div>

                  <div class="shrink-0 text-right">
                    <p class="text-sm text-gray-900">
                      {{ client.email || "Email не указан" }}
                    </p>
                    <p class="mt-1 text-xs text-gray-500">
                      ID: {{ client.id }}
                    </p>
                  </div>
                </button>
              </div>

              <div v-else class="px-4 py-6 text-sm text-gray-500">
                Клиенты не найдены.
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-6">
            <h4 class="text-sm font-medium text-gray-900">
              Быстрое создание клиента
            </h4>
            <p class="mt-1 text-sm text-gray-500">
              Если нужного клиента нет в списке, создайте его здесь.
            </p>

            <form class="mt-4 space-y-4" @submit.prevent="handleCreate">
              <div>
                <label
                  for="quick_first_name"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Имя</label
                >
                <Input
                  id="quick_first_name"
                  v-model.trim="quickClient.first_name"
                  type="text"
                  placeholder="Введите имя"
                />
                <p
                  v-if="quickClientErrors.first_name"
                  class="mt-1 text-xs text-red-600"
                >
                  {{ quickClientErrors.first_name }}
                </p>
              </div>

              <div>
                <label
                  for="quick_last_name"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Фамилия</label
                >
                <Input
                  id="quick_last_name"
                  v-model.trim="quickClient.last_name"
                  type="text"
                  placeholder="Введите фамилию"
                />
                <p
                  v-if="quickClientErrors.last_name"
                  class="mt-1 text-xs text-red-600"
                >
                  {{ quickClientErrors.last_name }}
                </p>
              </div>

              <div>
                <label
                  for="quick_phone"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Телефон</label
                >
                <Input
                  id="quick_phone"
                  v-model.trim="quickClient.phone"
                  type="text"
                  placeholder="+7..."
                />
                <p
                  v-if="quickClientErrors.phone"
                  class="mt-1 text-xs text-red-600"
                >
                  {{ quickClientErrors.phone }}
                </p>
              </div>

              <div>
                <label
                  for="quick_email"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Email</label
                >
                <Input
                  id="quick_email"
                  v-model.trim="quickClient.email"
                  type="email"
                  placeholder="example@mail.com"
                />
                <p
                  v-if="quickClientErrors.email"
                  class="mt-1 text-xs text-red-600"
                >
                  {{ quickClientErrors.email }}
                </p>
              </div>

              <div class="space-y-2">
                <label class="flex items-center gap-2 text-sm text-gray-900">
                  <Checkbox
                    id="quick_consent"
                    v-model="quickClient.consent_to_personal_data"
                  />
                  <span>Согласие на обработку персональных данных</span>
                </label>
                <p
                  v-if="quickClientErrors.consent_to_personal_data"
                  class="text-xs text-red-600"
                >
                  {{ quickClientErrors.consent_to_personal_data }}
                </p>
              </div>

              <div class="space-y-2">
                <label class="flex items-center gap-2 text-sm text-gray-900">
                  <Checkbox
                    id="quick_messenger_subscription"
                    v-model="quickClient.messenger_subscription"
                  />
                  <span>Подписка на мессенджер</span>
                </label>
              </div>

              <Button
                type="submit"
                class="w-full"
                :disabled="isQuickClientCreating"
              >
                <span v-if="!isQuickClientCreating">Добавить клиента</span>
                <span v-else>Добавление...</span>
              </Button>
            </form>
          </div>
        </div>
      </template>
    </ModalDialog>

    <div
      v-if="resolvedSelectedClient"
      class="mt-5 space-y-4 rounded-lg border border-green-200 bg-green-50 p-4"
    >
      <div>
        <p class="text-sm font-medium text-gray-900">
          {{ resolvedSelectedClient.first_name }}
          {{ resolvedSelectedClient.last_name }}
        </p>
        <p class="mt-1 text-sm text-gray-600">
          {{ resolvedSelectedClient.phone || "Телефон не указан" }}
        </p>
        <p class="mt-1 text-sm text-gray-600">
          {{ resolvedSelectedClient.email || "Email не указан" }}
        </p>
      </div>

      <div
        class="rounded-md bg-white px-3 py-2 text-xs text-green-700 ring-1 ring-green-200"
      >
        Клиент выбран для текущего заказа.
      </div>

      <Button
        type="button"
        variant="outline"
        class="w-full"
        @click="resetCreatedClient"
      >
        Выбрать другого клиента
      </Button>
    </div>

    <div
      v-if="
        !resolvedSelectedClient &&
        (props.errors?.client_id ||
          props.errors?.user?.first_name ||
          props.errors?.user?.last_name)
      "
      class="mt-5"
    >
      <p class="text-sm text-red-600">Укажите клиента</p>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { Plus, Search } from "lucide-vue-next";

import ModalDialog from "@/components/dynamics/shadcn/ModalDialog.vue";
import Button from "@/components/ui/button/Button.vue";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuickClientCreate } from "@/composables/orders/useQuickClientCreate";
import { useClientFunctions } from "@/composables/useClientFunctions";

const props = defineProps({
  clients: {
    type: Array,
    default: () => [],
  },
  selectedClient: {
    type: Object,
    default: null,
  },
  refreshClients: {
    type: Function,
    required: true,
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["created", "cleared"]);

const modalRef = ref(null);
const createdClient = ref(null);
const search = ref("");
const clientsFromProps = computed(() => {
  if (Array.isArray(props.clients)) {
    return props.clients;
  }

  if (Array.isArray(props.clients?.data)) {
    return props.clients.data;
  }

  return [];
});
const searchResults = ref([]);
const { getClientsByParams, sending } = useClientFunctions();
let searchTimeout = null;

const availableClients = computed(() => {
  if (search.value.trim()) {
    return searchResults.value;
  }

  return clientsFromProps.value;
});

const onlyDigits = (value) => String(value ?? "").replace(/\D+/g, "");

const filteredClients = computed(() => {
  const rawQuery = search.value.trim();
  const query = rawQuery.toLowerCase();
  const digitsQuery = onlyDigits(rawQuery);

  return availableClients.value
    .map((client) => normalizeClient(client))
    .filter((client) => {
      if (!query) {
        return true;
      }

      const haystack = [
        client.first_name,
        client.last_name,
        client.name,
        client.phone,
        client.email,
        client.full_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (haystack.includes(query)) {
        return true;
      }

      // Сравниваем телефон по цифрам, чтобы "+7 (912) 345-67-89" находил "+79123456789".
      if (digitsQuery && client.phone) {
        return onlyDigits(client.phone).includes(digitsQuery);
      }

      return false;
    });
});

const resolvedSelectedClient = computed(() => {
  if (createdClient.value) {
    return normalizeClient(createdClient.value);
  }

  if (props.selectedClient) {
    return normalizeClient(props.selectedClient);
  }

  return null;
});

const {
  quickClient,
  quickClientErrors,
  isCreating: isQuickClientCreating,
  createQuickClient,
  resetQuickClientForm,
} = useQuickClientCreate({
  clients: availableClients,
  refreshClients: () => props.refreshClients(),
});

const fetchClients = async (query = "") => {
  if (!query.trim()) {
    searchResults.value = [];
    return;
  }

  try {
    const response = await getClientsByParams({
      page: 1,
      per_page: 20,
      search: query,
    });

    searchResults.value = Array.isArray(response?.clients)
      ? response.clients
      : [];
  } catch {
    searchResults.value = [];
  }
};

const normalizeClient = (client) => {
  const firstName = client?.first_name ?? client?.profile?.first_name ?? "";
  const lastName = client?.last_name ?? client?.profile?.last_name ?? "";
  const fullName =
    client?.full_name ??
    client?.profile?.full_name ??
    client?.name ??
    `${firstName} ${lastName}`.trim();

  return {
    id: client?.id ?? null,
    first_name: firstName,
    last_name: lastName,
    name: client?.name ?? "",
    full_name: fullName,
    phone: client?.phone ?? client?.profile?.phone ?? client?.user?.phone ?? "",
    email: client?.email ?? "",
  };
};

const selectClient = (client) => {
  createdClient.value = client;
  emit("created", client);
  search.value = "";
  modalRef.value?.close?.();
};

const handleSelectExistingClient = (client) => {
  selectClient(client);
};

const handleCreate = async () => {
  const client = await createQuickClient();

  if (!client) {
    return;
  }

  selectClient(client);
};

const resetCreatedClient = () => {
  createdClient.value = null;
  search.value = "";
  searchResults.value = [];
  resetQuickClientForm();
  emit("cleared");
  nextTick(() => {
    modalRef.value?.open?.();
  });
};

watch(search, (value) => {
  clearTimeout(searchTimeout);

  if (!value.trim()) {
    searchResults.value = [];
    return;
  }

  searchTimeout = setTimeout(() => {
    fetchClients(value);
  }, 300);
});
</script>
