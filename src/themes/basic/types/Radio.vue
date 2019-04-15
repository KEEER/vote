<template>
  <div>
    <h3>{{data.title}}</h3>
    <span v-for="option in data.options" :key="option.value">
      <input type="radio" v-model="value" :id="option.value" :value="option.value" />
      <label :for="option.value">{{option.label}}</label>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Radio',
  data() {
    return {value: this.data.value}
  },
  props: {
    data: {
      type: Object,
      validator(val) {
        return val.title && val.options && val.options.every(op => op.label && op.value)
      }
    },
  },
}
</script>
