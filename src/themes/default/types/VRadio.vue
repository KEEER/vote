<template>
  <div>
    <span
      class="radio"
      :class="{ multiline: getQuestionConfig(data, 'theme', 'multiline', true) }"
      v-for="option in options"
      :key="option.value"
    >
      <m-radio
        v-model="value_"
        :checked="value_ === option.value"
        :name="uid"
        :id="$id(option.value)"
        :value="option.value"
      />
      <label :for="$id(option.value)"><m-typo-body :level="1">{{option.label}}</m-typo-body></label>
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
import mixin from './mixin'
import { getQuestionConfig, shuffle } from '../util'

export default {
  name: 'VRadio',
  mixins: [ mixin ],
  data () {
    return {
      options: getQuestionConfig(this.data, 'theme', 'randomOrder', false) ? shuffle(this.data.options) : this.data.options,
      getQuestionConfig,
    }
  },
  props: {
    data: {
      type: Object,
      validator (val) {
        const e = x => typeof x !== 'undefined'
        return e(val.title) && e(val.options) && val.options.every(op => e(op.label) && e(op.value))
      },
    },
    value: String,
  },
}
</script>
