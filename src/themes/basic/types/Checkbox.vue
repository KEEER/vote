<template>
  <div>
    <h3>{{data.title}}</h3>
    <span v-for="option in data.options">
      <input type="checkbox" v-model="value[option.value]" :id="option.value" :value="option.value" />
      <label :for="option.value">{{option.label}}</label>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Checkbox',
  data() {
    return {value: this.data.value || {}}
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
