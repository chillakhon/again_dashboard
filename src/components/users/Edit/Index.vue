<template>
  <form class="grid gap-3" v-show="!item.changePass">
    <div class="flex gap-2">
      <Input type="text" placeholder="Имя" v-model="item.profile.first_name"/>
      <Input type="text" placeholder="Фамилия" v-model="item.profile.last_name"/>
    </div>

    <Input type="email" placeholder="Почта (E-mail)" v-model="item.email"/>
    <Input type="tel" placeholder="Телефон" v-model="item.profile.phone"/>

    <div class="space-y-2">
      <Label for="roles">Роли <span class="text-red-500">*</span></Label>
      <MultiSelect
          id="roles"
          v-model="selectedRoleIds"
          :options="roles"
          optionLabel="name"
          optionValue="id"
          placeholder="Выберите роли"
      />
    </div>

    <div class="space-y-2">
      <Label for="permissions">Разрешения</Label>
      <MultiSelect
          id="permissions"
          :options="permissions"
          v-model="selectedPermissionIds"
          optionLabel="name"
          optionValue="id"
          placeholder="Выберите разрешения"
      />
    </div>
  </form>

  <UsersEditChangePassword
      v-show="item.changePass"
      :changePass="item.changePass"
      :item="item"
  />

  <button
      type="button"
      class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
      @click="item.changePass = !item.changePass"
  >
    {{ !item.changePass ? "Изменить пароль" : "Сбросить изменение" }}
  </button>
</template>

<script setup>
import {Input} from "@/components/ui/input"
import UsersEditChangePassword from "@/components/users/Edit/ChangePassword.vue"
import axios from "axios"
import {watch, onMounted, ref} from "vue"
import MultiSelect from "@/components/dynamics/Dropdown/MultiSelect.vue"
import {Label} from "@/components/ui/label"

const permissions = ref([])
const roles = ref([])

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const selectedPermissionIds = ref()

const selectedRoleIds = ref()


watch(selectedPermissionIds, (ids) => {
  props.item.permissions = ids
})


watch(selectedRoleIds, (ids) => {
  props.item.roles = ids
})

// Инициализация
if (!props.item.changePass) {
  props.item.changePass = false
}
if (!props.item.roles) {
  props.item.roles = []
}
if (!props.item.permissions) {
  props.item.permissions = []
}

onMounted(() => {
  getRoles()
  getPermissions()
})

function getRoles() {
  axios.get('roles')
      .then(res => {
        roles.value = res.data.data || []
      })
      .catch(error => {
        console.error('Error fetching roles:', error)
        roles.value = []
      })
}

function getPermissions() {
  axios.get('permissions')
      .then(res => {
        permissions.value = res.data.data || []
      })
      .catch(error => {
        console.error('Error fetching permissions:', error)
        permissions.value = []
      })
}
</script>

<style scoped>

</style>