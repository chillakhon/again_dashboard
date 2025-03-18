import {h, ref} from 'vue';
import {Checkbox} from '@/components/ui/checkbox';

export const funcTableVue = async () => {

  function useSelectColumn(selectedIds, data) {
    return {
      id: 'select',
      header: () =>
        h(Checkbox, {
          modelValue: selectedIds.value.length === data.value.length,
          'onUpdate:modelValue': (value) => {
            if (value) {
              selectedIds.value = data.value.map((item) => item.id);
            } else {
              selectedIds.value = [];
            }
          },
          ariaLabel: 'Select all',
        }),
      cell: ({row}) =>
        h(Checkbox, {
          modelValue: selectedIds.value.includes(row.original.id),
          'onUpdate:modelValue': (value) => {
            if (value) {
              selectedIds.value = [...selectedIds.value, row.original.id];
            } else {
              selectedIds.value = selectedIds.value.filter((id) => id !== row.original.id);
            }
          },
          ariaLabel: 'Select row',
        }),
      enableSorting: false,
      enableHiding: false,
    };
  }

  return {
    useSelectColumn,
  };
};
