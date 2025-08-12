<template>
  <div>
    <DynamicsDataTable
        :data="items"
        :columns="columns"
        :show-print-button="false"
        :edit="edit"
        @deleted="handleDeleted"
        @save_changes="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import {h, PropType, ref} from "vue";
import DynamicsDataTable from "@/components/dynamics/DataTable/Index.vue";
import HomeSlider from "@/models/HomeSlider";

import SlideEdit from "@/components/settings/home_slider/SlideEdit.vue";
import {useHomeSlideFunctions} from "@/composables/useHomeSlideFunctions";
import {Check, X} from "lucide-vue-next";

const props = defineProps({
  items: {
    type: Array as PropType<HomeSlider[]>,
    default: () => [],
  },
  loading: Boolean,
});

const emits = defineEmits(["deleted", "updated"]);

const {deleteSlide, updateSlide} = useHomeSlideFunctions();

const edit = ref({
  title: "Редактирование слайда",
  description: "Измените поля слайда, включая текст и изображение",
  component: SlideEdit,
  dynamicStyle: "2xl:min-w-[70vw] xl:min-w-[80vw] max-md:min-w-full md:min-w-[95vw]",
  loader: false,
});

const columns = [

  {
    accessorKey: "id",
    header: "№",
    cell: ({row}: any) => Number(row.id) + 1,
  },
  {
    accessorKey: "order",
    header: "Порядок отображения",
  },
  {
    accessorKey: "title",
    header: "Заголовок",
  },
  {
    accessorKey: "subtitle",
    header: "Подзаголовок",
  },
  {
    accessorKey: "text",
    header: "Текст",
  },
  {
    accessorKey: "image_url",
    header: "Картинка",
    cell: ({row}: any) => {
      const url = row.original.imageURL('sm');
      const originalUrl = row.original.imageURL('original');
      return url
          ? h(
              "img",
              {
                src: url,
                alt: row.original.title ?? "slide image",
                style: "height: 40px; object-fit: contain; cursor: pointer;",
                onClick: () => {
                  window.open(originalUrl, "_blank");
                },
              }
          )
          : "-";
    },
  },

  {
    accessorKey: "is_active",
    header: "Активировано",
    cell: (row: any) => {
      return row.getValue()
          ? h(Check, {class: "h-4 w-4 text-green-500"})
          : h(X, {class: "h-4 w-4 text-red-500"});
    },
  },
];

const handleDeleted = async (slide: HomeSlider) => {
  if (!slide.id) return;
  const success = await deleteSlide(slide.id);
  if (success) emits("deleted");
};

const handleSave = async (slide: HomeSlider) => {
  if (!slide.id) return;
  // При обновлении слайда передаем всю модель, т.к. в toFormDataForSave учтен файл
  const updatedSlide = await updateSlide(slide.id, slide);
  if (updatedSlide) emits("updated");
};
</script>
