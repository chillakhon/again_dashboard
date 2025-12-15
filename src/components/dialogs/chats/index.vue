<template>

  <Loader v-if="loading"/>

  <div v-else class="flex p-2 bg-background md:rounded-lg md:border h-full">

    <div class="hidden md:flex w-full h-full">
      <div class="flex flex-col h-[85vh]">
        <ChatListConversations
            class="h-full w-80 border-r"
            :key="renderListConv"
            :conversations="conversations"
            :selected-user-id="selectedConversatonId"
            :current-source="currentSourceName"
            :isLoadingMore="isLoadingMore"
            :noMoreChats="noMoreChats"
            @select-user="handleUserSelect"
            @scrolledToEnd="handleScrolledToEnd"
        />
      </div>

      <div class="flex flex-col h-full w-full">

        <ChatWidget
            v-if="selectedConversation"
            class="h-[85vh]"
            :key="renderChat"
            :conversation="selectedConversation"
            :isLoadingGetMessage="isLoadingGetMessage"
            @has-new-message="handleUpdateConv"
        />

        <div v-else class="flex flex-col items-center justify-center gap-3 bg-muted/20 p-6 border h-[85vh]">
          <MessagesSquare class="h-10 w-10 text-muted-foreground"/>
          <h3 class="text-lg font-medium text-muted-foreground">Выберите чат</h3>
          <p class="text-sm text-muted-foreground text-center max-w-md">
            Выберите диалог из списка слева чтобы начать общение
          </p>
        </div>
      </div>
    </div>

    <!-- Mobile View -->
    <div class="md:hidden w-full h-full">
      <Transition name="slide-fade" mode="out-in">

        <ChatListConversations
            v-if="!showChat"
            class="h-full border-r"
            :selected-user-id="selectedConversatonId"
            :conversations="conversations"
            :selected-user="selectedConversatonId"
            :current-source="currentSourceName"
            :isLoadingMore="isLoadingMore"
            :noMoreChats="noMoreChats"
            @select-user="handleUserSelect"
            @scrolledToEnd="handleScrolledToEnd"

        />

        <div
            v-else
            key="chat-widget"
            class="h-full w-full flex flex-col bg-background"
        >
          <div class="p-3 border-b flex items-center gap-3 bg-white/95 backdrop-blur-sm">
            <Button
                variant="ghost"
                size="icon"
                class="h-9 w-9 rounded-full"
                @click="handleBack"
            >
              <ChevronLeft class="h-5 w-5"/>
            </Button>
            <div>
              <h3 class="font-medium">Чат с клиентом</h3>
              <!--              <p class="text-xs text-muted-foreground">Онлайн</p>-->
            </div>
          </div>
          <ChatWidget
              class="flex-1"
              :key="renderChat"
              :conversation="selectedConversation"
              :isLoadingGetMessage="isLoadingGetMessage"
              @has-new-message="handleUpdateConv"
          />
        </div>
      </Transition>
    </div>

  </div>
</template>


<script setup lang="ts">
import ChatWidget from "@/components/dialogs/chats/ChatWidget.vue";
import {ref, onMounted, onBeforeUnmount, watch} from 'vue';
import {Button} from '@/components/ui/button';
import {ChevronLeft, MessagesSquare} from 'lucide-vue-next';
import {useChatsFunctions} from "@/composables/useChatsFunctions";
import ChatListConversations from "@/components/dialogs/chats/ChatListConversations.vue";
import {Conversation} from "@/models/Conversation";
import {useStore} from "vuex";
import Loader from "@/components/common/Loader.vue";
import {useEchoListener} from "@/composables/Echo/useEchoListener";
import {ECHO_CHANNELS, ECHO_EVENTS} from "@/config/echoConfig";


const store = useStore();

const loading = ref(true)
const renderChat = ref(1)
const renderListConv = ref(1)



const pagination = ref({
  page: 1,
  per_page: 20,
  total: 0,
})


const currentSourceName = ref({source: 'all'})

const isMobile = ref(false);
const showChat = ref(false);
const selectedConversatonId = ref<number | null>(null);

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};

const handleBack = () => {
  showChat.value = false;
};

const handleUserSelect = (userId: number) => {

  selectedConversatonId.value = userId;
  if (isMobile.value) {
    showChat.value = true;
  }
};

onMounted(async () => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
  await store.dispatch('notifications/markConversationsChecked');
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize);
});


const conversations = ref<Conversation[]>([]);


const {getConversations, getConversationById} = useChatsFunctions()


const fetchData = async () => {
  pagination.value.page = 1;

  const res = await getConversations({
    page: pagination.value.page,
    per_page: pagination.value.per_page,
    source: currentSourceName.value.source === 'all' ? '' : currentSourceName.value.source,
  });

  pagination.value.total = res?.meta.total ?? 0;
  conversations.value = res?.conversation ?? [];
};


const isLoadingMore = ref(false);
const noMoreChats = ref(false)


const handleScrolledToEnd = async () => {
  if (isLoadingMore.value) return;

  if (pagination.value.page * pagination.value.per_page >= pagination.value.total) {
    noMoreChats.value = true
    return
  }



  isLoadingMore.value = true;
  pagination.value.page++;

  const res = await getConversations({
    page: pagination.value.page,
    per_page: pagination.value.per_page,
    source: currentSourceName.value.source === 'all' ? '' : currentSourceName.value.source,
  });

  conversations.value.push(...(res?.conversation ?? []));
  isLoadingMore.value = false;
};


onMounted(async () => {
  await fetchData()
  loading.value = false;
})


const {isSubscribed: listenerSubscribed} = useEchoListener({
  channel: ECHO_CHANNELS.ADMIN_NOTIFICATIONS,
  event: ECHO_EVENTS.CONVERSATION_UPDATED,
  isPrivate: true,
  onMessage: async (payload) => {
    await fetchData();
    renderListConv.value++;
  },
  onError: (error) => {
    console.error('Ошибка подписки:', error);
  }
});

const selectedConversation = ref<Conversation | null>(null)


const isLoadingGetMessage = ref(false)
watch(
    () => selectedConversatonId.value,
    async (newVal) => {
      isLoadingGetMessage.value = true;
      selectedConversation.value = await getConversationById(Number(newVal))
      isLoadingGetMessage.value = false;
      renderChat.value++
    }
)

watch(
    () => currentSourceName.value.source,
    () => {
      fetchData()
    }
)


const handleUpdateConv = async () => {
  await fetchData()
  renderListConv.value++
}

</script>


<style>
/* Плавные переходы для мобильного вида */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-to {
  transform: translateX(-10px);
  opacity: 0;
}

/* Анимация для кнопки назад */
.button-scale-enter-active,
.button-scale-leave-active {
  transition: all 0.2s ease;
}

.button-scale-enter-from,
.button-scale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
</style>