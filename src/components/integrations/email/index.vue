<template>
  <div class="space-y-6 p-6 max-w-4xl mx-auto">
    <div>
      <h1 class="text-2xl font-bold">Настройки email-рассылок</h1>
      <p class="text-muted-foreground">Интеграция с Яндекс 360 для email-маркетинга</p>
    </div>

    <Separator />

    <!-- Яндекс 360 -->
    <Card>
      <CardHeader>
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-md bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0a12 12 0 100 24 12 12 0 000-24zm4.5 17.5c-.4.2-.9.4-1.4.5-.5.2-1.1.3-1.7.3-1.5 0-2.7-.5-3.5-1.4-.8-.9-1.2-2.1-1.2-3.6V7.7h2.6v6.5c0 .8.2 1.4.5 1.8.3.4.8.6 1.5.6.4 0 .8-.1 1.2-.2.4-.1.7-.3 1-.5v-8.2h2.6v9.8z"/>
            </svg>
          </div>
          <div class="flex-1 flex justify-between items-center">
            <div>
              <CardTitle>Яндекс 360</CardTitle>
              <CardDescription>Настройки интеграции с почтовыми рассылками</CardDescription>
            </div>
            <Switch v-model="emailEnabled.yandex360" />
          </div>
        </div>
      </CardHeader>
      <CardContent class="space-y-4" :class="{'opacity-50': !emailEnabled.yandex360}">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="yandex-client-id">Client ID</Label>
            <Input id="yandex-client-id" v-model="emailData.yandex360.clientId" placeholder="Введите Client ID" :disabled="!emailEnabled.yandex360" />
          </div>
          <div class="space-y-2">
            <Label for="yandex-client-secret">Client Secret</Label>
            <Input id="yandex-client-secret" v-model="emailData.yandex360.clientSecret" type="password" placeholder="Введите Client Secret" :disabled="!emailEnabled.yandex360" />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="yandex-email">Email отправителя</Label>
            <Input id="yandex-email" v-model="emailData.yandex360.senderEmail" placeholder="no-reply@ваш-домен.ru" :disabled="!emailEnabled.yandex360" />
          </div>
          <div class="space-y-2">
            <Label for="yandex-sender-name">Имя отправителя</Label>
            <Input id="yandex-sender-name" v-model="emailData.yandex360.senderName" placeholder="Ваша компания" :disabled="!emailEnabled.yandex360" />
          </div>
        </div>
        <div class="space-y-2">
          <Label for="yandex-webhook">Webhook URL</Label>
          <Input id="yandex-webhook" v-model="emailData.yandex360.webhookUrl" placeholder="https://ваш-сайт.ru/api/yandex-webhook" :disabled="!emailEnabled.yandex360" />
        </div>
        <div class="flex flex-wrap items-center md:space-x-2 max-md:space-y-2 pt-2">
          <Button :disabled="!emailEnabled.yandex360" variant="outline" class="max-md:w-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            Тестировать подключение
          </Button>
          <Button :disabled="!emailEnabled.yandex360" variant="secondary" class="max-md:w-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            Авторизоваться в Яндекс
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Дополнительные настройки -->
    <Card>
      <CardHeader>
        <CardTitle>Дополнительные параметры</CardTitle>
        <CardDescription>Настройки шаблонов и ограничений</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="daily-limit">Лимит писем в день</Label>
            <Input id="daily-limit" v-model="emailSettings.dailyLimit" type="number" placeholder="500" />
          </div>
          <div class="space-y-2">
            <Label for="default-template">Шаблон по умолчанию</Label>
            <Select v-model="emailSettings.defaultTemplate" :disabled="!emailEnabled.yandex360">
              <SelectTrigger>
                <SelectValue placeholder="Выберите шаблон" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="welcome">Приветственное</SelectItem>
                <SelectItem value="notification">Уведомление</SelectItem>
                <SelectItem value="promo">Промо-письмо</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <Switch id="track-opens" v-model="emailSettings.trackOpens" />
          <Label for="track-opens">Отслеживать открытия писем</Label>
        </div>
        <div class="flex items-center space-x-2">
          <Switch id="track-clicks" v-model="emailSettings.trackClicks" />
          <Label for="track-clicks">Отслеживать переходы по ссылкам</Label>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const emailEnabled = ref({
  yandex360: true
})

const emailData = ref({
  yandex360: {
    clientId: '',
    clientSecret: '',
    senderEmail: '',
    senderName: '',
    webhookUrl: ''
  }
})

const emailSettings = ref({
  dailyLimit: 500,
  defaultTemplate: 'welcome',
  trackOpens: true,
  trackClicks: true
})
</script>