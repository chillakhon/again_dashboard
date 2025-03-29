<template>
  <Card class="w-full h-full shadow-none border-0 md:border-l rounded-none">
    <CardHeader class="border-b p-">
      <div class="flex items-center justify-between space-x-2">
        <div class="flex items-center space-x-2">
          <Avatar class="h-8 w-8">
            <AvatarImage :src="chatData.customer.avatar"/>
            <AvatarFallback>{{ chatData.customer.name.charAt(0) }}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle class="text-sm font-medium">{{ chatData.customer.name }}</CardTitle>
            <CardDescription class="flex items-center gap-1 text-xs">
              <span>{{ chatData.customer.phone }}</span>
              <Badge variant="outline" class="h-4 px-1 text-[0.6rem] capitalize">
                {{ chatData.customer.channel }}
              </Badge>
            </CardDescription>
          </div>
        </div>
        <div class="text-right text-xs">
          <div class="font-medium">Заказ {{ chatData.customer.order.id }}</div>
          <div class="text-muted-foreground">{{ chatData.customer.order.date }}</div>
        </div>
      </div>
    </CardHeader>

    <CardContent class="p-0 h-[50%]">
      <div class="p-2 border-b text-xs space-y-1">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <p class="text-muted-foreground">Доставка:</p>
            <p class="truncate">{{ chatData.customer.order.delivery.method }}</p>
          </div>
          <div>
            <p class="text-muted-foreground">Оплата:</p>
            <p>{{ chatData.customer.order.payment }}</p>
          </div>
        </div>
        <p class="text-muted-foreground">Адрес:</p>
        <p class="truncate">{{ chatData.customer.order.delivery.address }}</p>
      </div>

      <div class="p-2 space-y-1 h-[50vh] overflow-y-auto">
        <div
            v-for="message in chatData.messages"
            :key="message.id"
            :class="`flex ${message.sender === 'customer' ? 'justify-start' : 'justify-end'}`"
        >
          <div
              :class="`max-w-[80%] px-2 py-1 rounded-lg text-xs ${
              message.sender === 'customer'
                ? 'bg-muted'
                : 'bg-primary text-primary-foreground'
            }`"
          >
            <p>{{ message.text }}</p>
            <p class="text-[0.6rem] opacity-70 text-right mt-0.5">{{ message.time }}</p>
          </div>
        </div>
        <div ref="messagesEndRef"/>
      </div>

      <div class="p-2 border-t">
        <div class="flex space-x-1">
          <Input
              v-model="newMessage"
              placeholder="Сообщение..."
              class="h-8 text-xs"
              @keyup.enter="sendMessage"
          />
          <Button
              size="sm"
              class="h-8 px-2 text-xs"
              @click="sendMessage"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </Button>
        </div>
        <p class="mt-1 text-[0.6rem] text-muted-foreground">
          Через {{ chatData.customer.channel === 'whatsapp' ? 'WhatsApp' : 'Telegram' }}
        </p>
      </div>
    </CardContent>
  </Card>
</template>


<script setup lang="ts">
import {ref, nextTick, onMounted, watch} from 'vue'
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from '@/components/ui/card'
import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar'
import {Badge} from '@/components/ui/badge'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'

interface Message {
  id: number
  sender: 'customer' | 'system'
  text: string
  time: string
}

interface OrderItem {
  name: string
  size: string
  color: string
  price: string
  qty: number
}

interface DeliveryInfo {
  method: string
  address: string
}

interface Order {
  id: string
  date: string
  items: OrderItem[]
  total: string
  payment: string
  delivery: DeliveryInfo
}

interface Customer {
  name: string
  phone: string
  avatar: string
  channel: 'telegram' | 'whatsapp'
  order: Order
}

const newMessage = ref('')
const messagesEndRef = ref<HTMLDivElement | null>(null)

const chatData = ref({
  customer: {
    name: "Ольга А.",
    phone: "+7 (925) 198-99-71",
    avatar: "",
    channel: "whatsapp",
    order: {
      id: "#14866",
      date: "28.03.2025",
      items: [
        {name: "Passion AGAIN", size: "XXL", color: "Черный", price: "2 490 ₽", qty: 1},
        {name: "Save AGAIN", size: "XXXL", color: "Черный", price: "2 490 ₽", qty: 1}
      ],
      total: "7 470 ₽",
      payment: "Яндекс СПЛИТ",
      delivery: {
        method: "Почта России",
        address: "г. Истра, ул. Центральная, 16"
      }
    }
  },
  messages: [
    {id: 1, sender: "customer", text: "Как отследить доставку?", time: "23:57"},
    {id: 2, sender: "system", text: "Заказ №14866", time: "23:58"},
    {id: 3, sender: "customer", text: "Когда доставка?", time: "23:58"}
  ]
})

function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
  nextTick(() => {
    messagesEndRef.value?.scrollIntoView({behavior})
  })
}

function sendMessage() {
  if (!newMessage.value.trim()) return

  const newMsg: Message = {
    id: Date.now(),
    sender: 'system',
    text: newMessage.value,
    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
  }

  chatData.value.messages.push(newMsg)
  newMessage.value = ''
  scrollToBottom()
  sendToMessenger(newMsg.text)
}

function sendToMessenger(text: string) {
  console.log(`Отправка через ${chatData.value.customer.channel}:`, text)
  // Реальная интеграция:
  // if (chatData.value.customer.channel === 'whatsapp') {
  //   sendWhatsAppMessage(chatData.value.customer.phone, text)
  // } else {
  //   sendTelegramMessage(chatData.value.customer.phone, text)
  // }
}

onMounted(() => {
  scrollToBottom('auto')
})

watch(() => chatData.value.messages.length, () => {
  scrollToBottom()
})
</script>