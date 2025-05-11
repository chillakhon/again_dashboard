<template>
  <form
      @submit.prevent="submitForm(cityZone, loading)"
      class="grid gap-3"
  >
    <Input
        type="text"
        placeholder="Название зоны"
        v-model="cityZone.zone"
        required
    />

    <DynamicsDropdownSelect
        :options="deliverers"
        v-model="cityZone.deliverer_id"
        option-label="name"
        option-value="id"
        placeholder="Выберите доставщика"
        disabled="false"/>
    <DynamicsDropdownSelect
        :options="applicants"
        v-model="cityZone.applicant_id"
        option-label="name"
        option-value="id"
        placeholder="Выберите Торговый агент а"
        disabled="false"/>

    <Button type="submit">
      <Loader2 class="w-4 h-4 animate-spin" v-if="loading"/>
      Создать
    </Button>
  </form>
</template>

<script setup>
import {Button} from "@/components/ui/button";
import DynamicsDropdownSelect from "@/components/dynamics/Dropdown/Select.vue";
import {Loader2} from "lucide-vue-next";
import {toast} from "vue-sonner";
import {ref} from "vue";


const props = defineProps({
  deliverers: {
    type: Array,
    default: []
  },
  applicants: {
    type: Array,
    default: []
  }
})

const cityZone = ref({
  zone: null,
  applicant_id: null,
  deliverer_id: null
});

const loading = ref(false);

const emits = defineEmits(["submit"]);

const submitForm = async (cityZone, loading) => {
  if (cityZone.zone) {
    // const result = await useCityZoneFunctions().addCityZone(cityZone, loading);
    if (result) {
      emits('submit')
    }
  } else {
    toast.error("Название зоны обязательно");
  }
};
</script>

<style scoped></style>
