<template>
  <div>
    <h3>{{data.title}}</h3>
    <textarea v-model="value" />
  </div>
</template>

<script>
export default {
  name: 'MultilineText',
  data() {
    return {value: this.data.value}
  },
  props: {
    data: {
      type: Object,
      validator(val) {
        return val.title
      }
    },
  },
}
</script>
