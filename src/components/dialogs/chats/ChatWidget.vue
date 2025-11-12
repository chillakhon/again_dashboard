<template>
  <Card class="w-full h-full shadow-none border-0 md:border-l rounded-none flex flex-col">
    <!-- Header -->
    <CardHeader class="border-b p-2">
      <div class="flex items-center justify-between space-x-2">
        <div class="flex items-center space-x-2">
          <Avatar class="h-8 w-8">
            <AvatarImage :src="clientImage || clientIcon"/>
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
    <CardContent class="flex-1 p-2 overflow-y-auto flex flex-col">
      <div v-if="clientAddress" class="mb-2 text-xs border-b pb-2">
        <p class="text-muted-foreground">Адрес:</p>
        <p class="truncate">{{ clientAddress }}</p>
      </div>

      <Loader v-if="isLoadingGetMessage"/>
      <div class="flex-1 overflow-y-auto space-y-1 max-md:max-h-[66vh] max-md:min-h-[66vh]"
           v-else
      >
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
import {ref, nextTick, onMounted, onBeforeUnmount, watch, computed} from 'vue'
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
import '@/echo';
import {assetPath} from "@/utils/assetPath";

import Loader from '@/components/common/Loader.vue'


const props = defineProps<{
  conversation: Conversation
  isLoadingGetMessage: boolean
}>()
const conversation = props.conversation

const clientIcon = assetPath('icons/client.png')

const emits = defineEmits(['hasNewMessage'])

const {conversationReplyById} = useChatsFunctions()

const newMessage = ref('')
const messagesEndRef = ref<HTMLDivElement | null>(null)

const clientName = computed(
    () => conversation.client?.profile?.fullName || conversation.client?.name || 'Клиент'
)
const clientPhone = computed(
    () => {
      const phoneClient = conversation.client?.profile?.phone

      if (conversation.source == 'whatsapp') {
        return conversation.external_id?.split("@")[0]
      }

      return phoneClient || 'Телефон не указан'
    }
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
    case 'vk':
      return 'ВКонтакте'
    case 'email':
      return 'Почта'
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

let addMessage = true

async function sendMessage() {
  const text = newMessage.value.trim()
  if (!text || conversation.id === undefined) return

  addMessage = false

  // Создаём временное сообщение с уникальным ID
  const tempId = `temp-${Date.now()}-${Math.random()}`
  const tempMessage: Message = {
    id: tempId,
    content: text,
    direction: 'outgoing',
    status: 'sending',
    created_at: new Date().toISOString(),
    attachments: [],
    conversation_id: conversation.id,
  } as Message

  // Сразу добавляем в UI
  conversation.messages = conversation.messages || []
  conversation.messages.push(tempMessage)
  newMessage.value = ''
  scrollToBottom()

  try {
    // Отправляем на сервер
    const response = await conversationReplyById(Number(conversation.id), {
      content: text,
      attachments: [],
    })

    if (response) {
      // Находим временное сообщение и заменяем его на реальное
      const tempIndex = conversation.messages.findIndex(m => m.id === tempId)
      if (tempIndex !== -1) {
        conversation.messages[tempIndex] = response
      }

      emits('hasNewMessage', conversation.id)
    }
  } catch (e) {
    console.error('Ошибка отправки:', e)

    // При ошибке меняем статус на failed
    const messageIndex = conversation.messages.findIndex(m => m.id === tempId)
    if (messageIndex !== -1) {
      conversation.messages[messageIndex].status = 'failed'
    }
  } finally {
    addMessage = true
  }
}

onMounted(() =>
    scrollToBottom('auto')
)

watch(() => conversation.messages?.length, () => scrollToBottom())

const urlPattern = /(\bhttps?:\/\/[^\s<>]+[^\s<.,:;"')\]\s])/g

function linkify(text = ''): string {
  return text
      .replace(urlPattern, url => `<a href="${url}" target="_blank" class="text-blue-600 underline">${url}</a>`)
}

/* ---------- WebSocket подписка ---------- */
let currentChannel: any = null;

watch(() => conversation.id, (id, oldId) => {

  // отпишемся от старого канала
  if (oldId && (window as any).Echo) {
    try {
      (window as any).Echo.leave(`private-conversation.${oldId}`);
    } catch (e) {
    }
  }

  if (!id || !(window as any).Echo) return;


  // подписываемся на private канал conversation.{id}
  try {
    currentChannel = (window as any).Echo.private(`conversation.${id}`);

    currentChannel.listen('.MessageCreated', (payload: any) => {
      if (!addMessage) return
      // приводим к формату сообщения, который ожидает UI
      const incoming: Partial<Message> = {
        id: payload.id,
        content: payload.content,
        direction: payload.direction,
        status: payload.status,
        created_at: payload.created_at,
        attachments: payload.attachments ?? []
      };


      // добавляем только если такой id ещё не присутствует (предотвращаем дубликаты)
      conversation.messages = conversation.messages || [];

      const exists = conversation.messages.some(m => String(m.id) === String(incoming.id));
      if (!exists) {
        conversation.messages.push(incoming as Message);
        nextTick(() => scrollToBottom());
        emits('hasNewMessage', id);
      }

    });

  } catch (e) {
    console.error('Echo subscribe failed:', e);
  }
}, {
  immediate: true,
});

// при уходе с компонента — отпишемся
onBeforeUnmount(() => {
  const id = conversation.id;
  if (id && (window as any).Echo) {
    try {
      (window as any).Echo.leave(`private-conversation.${id}`);
    } catch (e) { /* ignore */
    }
  }
});


</script>
