<template>
  <div class="flex justify-between mb-2 md:space-x-4 max-md:flex-col">
    <DynamicTitle
        title="Заявки"
        variant="primary"
    />

    <div class="w-full  flex md:space-x-2 max-md:space-y-2 max-md:flex-col">
      <ContactListSearch
          :key="renderSearchComp"
          :filter="searchParams"
          @search="handleSearch"
      />

      <Button
          v-if="hasActiveFilters"
          variant="outline"
          @click="resetFilters"
      >
        <X/>
      </Button>

    </div>
  </div>

  <Loader v-if="isLoading"/>
  <ContactListTable
      v-else
      :key="renderTable"
      :items="contacts"
      @deleted="fetchData()"
        @updated="fetchData()"
  />

  <PaginationTable
      class="flex justify-end"
      :total="totalItems"
      :default-page="currentPage"
      :items-per-page="itemsPerPage"
      :sibling-count="1"
      :show-edges="true"
      @current-page="currentPage = $event; fetchData()"
  />


</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import PaginationTable from "@/components/PaginationTable.vue";
import Loader from "@/components/common/Loader.vue";
import DynamicTitle from "@/components/dynamics/DynamicTitle.vue";
import Button from "@/components/ui/button/Button.vue";
import {X} from "lucide-vue-next"
import ContactListSearch from "@/components/contact_request/list/ContactListSearch.vue";
import ContactListTable from "@/components/contact_request/list/ContactListTable.vue";
import ContactRequest from "@/models/ContactRequest";
import {useContactRequestFunctions} from "@/composables/useContactRequestFunctions";
import {useStore} from "vuex";


const store = useStore();

const searchParams = ref({
  datePicker: {
    start: '',
    end: ''
  },
  search: '',
  status: '',
})


const hasActiveFilters = computed(() => {
  return !!searchParams.value.search || !!searchParams.value.datePicker.start || !!searchParams.value.datePicker.end || !!searchParams.value.status
})

const renderTable = ref(1)
const renderSearchComp = ref(1)


const isLoading = ref(true)
const contacts = ref<ContactRequest[]>([])

const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(15);


onMounted(async () => {
  await fetchData()
  await store.dispatch('notifications/markRequestsChecked');
})

const {getContactRequests} = useContactRequestFunctions()

async function fetchData() {

  isLoading.value = true

  const result = await getContactRequests({
    status: searchParams.value.status,
    page: currentPage.value,
    per_page: itemsPerPage.value,
    search: searchParams.value.search,
    date_from: searchParams.value.datePicker.start,
    date_to: searchParams.value.datePicker.end
  })

  contacts.value = result?.contactRequests ?? []
  currentPage.value = result?.meta.page ?? 1
  itemsPerPage.value = result?.meta.per_page ?? 15
  totalItems.value = result?.meta.total ?? 0

  isLoading.value = false
  renderTable.value++
}


const handleSearch = () => {
  fetchData()
}


function resetFilters() {
  searchParams.value = {
    datePicker: {
      start: '',
      end: ''
    },
    search: '',
    status: '',
  }

  currentPage.value = 1
  renderSearchComp.value++
  fetchData()
}

</script>
