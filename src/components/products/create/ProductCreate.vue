<template>
  <Toaster/>
  <div>
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
                    <ImageManager
                        v-model="product.images"
                        :show-button-save="false"
                        :horizontal="true"
                    />

                    <!--                    <UploadImages/>-->
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
            <ProductVariant :product="product"/>
          </div>
        </div>
      </div>

      <div class="flex justify-end py-2">
        <Button type="submit" class="">
          Создать
        </Button>
      </div>

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
import {Product} from "@/models/Product";
import Button from "@/components/ui/button/Button.vue";
import {toast} from 'vue-sonner'
import axios from "axios";
import {useRouter} from "vue-router";
import ImageManager from "@/components/dynamics/ImageManager.vue";
import {useRandom} from "@/composables/useRandom";
import {useProductImageUploader} from "@/composables/useProductImageUploader";


const {getRandomInt} = useRandom()

const router = useRouter()

const product = ref<Product>(Product.fromJSON({
  name: `New Product${getRandomInt(100, 1000)}`,
  description: '',
  price: getRandomInt(10, 100),
  cost_price: getRandomInt(10, 100),
  weight: getRandomInt(10, 100),
  length: getRandomInt(10, 100),
  width: getRandomInt(10, 100),
  height: getRandomInt(10, 100),
  barcode: getRandomInt(100, 1000),
  sku: getRandomInt(100, 1000),

}))


const {setImagesWithProduct} = useProductImageUploader()

const handleCreate = async () => {
  // await createProduct()

  // console.log(product.value)
  // return

  await setImagesWithProduct(product.value)

}


// async function createProduct() {
//
//   // const p = product.value.toJSONForCreate()
//
//
//   // p.variants.forEach((variant: Product) => {
//   //   const uuidLocalWithImageVariant = `variant_images_${variant.local_uuid}`
//   //   p[uuidLocalWithImageVariant] = variant.images
//   //   delete variant.images
//   // })
//
//   console.log(p)
//   return
//   await axios.post("products", p)
//       .then(res => {
//
//         console.log(res.data)
//         // router.push("/products");
//       })
//       .catch(err => {
//
//       });
//
// }

</script>