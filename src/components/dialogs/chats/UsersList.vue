<!-- src/components/UsersList.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {Card, CardHeader} from '@/components/ui/card'


const emit = defineEmits(['selectUser'])

interface User {
  id: number
  name: string
  avatar: string
  phone: string
  channel: 'telegram' | 'whatsapp'
  unread: number
  lastMessage: string
  lastTime: string
}

const users = ref<User[]>([
  {
    id: 1,
    name: "Ольга А.",
    avatar: "",
    phone: "+7 (925) 198-99-71",
    channel: "whatsapp",
    unread: 2,
    lastMessage: "Когда доставка?",
    lastTime: "23:58"
  },
  {
    id: 2,
    name: "Иван П.",
    avatar: "",
    phone: "+7 (916) 345-67-89",
    channel: "telegram",
    unread: 0,
    lastMessage: "Спасибо за помощь!",
    lastTime: "21:30"
  },
  {
    id: 3,
    name: "Екатерина С.",
    avatar: "",
    phone: "+7 (903) 123-45-67",
    channel: "whatsapp",
    unread: 5,
    lastMessage: "Есть вопросы по заказу",
    lastTime: "18:45"
  }
])

const selectedUser = ref<number | null>(1)

function selectUser(userId: number) {
  selectedUser.value = userId
  console.log(userId)
  emit('selectUser', userId)
}
</script>

<template>
  <Card class="md:w-[250px] h-full border-none rounded-none shadow-none">
    <CardHeader class="p-3 border-b">
      <h2 class="text-sm font-semibold text-gray-700 py-2">Клиенты</h2>
    </CardHeader>
    <div class="overflow-y-auto h-[calc(100%-44px)] pt-1">
      <div
          v-for="user in users"
          :key="user.id"
          @click="selectUser(user.id)"
          :class="`p-2 border-b cursor-pointer transition-all ${
          selectedUser === user.id
            ? 'bg-red-50 border-l-4 border-l-red-500'
            : 'hover:bg-gray-50'
        }`"
      >
        <div class="flex items-center space-x-2">
          <Avatar class="h-8 w-8">
            <AvatarImage :src="user.avatar" />
            <AvatarFallback class="text-xs">{{ user.name.charAt(0) }}</AvatarFallback>
          </Avatar>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-center">
              <h3 class="text-xs font-medium truncate text-gray-800">{{ user.name }}</h3>
              <span class="text-[10px] text-gray-500">{{ user.lastTime }}</span>
            </div>
            <div class="flex justify-between items-center mt-0.5">
              <p class="text-[11px] text-gray-500 truncate">{{ user.lastMessage }}</p>
              <Badge
                  v-if="user.unread > 0"
                  variant="destructive"
                  class="h-4 w-4 p-0 flex items-center justify-center text-[10px]"
              >
                {{ user.unread }}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>