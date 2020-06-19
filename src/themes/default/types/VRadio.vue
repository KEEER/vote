<template>
  <div>
    <span
      v-for="option in options"
      :key="option.value"
      class="radio"
      :class="{ multiline: getQuestionConfig(data, 'theme', 'multiline', true) }"
    >
      <m-radio
        :id="$id(option.value)"
        v-model="value_"
        :checked="value_ === option.value"
        :name="uid"
        :value="option.value"
      />
      <label :for="$id(option.value)"><m-typo-body :level="1" v-text="option.label" /></label>
    </span>
  </div>
</template>

<style scoped>
.radio {
  display: inline-flex;
  align-items: center;
}
.radio.multiline { display: flex; }
</style>

<script>
import { getConfig, questionMixin as mixin, shuffle } from '@vote/api'

export default {
  name: 'VRadio',
  mixins: [ mixin ],
  props: {
    data: {
      type: Object,
      validator (val) {
        const e = x => typeof x !== 'undefined'
        return e(val.options) && val.options.every(op => e(op.label) && e(op.value))
      },
      required: true,
    },
    value: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      options: getConfig(this.data, 'theme', 'randomOrder', false) ? shuffle(this.data.options) : this.data.options,
      getQuestionConfig: getConfig,
    }
  },
}
</script>
