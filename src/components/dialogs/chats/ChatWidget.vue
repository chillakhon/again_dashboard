<template>
  <Card class="w-full h-full shadow-none border-0 md:border-l rounded-none flex flex-col">
    <!-- Header -->
    <CardHeader class="border-b p-2">
      <div class="flex items-center justify-between space-x-2">
        <div class="flex items-center space-x-2">
          <Avatar class="h-8 w-8">
            <AvatarImage :src="clientImage || '/icons/client.png'"/>
            <AvatarFallback>{{ clientName.charAt(0) }}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle class="text-sm font-medium">{{ clientName }}</CardTitle>
            <CardDescription class="flex items-center gap-1 text-xs">
              <span>{{ clientPhone }}</span>
              <Badge variant="outline" class="h-4 px-1 text-[0.6rem] capitalize">
                {{ sourceName }}
              </Badge>
            </CardDescription>
          </div>
        </div>
        <div class="text-right text-xs">
          <div class="font-medium">ID {{ conversation.id }}</div>
          <div class="text-muted-foreground">{{ lastMessageTime }}</div>
        </div>
      </div>
    </CardHeader>

    <!-- Messages -->
    <CardContent class="flex-1 p-2 overflow-auto flex flex-col">
      <div v-if="clientAddress" class="mb-2 text-xs border-b pb-2">
        <p class="text-muted-foreground">Адрес:</p>
        <p class="truncate">{{ clientAddress }}</p>
      </div>
      <div class="flex-1 overflow-y-auto space-y-1">
        <div
            v-for="message in conversation.messages"
            :key="message.id"
            :class="['flex', message.direction === 'incoming' ? 'justify-start' : 'justify-end']"
        >
          <div
              :class="[
              'max-w-[80%] px-2 py-1 rounded-lg text-xs relative',
              message.direction === 'incoming'
                ? 'bg-muted'
                : 'bg-primary text-primary-foreground'
            ]"
          >
            <p v-html="linkify(message.content)"></p>

            <div class="flex items-center justify-end space-x-1 mt-0.5">
              <!-- Time -->
              <span class="text-[0.6rem] opacity-70">{{ formatTime(message.created_at) }}</span>
              <!-- Status Icon for outgoing -->
              <component
                  v-if="message.direction === 'outgoing'"
                  :is="getStatusIcon(message.status)"
                  class="w-4 h-4 opacity-70"
              />
            </div>
          </div>
        </div>
        <div ref="messagesEndRef"/>
      </div>
    </CardContent>

    <!-- Input -->
    <div class="p-2 border-t">
      <div class="flex space-x-1">
        <Input
            v-model="newMessage"
            placeholder="Сообщение..."
            class="h-8 text-xs flex-1"
            @keyup.enter="sendMessage"
        />
        <Button size="sm" class="h-8 px-2 text-xs" @click="sendMessage">
          <Send/>
        </Button>
      </div>
      <p class="mt-1 text-[0.6rem] text-muted-foreground">Через {{ sourceName }}</p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import {ref, nextTick, onMounted, watch, computed} from 'vue'
import axios from 'axios'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar'
import {Badge} from '@/components/ui/badge'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import type {Conversation} from '@/models/Conversation'
import type {Message} from '@/models/Message'
import {
  Clock,
  Check,
  MessageSquare,
  Eye,
  AlertCircle,
  Send,
} from 'lucide-vue-next'
import {useChatsFunctions} from '@/composables/useChatsFunctions'

const props = defineProps<{ conversation: Conversation }>()
const conversation = props.conversation

const {conversationReplyById} = useChatsFunctions()

const newMessage = ref('')
const messagesEndRef = ref<HTMLDivElement | null>(null)

const clientName = computed(
    () => conversation.client?.profile?.fullName || conversation.client?.name || 'Клиент'
)
const clientPhone = computed(
    () => conversation.client?.profile?.phone || 'Телефон не указан'
)
const clientImage = computed(
    () => conversation.client?.profile?.image || ''
)
const clientAddress = computed(
    () => conversation.client?.profile?.address || ''
)
const lastMessageTime = computed(
    () => (conversation.last_message_at ? formatTime(conversation.last_message_at) : '')
)
const sourceName = computed(() => {
  switch (conversation.source) {
    case 'telegram':
      return 'Telegram'
    case 'whatsapp':
      return 'WhatsApp'
    case 'web_chat':
      return 'Веб-чат'
    default:
      return conversation.source || ''
  }
})

function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
  nextTick(() => {
    messagesEndRef.value?.scrollIntoView({behavior})
  })
}

function formatTime(datetime: string | undefined): string {
  if (!datetime) return ''
  const date = new Date(datetime)
  return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
}

// Выбираем иконку в зависимости от статуса
function getStatusIcon(status: string | undefined) {
  switch (status) {
    case 'sending':
      return Clock
    case 'sent':
      return Check
    case 'delivered':
      return MessageSquare
    case 'read':
      return Eye
    case 'failed':
      return AlertCircle
    default:
      return null
  }
}

async function sendMessage() {
  const text = newMessage.value.trim()
  if (!text || conversation.id === undefined) return

  try {
    const conv = await conversationReplyById(Number(conversation.id), {
      content: text,
      attachments: [],
    })
    if (conv) {
      conversation.messages = conversation.messages || []
      conversation.messages.push(conv)
      newMessage.value = ''
      scrollToBottom()
    }
  } catch (e) {
    console.error('Ошибка отправки:', e)
  }
}

onMounted(() => scrollToBottom('auto'))

watch(() => conversation.messages?.length, () => scrollToBottom())


const urlPattern = /(\bhttps?:\/\/[^\s<>]+[^\s<.,:;"')\]\s])/g

function linkify(text = ''): string {
  return text
      .replace(urlPattern, url => `<a href="${url}" target="_blank" class="text-blue-600 underline">${url}</a>`)
}

</script>