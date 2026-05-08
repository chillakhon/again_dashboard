<template>
  <section class="flex flex-wrap items-center gap-2 rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
    <Button variant="outline" size="sm" type="button">
      <Plus class="mr-2 h-4 w-4" /> Позиция
    </Button>
    <Button variant="outline" size="sm" type="button">
      <Percent class="mr-2 h-4 w-4" /> Скидка
    </Button>
    <Button variant="outline" size="sm" type="button">
      <TicketPercent class="mr-2 h-4 w-4" /> Купон
    </Button>
    <span class="ml-auto flex items-center gap-2">
      <Button variant="outline" size="sm" type="button">
        <Printer class="mr-2 h-4 w-4" /> Печать
      </Button>
      <Button variant="outline" size="sm" type="button">
        <Mail class="mr-2 h-4 w-4" /> Письмо
      </Button>
      <Button variant="outline" size="sm" type="button">
        <MessageSquare class="mr-2 h-4 w-4" /> Чат
      </Button>
    </span>
  </section>
</template>

<script setup>
import { Plus, Percent, TicketPercent, Printer, Mail, MessageSquare } from "lucide-vue-next";
import Button from "@/components/ui/button/Button.vue";

defineProps({
  order: { type: Object, required: true },
});
</script>
