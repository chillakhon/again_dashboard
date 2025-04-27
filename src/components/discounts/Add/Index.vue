<template>
  <div class="flex">
    <Button
        variant="outline"
        size="icon"
        class="w-auto px-3"
        @click="dialogOpen = true"
    >
      <CirclePlus class="w-4 h-4 mr-2" /> Добавить скидку
    </Button>

    <DynamicsModal
        :dialog-open="dialogOpen"
        @close="dialogOpen = false"
        title="Добавить новую скидку"
        description="Заполните параметры скидки"
    >
      <template v-slot:content>
        <DiscountForm
            @submit="handleSubmit"
        />
      </template>
    </DynamicsModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { Button } from "@/components/ui/button";
import DynamicsModal from "@/components/dynamics/Modal.vue";
import DiscountForm from "@/components/discounts/Form/index.vue";
import { CirclePlus } from "lucide-vue-next";
import { useDiscountFunctions } from "@/composables/useDiscountFunctions";
import { toast } from "vue-sonner";

const emit = defineEmits(['submit'])
const dialogOpen = ref(false);
const { addDiscount } = useDiscountFunctions();

async function handleSubmit(discountData: any) {

  dialogOpen.value = false;
  emit('submit');
  return
  try {

    // console.log(discountData)
    // return

    // await addDiscount(discountData);
    dialogOpen.value = false;
    emit('submit');
    toast.success("Скидка успешно создана");
  } catch (error) {
    toast.error("Ошибка при создании скидки");
    console.error("Error adding discount:", error);
  }
}
</script>

<style scoped></style>