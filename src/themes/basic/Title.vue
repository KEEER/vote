<template>
  <h3>{{title}}<sup v-if="required" class="title-required">*</sup></h3>
</template>

<style>
.title-required {
  color: red;
  user-select: none;
}
</style>

<script>
export default {
  name: 'QTitle',
  props: {
    title: String,
    required: Boolean,
  },
}
</script>
