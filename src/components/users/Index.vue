<template>

  <Loader v-if="isLoading"/>
  <div v-else>
    <UsersAdd
        class="mb-2"
        :permissions="data?.permissions"
        :roles="data?.roles"
        @submit="fetchData()"
    />
    <UsersTable
        :users="users"
        @deleted="deleteUser($event)"
        :key="users.length"
    />
    <div
        class="mt-2 flex justify-end"
    >
      <PaginationTable
          :items-per-page="itemsPerPage"
          :total="totalItems"
          :default-page="currentPage"
          @current-page="
          currentPage = $event;
          fetchData();
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import {ref, onMounted} from "vue"
import PaginationTable from "@/components/PaginationTable.vue";
import UsersTable from "@/components/users/Table.vue";
import UsersAdd from "@/components/users/Add/Index.vue";
import {User} from "@/models/user/User"
import Loader from "@/components/common/Loader.vue";

const data = ref()
const users = ref<User[]>([]);

const isLoading = ref(true);
const currentPage = ref(1);
const totalItems = ref(0);
const itemsPerPage = ref(10);

const deleteUser = (user) => {
  users.value = users.value.filter(
      (item) => item.id !== user.id
  );
};

async function fetchData() {

  await axios
      .get(
          `/users?page=${currentPage.value}&per_page=${itemsPerPage.value}`
      )
      .then((res) => {
        if (res.data.users.data) {
          users.value = res.data.users.data.map(item => User.fromJSON(item))
          data.value = res.data
          console.log(res.data)
        }

        totalItems.value = res.data.users.total;
      })
      .catch(() => {
        users.value = [];
      })
      .finally(() => {
        isLoading.value = false;
      });
}

onMounted((res) => {
  fetchData();
});
</script>
