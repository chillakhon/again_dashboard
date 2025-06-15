<template>
  <Toaster/>
  <div>
    <!--        <PageHeading :title="pageTitle"/>-->
    <BackButton title="Новый товар" class="mb-2"/>
    <form @submit.prevent="handleCreate" class="">

      <div class="grid ">

        <div class="space-y-3">

          <div class="border p-2 rounded-lg ">
            <PositionSelect :product="product"/>
          </div>

          <!--        о таваре-->
          <div class="border p-2 rounded-lg">
            <Accordion type="single" collapsible default-value="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <span class="pl-1 text-md text-sm">О товаре</span>
                </AccordionTrigger>
                <AccordionContent>

                  <div class="p-2">
                    <UploadImages/>
                  </div>

                  <div class="grid w-full items-center gap-2 p-2">
                    <Label for="name">Наименование*</Label>
                    <Input
                        id="name"
                        type="text"
                        required
                        placeholder="Наименование"
                        v-model="product.name"
                    />
                  </div>
                  <div class="grid w-full items-center gap-2 p-2">
                    <Label for="description">Описание</Label>
                    <Textarea
                        class="min-h-[100px]"
                        id="description"
                        type="text"
                        placeholder="Укажите главные особенности, характеристики и ключевые слова, чтобы сгенерировать более качественное описание."
                        v-model="product.description"
                    />
                  </div>

                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <!--        Цены и остатки-->
          <div class="border border-gray-300 rounded-lg p-2">
            <PriceStock :product="product"/>
          </div>

          <!--        Артикул и габариты-->
          <div class="border p-2 rounded-lg font-medium">
            <SkuSize :product="product"/>
          </div>


          <div class="border p-2 rounded-lg font-medium">
            <ProductVariant/>
          </div>
        </div>
      </div>

      <Button
          type="submit"
          class="bg-blue-400 hover:bg-blue-500 active:bg-blue-400 mt-2">
        Создать
      </Button>

    </form>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import BackButton from "@/components/BackButton.vue";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'
import UploadImages from "@/components/products/create/partials/UploadImages.vue";
import PriceStock from "@/components/products/create/partials/PriceStock.vue";
import SkuSize from "@/components/products/create/partials/SkuSize.vue";
import ProductVariant from "@/components/products/create/partials/ProductVariant.vue";
import PositionSelect from "@/components/products/create/partials/PositionSelect.vue";
import Product from "@/models/Product";
import Button from "@/components/ui/button/Button.vue";
import {toast} from 'vue-sonner'
import axios from "axios";
import {useRouter} from "vue-router";

const router = useRouter()
const product = ref<Product>(new Product())

const handleCreate = async () => {
  if (!product.value.name) {
    toast('Ошибка!', {
      description: 'Пожалуйста, укажите наименование товара.',
      action: {
        label: 'Отмена',
      },
    })
    return
  }
  if (!product.value.price) {
    toast('Ошибка!', {
      description: 'Пожалуйста, укажите цена товара.',
      action: {
        label: 'Отмена',
      },
    })
    return
  }

  await createProduct()

}


async function createProduct() {

  const p = product.value

  const formData: Record<string, number> = {};

  for (const key in p) {
    if (typeof p[key] === "boolean") {
      formData[key] = p[key] ? 1 : 0;
    } else {
      formData[key] = p[key]
    }
  }

  await axios.post("products", product.value)
      .then(res => {
        toast("Успех!", {
          description: "Товар успешно создан.",
          action: {
            label: "Ок",
          },
        });

        router.push("/products");
      })
      .catch(err => {
        toast("Ошибка!", {
          description: `${err.message}`,
          action: {
            label: "Отмена",
          },
        });
      });
}

</script>