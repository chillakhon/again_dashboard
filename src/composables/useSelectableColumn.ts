import {ref} from "vue"
import {h} from "vue"
import {Checkbox} from "@/components/ui/checkbox"

export function useSelectableColumn() {
    const selectedIds = ref<number[]>([])

    // возвращаем колонку "select"
    const selectColumn = {
        id: "select",
        header: ({table}: any) => h(Checkbox, {
            modelValue: table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate"),
            "onUpdate:modelValue": (value: any) => {
                table.toggleAllPageRowsSelected(!!value)

                // обновляем selectedIds
                selectedIds.value = table.getSelectedRowModel().rows.map((r: any) => r.original.id)
            },
            ariaLabel: "Select all",
        }),
        cell: ({row, table}: any) => h(Checkbox, {
            modelValue: row.getIsSelected(),
            "onUpdate:modelValue": (value: any) => {
                row.toggleSelected(!!value)

                selectedIds.value = table.getSelectedRowModel().rows.map((r: any) => r.original.id)
            },
            ariaLabel: "Select row",
        }),
        enableSorting: false,
        enableHiding: false,
    }

    return {
        selectedIds,
        selectColumn,
    }
}
