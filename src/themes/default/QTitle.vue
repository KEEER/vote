<template>
  <m-typo-headline :level="5" class="question-title">
    {{ title }}
    <sup v-if="required" class="title-required">*</sup>
  </m-typo-headline>
</template>

<style scoped>
.question-title {
  display: block;
}
.title-required {
  color: red;
  user-select: none;
}
</style>

<script>
export default {
  name: 'QTitle',
  props: {
    title: {
      type: String,
      required: true,
    },
    required: Boolean,
  },
}
</script>
