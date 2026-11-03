<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
const props = defineProps<{ open: boolean; title: string; drawer?: boolean }>();
const emit = defineEmits<{ close: [] }>();
const dialog = ref<HTMLDialogElement | null>(null);
const sync = async () => {
  await nextTick();
  if (props.open && !dialog.value?.open) dialog.value?.showModal();
  else if (!props.open && dialog.value?.open) dialog.value.close();
};
watch(() => props.open, sync);
onMounted(sync);
</script>
<template>
  <dialog
    ref="dialog"
    :class="['shop-dialog', { drawer }]"
    :aria-label="title"
    @cancel.prevent="emit('close')"
    @click="
      (event) => {
        if (event.target === event.currentTarget) emit('close');
      }
    "
  >
    <div class="dialog-heading">
      <span class="eyebrow">ATELIER No.8</span
      ><button
        class="icon-button"
        :aria-label="'Close ' + title"
        @click="emit('close')"
      >
        <ShopIcon name="close" />
      </button>
    </div>
    <slot />
  </dialog>
</template>
