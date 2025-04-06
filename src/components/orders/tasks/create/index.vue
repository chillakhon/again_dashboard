<template>
  <Card>
    <CardHeader>
      <!--      <CardTitle>Создание новой задачи</CardTitle>-->
      <BackButton title="Создание новой задачи"/>
      <CardDescription>Заполните все необходимые поля</CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Название задачи -->
          <div class="space-y-2">
            <Label for="title">Название задачи</Label>
            <Input id="title" v-model="form.title" placeholder="Введите название" required/>
          </div>

          <!-- Описание -->
          <div class="space-y-2">
            <Label for="description">Описание</Label>
            <Textarea id="description" v-model="form.description" placeholder="Подробное описание задачи"/>
          </div>

          <!-- Статус -->
          <div class="space-y-2">
            <Label for="status">Статус</Label>
            <Select v-model="form.status_id">
              <SelectTrigger>
                <SelectValue placeholder="Выберите статус"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="status in statuses" :key="status.id" :value="status.id">
                  {{ status.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Приоритет -->
          <div class="space-y-2">
            <Label for="priority">Приоритет</Label>
            <Select v-model="form.priority_id">
              <SelectTrigger>
                <SelectValue placeholder="Выберите приоритет"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="priority in priorities" :key="priority.id" :value="priority.id">
                  {{ priority.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Срок выполнения -->
          <div class="space-y-2">

            <Label for="due_date">Срок выполнения</Label>

            <date-picker v-model="form.due_date" placeholder="Выберите дату"/>


            <!--            <Popover>-->
            <!--              <PopoverTrigger as-child>-->
            <!--                <Button-->
            <!--                    variant="outline"-->
            <!--                    class="w-full justify-start text-left font-normal"-->
            <!--                >-->
            <!--                  <CalendarIcon class="mr-2 h-4 w-4" />-->
            <!--                  <span>{{ form.due_date ? formatDate(form.due_date) : 'Выберите дату' }}</span>-->
            <!--                </Button>-->
            <!--              </PopoverTrigger>-->
            <!--              <PopoverContent class="w-auto p-0">-->
            <!--                <Calendar v-model="form.due_date" mode="single" />-->
            <!--              </PopoverContent>-->
            <!--            </Popover>-->
          </div>

          <!-- Оценка времени -->
          <div class="space-y-2">
            <Label for="estimated_time">Оценка времени (минуты)</Label>
            <Input id="estimated_time" type="number" v-model="form.estimated_time" min="0"/>
          </div>

          <!-- Создатель -->
          <div class="space-y-2">
            <Label for="creator">Создатель</Label>
            <Select v-model="form.creator_id">
              <SelectTrigger>
                <SelectValue placeholder="Выберите создателя"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Исполнитель -->
          <div class="space-y-2">
            <Label for="assignee">Исполнитель</Label>
            <Select v-model="form.assignee_id">
              <SelectTrigger>
                <SelectValue placeholder="Выберите исполнителя"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Родительская задача -->
          <div class="space-y-2">
            <Label for="parent">Родительская задача</Label>
            <Select v-model="form.parent_id">
              <SelectTrigger>
                <SelectValue placeholder="Выберите родительскую задачу"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="task in tasks" :key="task.id" :value="task.id">
                  {{ task.title }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Метки -->
          <!--          <div class="space-y-2">-->
          <!--            <Label>Метки</Label>-->
          <!--            <div class="flex flex-wrap gap-2">-->
          <!--              <Checkbox-->
          <!--                  v-for="label in allLabels"-->
          <!--                  :key="label.id"-->
          <!--                  :id="`label-${label.id}`"-->
          <!--                  v-model:checked="form.labels"-->
          <!--                  :value="label.id"-->
          <!--              >-->
          <!--                {{ label.name }}-->
          <!--              </Checkbox>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>

        <div class="flex justify-end gap-2">
<!--          <Button type="button" variant="outline" @click="resetForm">Отмена</Button>-->
          <Button type="submit">Создать задачу</Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {toast} from 'vue-sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'
import {Button} from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {Calendar} from '@/components/ui/calendar'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {Checkbox} from '@/components/ui/checkbox'
import DatePicker from "@/components/common/DatePicker.vue";
import BackButton from "@/components/BackButton.vue";
import axios from "axios";
import {useRouter} from "vue-router";

const router = useRouter()

// Типы данных
interface Status {
  id: number
  name: string
}

interface Priority {
  id: number
  name: string
}

interface User {
  id: number
  name: string
}

interface Task {
  id: number
  title: string
}

interface Label {
  id: number
  name: string
}

// Данные формы
const form = ref({
  title: '',
  description: '',
  status_id: 1,
  priority_id: 1,
  creator_id: 1,
  assignee_id: 2,
  parent_id: null as number | null,
  due_date: null as Date | null,
  estimated_time: 120,
  labels: [] as number[],
})

// Моковые данные (в реальном приложении будут приходить из API)
const statuses = ref<Status[]>([
  {id: 1, name: 'Открыта'},
  {id: 2, name: 'В работе'},
  {id: 3, name: 'На проверке'},
  {id: 4, name: 'Завершена'},
])

const priorities = ref<Priority[]>([
  {id: 1, name: 'Критический'},
  {id: 2, name: 'Высокий'},
  {id: 3, name: 'Средний'},
  {id: 4, name: 'Низкий'},
])

const users = ref<User[]>([
  {id: 1, name: 'Иван Иванов'},
  {id: 2, name: 'Петр Петров'},
  {id: 3, name: 'Сергей Сергеев'},
])

const tasks = ref<Task[]>([
  {id: 1, title: 'Рефакторинг кода'},
  {id: 2, title: 'Добавить тесты'},
  {id: 3, title: 'Исправить баги'},
])

const allLabels = ref<Label[]>([
  {id: 1, name: 'Баг'},
  {id: 2, name: 'Улучшение'},
  {id: 3, name: 'Документация'},
])

// Методы
const handleSubmit = async () => {
  console.log('Отправка формы:', {
    ...form.value,
    due_date: form.value.due_date ? form.value.due_date.toISOString() : null,
  })

  await axios.post('tasks', form.value)
      .then(res => {
        toast.success('Задача создана успешно')
        router.push('/orders/tasks')
      })
      .catch(() => {
        toast.error('Ошибка при создании задачи')
      })

}

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    status_id: 1,
    priority_id: 1,
    creator_id: 1,
    assignee_id: 2,
    parent_id: null,
    due_date: null,
    estimated_time: 120,
    labels: [],
  }
}

const formatDate = (date: Date | null) => {
  if (!date) return ''
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
</script>