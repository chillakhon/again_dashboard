<template>
  <div class="space-y-6 p-6 max-w-4xl mx-auto">
    <!-- Заголовок раздела -->
    <div>
      <h1 class="text-2xl font-bold">Интеграция мессенджеров</h1>
      <p class="text-muted-foreground">Настройте подключение WhatsApp и Telegram API</p>
    </div>

    <Separator />

    <!-- WhatsApp API -->
    <Card>
      <CardHeader>
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-md bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-6.29 2.869c-.173.246-.5.4-.98.4-.198 0-.372-.025-.545-.074-1.032-.273-2.38-1.176-3.001-2.188-.694-1.141-.925-2.17-.925-2.893.002-.619.148-.908.322-1.118.198-.248.47-.372.718-.372.198 0 .371.025.52.074.446.149.669.644.793.941.124.298.248.694.347.941.099.248.05.372-.025.496-.074.124-.174.272-.347.446-.173.174-.347.372-.397.57-.05.198-.025.372.124.644.149.273.793 1.514 1.213 1.96.42.446.92.694 1.238.817.198.074.372.074.545-.025.174-.099.273-.223.421-.471zM12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2m0 1a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9 9 9 0 0 0-9-9z"/>
            </svg>
          </div>
          <div class="flex-1 flex justify-between items-center">
            <div>
              <CardTitle>WhatsApp Business API</CardTitle>
              <CardDescription>Подключение официального API WhatsApp</CardDescription>
            </div>
            <Switch v-model="integrations.whatsapp.enabled" />
          </div>
        </div>
      </CardHeader>
      <CardContent class="space-y-4" :class="{'opacity-50': !integrations.whatsapp.enabled}">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="whatsapp-phone">Номер телефона</Label>
            <Input
                id="whatsapp-phone"
                v-model="integrations.whatsapp.phoneNumber"
                placeholder="79123456789"
                :disabled="!integrations.whatsapp.enabled"
            />
          </div>
          <div class="space-y-2">
            <Label for="whatsapp-token">Токен API</Label>
            <Input
                id="whatsapp-token"
                v-model="integrations.whatsapp.apiToken"
                type="password"
                placeholder="Ваш секретный токен"
                :disabled="!integrations.whatsapp.enabled"
            />
          </div>
        </div>
        <div class="space-y-2">
          <Label for="whatsapp-webhook">Webhook URL</Label>
          <Input
              id="whatsapp-webhook"
              v-model="integrations.whatsapp.webhookUrl"
              placeholder="https://ваш-сайт.ru/api/whatsapp"
              :disabled="!integrations.whatsapp.enabled"
          />
        </div>
        <div class="flex justify-between pt-4 border-t">
          <Button
              variant="outline"
              :disabled="!integrations.whatsapp.enabled"
              @click="testWhatsAppConnection"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            Проверить подключение
          </Button>
          <Button
              :disabled="!integrations.whatsapp.enabled || !hasWhatsAppChanges"
              @click="saveWhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Сохранить
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Telegram Bot API -->
    <Card>
      <CardHeader>
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-md bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
            </svg>
          </div>
          <div class="flex-1 flex justify-between items-center">
            <div>
              <CardTitle>Telegram Bot API</CardTitle>
              <CardDescription>Настройки Telegram бота</CardDescription>
            </div>
            <Switch v-model="integrations.telegram.enabled" />
          </div>
        </div>
      </CardHeader>
      <CardContent class="space-y-4" :class="{'opacity-50': !integrations.telegram.enabled}">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="telegram-bot-name">Имя бота</Label>
            <Input
                id="telegram-bot-name"
                v-model="integrations.telegram.botName"
                placeholder="MyCompanyBot"
                :disabled="!integrations.telegram.enabled"
            />
          </div>
          <div class="space-y-2">
            <Label for="telegram-token">Токен бота</Label>
            <Input
                id="telegram-token"
                v-model="integrations.telegram.apiToken"
                type="password"
                placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                :disabled="!integrations.telegram.enabled"
            />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="telegram-chat-id">ID чата</Label>
            <Input
                id="telegram-chat-id"
                v-model="integrations.telegram.chatId"
                placeholder="-100123456789"
                :disabled="!integrations.telegram.enabled"
            />
          </div>
          <div class="space-y-2">
            <Label for="telegram-webhook">Webhook URL</Label>
            <Input
                id="telegram-webhook"
                v-model="integrations.telegram.webhookUrl"
                placeholder="https://ваш-сайт.ru/api/telegram"
                :disabled="!integrations.telegram.enabled"
            />
          </div>
        </div>
        <div class="flex justify-between pt-4 border-t">
          <div class="flex space-x-2">
            <Button
                variant="outline"
                :disabled="!integrations.telegram.enabled"
                @click="testTelegramConnection"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              Проверить
            </Button>
            <Button
                variant="secondary"
                :disabled="!integrations.telegram.enabled"
                @click="sendTestMessage"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
              Тест сообщение
            </Button>
          </div>
          <Button
              :disabled="!integrations.telegram.enabled || !hasTelegramChanges"
              @click="saveTelegram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Сохранить
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Глобальное сохранение -->
    <div class="flex justify-end space-x-3 pt-4 border-t">
      <Button variant="outline" @click="resetChanges">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Сбросить изменения
      </Button>
      <Button
          :disabled="!hasChanges"
          @click="saveAll"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
        </svg>
        Сохранить все
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { toast } from '@/components/ui/toast'

