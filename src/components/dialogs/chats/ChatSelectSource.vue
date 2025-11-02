<template>
  <div>
    <DynamicForm
        v-model="props.currentSource"
        :fields="formFields"
    />
  </div>
</template>

<script setup lang="ts">
import DynamicForm from "@/components/dynamics/DynamicForm.vue";
import {ref, watch} from "vue";
import {FormDynamicFieldType} from "@/types/form";
import {MessageCircle, Smartphone, Send,MessageSquare} from 'lucide-vue-next';


const emit = defineEmits(['changeSource']);

const props = defineProps({
  currentSource: {
    type: Object,
    required: true,
    default: {
      source: 'all'
    }
  }
})


const formFields = ref<FormDynamicFieldType[]>([
  {
    name: 'source',
    component: 'select',
    label: '',
    required: false,
    placeholder: 'Выберите..',
    options: [
      {title: 'Все диалоги', value: 'all',},
      {title: 'Онлайн чат', value: 'web_chat', icon: MessageCircle, styleIcon: 'text-green-700'},
      {title: 'Vk', value: 'vk', icon: MessageSquare, styleIcon: 'text-blue-800'},
      {title: 'WhatsApp', value: 'whatsapp', icon: Smartphone, styleIcon: 'text-green-500'},
      {title: 'Telegram', value: 'telegram', icon: Send, styleIcon: 'text-blue-400'},
    ],
    optionLabel: 'title',
    optionValue: 'value'
  },
])



</script>

<style scoped>

</style>