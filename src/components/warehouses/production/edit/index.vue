<template>
  <form class="grid gap-3">
    <Input
        type="text"
        placeholder="Название зоны"
        v-model="item.zone"
        required
    />

    <DynamicsDropdownSelect
        :options="dynamicData?.deliverers"
        v-model="item.deliverer_id"
        option-label="name"
        option-value="id"
        placeholder="Выберите доставщика"
        label="Доставщик"
    />
    <!--    {{ item.applicant_id }}-->
    <DynamicsDropdownSelect
        :options="dynamicData?.applicants"
        v-model="item.applicant_id"
        option-label="name"
        option-value="id"
        placeholder="Выберите Торговый агент а"
        label="Торговый агент "
    />
  </form>
</template>

<script setup>


const props = defineProps({
  dynamicData: {
    type: Object
  },
  item: Object
})


const loading = ref(false);

const emits = defineEmits(["submit"]);


</script>

<style scoped></style>
