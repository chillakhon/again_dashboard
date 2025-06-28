<template>
  <DialogModal>
    <template #button>
      <Button variant="outline" class="max-md:w-full">Добавить</Button>
    </template>

    <template #content>
      <Loader v-if="sending"/>
      <CategoryForm
          v-else
          :formData="category"
          @submit-form="handleSaveToServe"
      />
    </template>

  </DialogModal>
</template>

<script setup lang="ts">
import {Button} from "@/components/ui/button";
import DialogModal from "@/components/dynamics/shadcn/DialogModal.vue";
import CategoryForm from "@/components/category/CategoryForm.vue";
import {Category} from "@/models/Category";
import {ref} from "vue";
import {useCategoryFunctions} from "@/composables/useCategoryFunctions";

const emit = defineEmits(["created", "update"]);

const props = defineProps({
  item: {
    type: Category,
    default: undefined,
  }
})

const category = ref<Category>(Category.fromJSON({}));

const {createCategory, sending} = useCategoryFunctions()

const handleSaveToServe = async () => {

  await createCategory(category.value.toJSON())

  emit('created')

  // console.log(category.value);

}

</script>

<style scoped>

</style>