<template>
    <div>
        <PageHeading :title="pageTitle"/>
        <div class="mt-10 mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div class="lg:col-start-3 lg:row-end-1">
                <div class="p-6 rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
                    <div class="flex flex-wrap">
                        <div class="flex-auto">
                            <h2 class="text-sm/6 font-semibold text-gray-900">Расположение на сайте</h2>
                        </div>
                        <div class="mt-6 flex w-full gap-x-4 border-t border-gray-900/5 pt-6">
                            <SwitchGroup as="div" class="w-full flex items-center justify-between">
                                    <span class="flex grow flex-col">
                                        <SwitchLabel as="span" class="text-sm/6 font-medium text-gray-900" passive>На сайте</SwitchLabel>
                                    </span>
                                    <Switch v-model="enabled" :class="[enabled ? 'bg-indigo-600' : 'bg-gray-200', 'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2']">
                                        <span aria-hidden="true" :class="[enabled ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']" />
                                    </Switch>
                                    <span class="ml-2">
                                        <SwitchDescription as="span" class="text-sm text-gray-500">Показывать</SwitchDescription>
                                    </span>
                            </SwitchGroup>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div class="-mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2">
                <div class="mt-8">
                    <div class="">
                        <label for="name" class="block text-sm/6 font-medium text-gray-900">Наименование</label>
                        <div class="mt-2">
                            <input id="name" name="name" type="text" autocomplete="name" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div class="mt-4">
                        <label for="description" class="block text-sm/6 font-medium text-gray-900">Описание</label>
                        <div class="mt-2">
                            <textarea name="description" id="description" rows="3" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                        <p class="mt-3 text-sm/6 text-gray-600">Добавьте описание к товару.</p>
                    </div>
                </div>
                <div class="mt-8">
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import PageHeading from '@/components/common/PageHeading.vue'
import ImageUpload from './partials/ImageUpload.vue'

import { Switch, SwitchDescription, SwitchGroup, SwitchLabel } from '@headlessui/vue'

const pageTitle = 'Добавить товар';

const enabled = ref(false);
</script>