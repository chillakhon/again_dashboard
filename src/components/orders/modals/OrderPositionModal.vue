<template>
    <ModalDialog
        ref="modalRef"
        title="Добавить позицию"
        description="Найдите товар по названию или артикулу и добавьте его в заказ."
        dynamic-style="sm:max-w-2xl"
    >
        <template #trigger>
            <Button type="button" variant="outline" class="gap-2">
                <Plus class="h-4 w-4" />
                Позиция
            </Button>
        </template>

        <template #content>
            <div class="space-y-4">
                <div class="relative">
                    <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        :value="modelValue"
                        type="text"
                        placeholder="Поиск товара"
                        class="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        @input="onInput"
                    />
                </div>

                <div class="max-h-80 overflow-y-auto rounded-md border border-gray-200">
                    <div
                        v-if="products.length"
                        class="divide-y divide-gray-200"
                    >
                        <button
                            v-for="product in products"
                            :key="product.id"
                            type="button"
                            class="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-gray-50"
                            @click="handleSelect(product)"
                        >
                            <div class="min-w-0">
                                <p class="truncate text-sm font-medium text-gray-900">
                                    {{ product.name }}
                                </p>
                                <p class="mt-1 text-xs text-gray-500">
                                    Артикул: {{ product.sku || '—' }}
                                </p>
                            </div>

                            <div class="shrink-0 text-right">
                                <p class="text-sm font-medium text-gray-900">
                                    {{ formatPrice(getApiPrice(product)) }}
                                </p>
                                <p class="text-xs text-gray-500">
                                    Остаток: {{ product.stock_quantity ?? 0 }} шт
                                </p>
                            </div>
                        </button>
                    </div>

                    <div v-else class="px-4 py-6 text-sm text-gray-500">
                        Товары не найдены.
                    </div>
                </div>
            </div>
        </template>
    </ModalDialog>
</template>

<script setup>
import { ref } from 'vue';
import { Plus, Search } from 'lucide-vue-next';

import ModalDialog from '@/components/dynamics/shadcn/ModalDialog.vue';
import Button from '@/components/ui/button/Button.vue';

defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    products: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(['update:modelValue', 'select']);

const modalRef = ref(null);

const formatPrice = (value) => {
    const amount = Number(value || 0);

    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 2,
    }).format(amount);
};

const getApiPrice = (product) => {
    return Number(product?.price ?? 0);
};

const onInput = (event) => {
    emit('update:modelValue', event.target?.value || '');
};

const handleSelect = (product) => {
    emit('select', product);
    emit('update:modelValue', '');
    modalRef.value?.close?.();
};
</script>
