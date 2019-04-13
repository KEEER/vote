<template>
  <div>
    <h3>{{data.title}}</h3>
    <input v-model="value" />
  </div>
</template>

<script>
export default {
  name: 'Textinput',
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
