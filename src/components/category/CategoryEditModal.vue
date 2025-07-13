<template>
  <DialogModal
      @dialog-open="dialogOpen"
  >
    <template #button>
      <IconButtons :buttons="[
          {type: 'edit'}
      ]"/>
    </template>

    <template #content>
      <Loader v-if="sending"/>
      <CategoryForm
          v-else
          :formData="category"
          submit-button-name="Сохранить"
          @submit-form="handleSaveToServe"
      />
    </template>

  </DialogModal>
</template>

<script setup lang="ts">
import DialogModal from "@/components/dynamics/shadcn/DialogModal.vue";
import CategoryForm from "@/components/category/CategoryForm.vue";
import {Category} from "@/models/Category";
import {ref} from "vue";
import {useCategoryFunctions} from "@/composables/useCategoryFunctions";
import IconButtons from "@/components/dynamics/IconButtons.vue";

const emit = defineEmits(["update"]);

const props = defineProps({
  item: {
    type: Category,
    required: true
  }
})

const category = ref<Category>(props.item);

const {sending, updateCategory, getProductsByCategory} = useCategoryFunctions()


const dialogOpen = async (param: boolean) => {
  if (param) {

    console.log(props.item)

    category.value.productIds = await getProductsByCategory({category_id: category.value.id})
        .then(res => {
          return res.products?.map((product: any) => product.id);
        })
  }
}


const handleSaveToServe = async () => {


  const result = await updateCategory(category.value.id, category.value.toJSON())

  if (result) {
    emit('update')
  }

}

</script>

<style scoped>

</style>