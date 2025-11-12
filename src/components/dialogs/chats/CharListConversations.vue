<template>
  <Card class="md:w-[280px] h-full border-none rounded-none shadow-none">

    <CardHeader class="p-2 border-b">
      <ChatSelectSource
          :current-source="currentSource"
      />
    </CardHeader>
    <div
        class="overflow-y-auto h-[calc(100%-44px)] pt-1"
        v-if="props.conversations.length > 0"
        @scroll="handleScroll"
    >
      <div
          v-for="item in props.conversations"
          :key="item.id"
          @click="selectUser(item.id ?? 0); item.unread_messages_count = undefined"
          :class="`p-2 border-b cursor-pointer transition-all ${
          selectedUser === item.id
            ? 'bg-red-50 border-l-4 border-l-red-500'
            : 'hover:bg-gray-50'
        }`"
      >
        <div class="flex items-center space-x-2">
          <Avatar class="h-8 w-8">
            <AvatarImage
                :src="getLogo(item.source ?? '')"
            />
            <AvatarFallback class="text-xs text-red-500">
              {{ getInitials(item.client?.profile?.fullName || item?.source) }}
            </AvatarFallback>
          </Avatar>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-center">
              <h3 class="text-xs font-medium truncate text-gray-800">
                {{ item.client?.profile?.fullName || item.client?.email || 'Неизвестный' }}
              </h3>
              <span class="text-[10px] text-gray-500">
                {{ formatTime(item.last_message_at) }}
              </span>
            </div>
            <div class="flex justify-between items-center mt-0.5">
              <p class="text-[11px] text-gray-500 truncate">
                {{ item.last_message?.content || 'Без сообщений' }}
              </p>
              <Badge
                  v-if="item.unread_messages_count && item.unread_messages_count > 0"
                  variant="destructive"
                  class="min-h-4 min-w-4 p-0 flex items-center justify-center text-[10px]"
              >
                {{ item.unread_messages_count }}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Loader v-if="isLoadingMore"/>

      <div v-if="noMoreChats" class="text-center text-gray-400 py-2 text-sm mb-4">
        Больше нет диалогов
      </div>


    </div>

    <div
        v-else
        class="flex-1 flex flex-col items-center justify-center text-muted-foreground p-4"
    >
      <MessagesSquare class="h-10 w-10 mb-2"/>
      <h3 class="text-lg font-medium">Нет диалогов</h3>
      <p class="text-sm text-center">
        Здесь появятся ваши чаты.<br/>
        Выберите другой источник.
      </p>¬
    </div>


  </Card>
</template>

<script setup lang="ts">
import {ref, PropType, onMounted, onBeforeUnmount} from 'vue'
import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar'
import {Badge} from '@/components/ui/badge'
import {Card, CardHeader} from '@/components/ui/card'
import ChatSelectSource from '@/components/dialogs/chats/ChatSelectSource.vue'
import {Conversation} from '@/models/Conversation'
import {MessagesSquare} from "lucide-vue-next";
import {assetPath} from "@/utils/assetPath";

import Loader from '@/components/common/Loader.vue'

const props = defineProps({
  conversations: {
    type: Array as PropType<Conversation[]>,
    required: true,
    default: () => []
  },
  currentSource: {
    type: Object,
    required: true,
    default: {
      source: 'all'
    }
  },

  selectedUserId: {
    type: Number,
    default: null
  },

  isLoadingMore: {
    type: Boolean,
    default: false
  },
  noMoreChats: {
    type: Boolean,
    default: false
  }

})

const emit = defineEmits(['selectUser', 'changeSource', 'scrolledToEnd'])

const selectedUser = ref<number | null>(props.selectedUserId)

function selectUser(userId: number) {
  selectedUser.value = userId
  emit('selectUser', userId)
}

function getInitials(email: string): string {
  return email.split('@')[0]?.slice(0, 2).toUpperCase()
}

function formatTime(dateString?: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
}


const getLogo = (source: string): string => {
  switch (source) {
    case 'web_chat':
      return assetPath('icons/chat/web-chat.png')
    case 'telegram':
      return assetPath('icons/chat/telegram.svg')
    case 'whatsapp':
      return assetPath('icons/chat/whatsapp.svg')
    case 'vk':
      return assetPath('icons/chat/vk.svg')
    case 'email':
      return assetPath('icons/chat/email.png')
    default:
      return ''
  }
}


onMounted(() => {
  window.addEventListener('scroll', handleScrollWindow)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScrollWindow)
})

function handleScrollWindow() {
  const scrollTop = window.scrollY
  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = window.innerHeight

  if (scrollHeight - scrollTop - clientHeight < 5) {
    emit('scrolledToEnd')
  }
}


function handleScroll(event: Event) {
  const element = event.target as HTMLElement
  const isAtBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 5
  const isAtTop = element.scrollTop < 5

  if (isAtBottom) {
    emit('scrolledToEnd')
  }


}

</script>
