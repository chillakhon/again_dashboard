<template>
  <loader v-if="isLoading"/>
  <div v-else class="space-y-4">
    <h2 class="text-2xl font-medium tracking-tight">Заказы</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Новые заказы -->
      <RouterLink to="/orders?status=new">
        <Card class="group hover:shadow-lg transition-all duration-300 hover:border-primary hover:translate-y-[-2px]">
          <CardHeader class="pb-2">
            <CardDescription class="flex items-center gap-2">
              <span>Новые заказы</span>
              <div class="h-2 w-2 rounded-full bg-red-500 animate-pulse"/>
            </CardDescription>
            <CardTitle class="text-4xl text-primary group-hover:text-primary/90 transition-colors">{{data?.new?.count ?? 0}}</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">{{data?.new?.total_amount ?? 0}} ₽</span>
              <ChevronRight class="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"/>
            </div>
          </CardContent>
        </Card>
      </RouterLink>

      <!-- В обработке -->
      <RouterLink to="/orders?status=processing">
        <Card class="group hover:shadow-lg transition-all duration-300 hover:border-amber-500 hover:translate-y-[-2px]">
          <CardHeader class="pb-2">
            <CardDescription class="flex items-center gap-2">
              <span>В обработке</span>
              <div class="h-2 w-2 rounded-full bg-amber-500"/>
            </CardDescription>
            <CardTitle class="text-4xl text-amber-500 group-hover:text-amber-500/90 transition-colors">{{data?.processing?.count ?? 0}}</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">{{data?.processing?.total_amount ?? 0}} ₽</span>
              <ChevronRight class="h-4 w-4 text-muted-foreground group-hover:text-amber-500 transition-colors"/>
            </div>
          </CardContent>
        </Card>
      </RouterLink>

      <!-- Готовы к отправке -->
      <RouterLink to="/orders?status=ready">
        <Card class="group hover:shadow-lg transition-all duration-300 hover:border-blue-500 hover:translate-y-[-2px]">
          <CardHeader class="pb-2">
            <CardDescription class="flex items-center gap-2">
              <span>Готовы к отправке</span>
              <div class="h-2 w-2 rounded-full bg-blue-500"/>
            </CardDescription>
            <CardTitle class="text-4xl text-blue-500 group-hover:text-blue-500/90 transition-colors">
              {{ data?.approved?.count ?? 0}}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">{{ data?.approved?.total_amount ?? 0 }} ₽</span>
              <ChevronRight class="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors"/>
            </div>
          </CardContent>
        </Card>
      </RouterLink>
    </div>


    <HomeChart  :chartData="data.chartData"/>


  </div>
</template>

<script setup lang="ts">
import {ChevronRight} from 'lucide-vue-next'
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {onMounted, ref} from "vue";
import Loader from "@/components/common/Loader.vue";
import HomeChart from "@/components/dashboard/charts/HomeChart.vue";

const isLoading = ref<Boolean>(true)
const data = ref()

onMounted(() => {
  fetchData()
})

async function fetchData() {
  await axios.get('/orders/stats')
      .then(res => {
        data.value = res.data
        console.log(data.value.chartData)
      })
      .catch(err => console.log(err))
      .finally(() => isLoading.value = false)
}


</script>