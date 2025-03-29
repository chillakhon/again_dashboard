<script setup lang="ts">
import UsersList from "@/components/dialogs/chats/UsersList.vue";
import ChatWidget from "@/components/dialogs/chats/ChatWidget.vue";
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MessagesSquare } from 'lucide-vue-next';

const isMobile = ref(false);
const showChat = ref(false);
const selectedUserId = ref<number | null>(1);

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};

const handleBack = () => {
  showChat.value = false;
};

const handleUserSelect = (userId: number) => {
  selectedUserId.value = userId;
  if (isMobile.value) {
    showChat.value = true;
  }
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize);
});
</script>

<template>
  <div class="flex h-full overflow-hidden bg-background md:rounded-lg md:border">
    <!-- Desktop View -->
    <div class="hidden md:flex w-full h-full">
      <UsersList
          class="h-full w-80 border-r"
          :selected-user="selectedUserId"
          @select-user="handleUserSelect"
      />
      <div class="flex-1 flex flex-col h-full">
        <ChatWidget
            v-if="selectedUserId"
            class="flex-1 h-full"
        />
        <div v-else class="flex-1 flex flex-col items-center justify-center gap-3 bg-muted/20 p-6">
          <MessagesSquare class="h-10 w-10 text-muted-foreground" />
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
        <UsersList
            v-if="!showChat"
            key="users-list"
            class="h-full w-full "
            :selected-user="selectedUserId"
            @select-user="handleUserSelect"
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
              <ChevronLeft class="h-5 w-5" />
            </Button>
            <div>
              <h3 class="font-medium">Чат с клиентом</h3>
              <p class="text-xs text-muted-foreground">Онлайн</p>
            </div>
          </div>
          <ChatWidget class="flex-1" />
        </div>
      </Transition>
    </div>
  </div>
</template>

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