// Компоненты shadcn-vue
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

// Состояния интеграций
const initialData = {
  whatsapp: {
    enabled: true,
    phoneNumber: '',
    apiToken: '',
    webhookUrl: ''
  },
  telegram: {
    enabled: true,
    botName: '',
    apiToken: '',
    chatId: '',
    webhookUrl: ''
  }
}

const integrations = ref(JSON.parse(JSON.stringify(initialData)))
const savedData = ref(JSON.parse(JSON.stringify(initialData)))

// Вычисляемые свойства для изменений
const hasWhatsAppChanges = computed(() => {
  return JSON.stringify(integrations.value.whatsapp) !== JSON.stringify(savedData.value.whatsapp)
})

const hasTelegramChanges = computed(() => {
  return JSON.stringify(integrations.value.telegram) !== JSON.stringify(savedData.value.telegram)
})

const hasChanges = computed(() => {
  return hasWhatsAppChanges.value || hasTelegramChanges.value
})

// Методы для WhatsApp
const testWhatsAppConnection = async () => {
  try {
    // Здесь будет API запрос для проверки подключения
    toast({
      title: 'Проверка подключения WhatsApp',
      description: 'Соединение успешно установлено',
      variant: 'success'
    })
  } catch (error) {
    toast({
      title: 'Ошибка подключения',
      description: error.message || 'Не удалось подключиться к WhatsApp API',
      variant: 'destructive'
    })
  }
}

const saveWhatsApp = async () => {
  try {
    // Здесь будет API запрос для сохранения
    savedData.value.whatsapp = JSON.parse(JSON.stringify(integrations.value.whatsapp))
    toast({
      title: 'WhatsApp сохранен',
      description: 'Настройки успешно обновлены',
      variant: 'success'
    })
  } catch (error) {
    toast({
      title: 'Ошибка сохранения',
      description: error.message || 'Не удалось сохранить настройки WhatsApp',
      variant: 'destructive'
    })
  }
}

// Методы для Telegram
const testTelegramConnection = async () => {
  try {
    // Здесь будет API запрос для проверки подключения
    toast({
      title: 'Проверка подключения Telegram',
      description: 'Бот успешно подключен',
      variant: 'success'
    })
  } catch (error) {
    toast({
      title: 'Ошибка подключения',
      description: error.message || 'Не удалось подключиться к Telegram Bot API',
      variant: 'destructive'
    })
  }
}

const sendTestMessage = async () => {
  try {
    // Здесь будет API запрос для отправки тестового сообщения
    toast({
      title: 'Тестовое сообщение отправлено',
      description: 'Проверьте ваш Telegram чат',
      variant: 'success'
    })
  } catch (error) {
    toast({
      title: 'Ошибка отправки',
      description: error.message || 'Не удалось отправить тестовое сообщение',
      variant: 'destructive'
    })
  }
}

const saveTelegram = async () => {
  try {
    // Здесь будет API запрос для сохранения
    savedData.value.telegram = JSON.parse(JSON.stringify(integrations.value.telegram))
    toast({
      title: 'Telegram сохранен',
      description: 'Настройки успешно обновлены',
      variant: 'success'
    })
  } catch (error) {
    toast({
      title: 'Ошибка сохранения',
      description: error.message || 'Не удалось сохранить настройки Telegram',
      variant: 'destructive'
    })
  }
}

// Общие методы
const saveAll = async () => {
  try {
    await Promise.all([saveWhatsApp(), saveTelegram()])
    toast({
      title: 'Все изменения сохранены',
      description: 'Настройки мессенджеров обновлены',
      variant: 'success'
    })
  } catch (error) {
    toast({
      title: 'Ошибка сохранения',
      description: error.message || 'Не удалось сохранить все настройки',
      variant: 'destructive'
    })
  }
}

const resetChanges = () => {
  integrations.value = JSON.parse(JSON.stringify(savedData.value))
  toast({
    title: 'Изменения сброшены',
    description: 'Все несохраненные изменения отменены',
    variant: 'default'
  })
}
</script>