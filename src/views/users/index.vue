<template>
  <div class="py-2 px-3">
    <template v-if="user && user.isSuperAdmin">
      <Tabs v-model="currentTab">
        <TabsList>
          <TabsTrigger value="activated">
            Активные
          </TabsTrigger>
          <TabsTrigger value="deleted">
            Удаленные
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activated">
          <UsersList />
        </TabsContent>

        <TabsContent value="deleted">
          <UsersDeleted />
        </TabsContent>
      </Tabs>
    </template>
    <template v-else>
      <!-- Можно показать сообщение, что доступа нет или оставить пусто -->
      <p>У вас нет доступа к данному разделу.</p>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersList from "@/components/users/Index.vue";
import UsersDeleted from "@/components/users/Deleted.vue";
import { User } from "@/models/user/User";
import { useStore } from "vuex";

const currentTab = ref("activated");
const store = useStore();
const user = computed(() => User.fromJson(store.getters['auth/user']));
</script>
