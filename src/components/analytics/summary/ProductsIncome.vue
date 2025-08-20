<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-lg font-medium text-gray-700">Доходы по товарам</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <p class="text-xs text-muted-foreground">Прибыль</p>
          <p class="text-lg font-medium">{{ formattedNumber(data?.total_profit) }} ₽</p>
        </div>
        <div>
          <p class="text-xs text-muted-foreground">Выручка</p>
          <p class="text-lg font-medium">{{ formattedNumber(data?.total_revenue) }} ₽</p>
        </div>
        <div>
          <p class="text-xs text-muted-foreground">Себестоимость</p>
          <p class="text-lg font-medium">{{ formattedNumber(data?.total_cost) }} ₽</p>
        </div>
      </div>

      <div v-if="sending" class="text-sm text-muted-foreground">Загрузка... {{ progress }}%</div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAnalyticsFunctions } from '@/composables/useAnalyticsFunctions'

const props = defineProps<{ filter?: any }>()
const { getProductsIncome, sending, progress } = useAnalyticsFunctions()
const data = ref<any | null>(null)

const formatParam = (d: any, end = false) => {
  if (!d) return undefined
  const dt = new Date(d)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`
}

const fetch = async () => {
  const params: any = {}
  if (props.filter?.datePicker?.start) params.from = formatParam(props.filter.datePicker.start)
  if (props.filter?.datePicker?.end) params.to = formatParam(props.filter.datePicker.end, true)
  const res = await getProductsIncome(params)
  if (res) data.value = res
}

onMounted(fetch)
watch(() => props.filter, fetch, { deep: true })

const formattedNumber = (v: any) => v == null ? '—' : new Intl.NumberFormat('ru-RU').format(v)
</script>

<style scoped></style>
