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
  import { getConfig, questionMixin as mixin } from '@vote/api'
import { shuffle } from '../util'

export default {
  name: 'VRadio',
  mixins: [ mixin ],
  data () {
    return {
      options: getConfig(this.data, 'theme', 'randomOrder', false) ? shuffle(this.data.options) : this.data.options,
      getQuestionConfig: getConfig,
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
