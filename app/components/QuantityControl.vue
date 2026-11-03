<script setup lang="ts">
const quantity = defineModel<number>({ required: true });
defineProps<{ max: number; label: string }>();
</script>
<template>
  <div class="quantity-control">
    <button
      :aria-label="'Decrease ' + label"
      :disabled="quantity <= 1"
      @click="quantity--"
    >
      −</button
    ><output
      :aria-label="
        label === 'quantity' ? 'Selected quantity' : 'Quantity of ' + label
      "
      >{{ quantity }}</output
    ><button
      :aria-label="'Increase ' + label"
      :disabled="quantity >= max"
      @click="quantity++"
    >
      +
    </button>
  </div>
</template>
