<template>
  <m-card class="question">
    <div class="title-type">
      <m-text-field
        outlined
        required
        v-model="title_"
        :id="`${uid}-title`"
        class="question-title"
      >
        <m-floating-label :for="`${uid}-title`">{{texts.question.title}}</m-floating-label>
        <m-line-ripple slot="bottomLine" />
      </m-text-field>
      <TypeSelector v-model="type_" :texts="texts" />
    </div>
    <component
      :is="data.type || 'VNull'"
      v-model="value_"
      :options.sync="options_"
      :texts="texts"
    />
  </m-card>
</template>

<style lang="scss">
@import '../styles.scss';
@import 'material-components-vue/dist/card/styles';
@import 'material-components-vue/dist/text-field/styles';
@import 'material-components-vue/dist/floating-label/styles';
@import 'material-components-vue/dist/line-ripple/styles';
</style>

<style scoped>
.question {
  padding: 16px;
  margin: 16px;
}

.question-title {
  flex: auto;
}

/* TODO: mobile display */
.title-type {
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
}
</style>

<style>
.question-title .mdc-text-field__input {
  font-size: 1.45rem;
  font-weight: 300;
}
</style>

<script>
import MCard from 'material-components-vue/dist/card/card.min.js'
import MTextField from 'material-components-vue/dist/text-field/text-field.min.js'
import MFloatingLabel from 'material-components-vue/dist/floating-label/floating-label.min.js'
import MLineRipple from 'material-components-vue/dist/line-ripple/line-ripple.min.js'
import questionTypes from './types'
import TypeSelector from './TypeSelector.vue'
import {query} from '../../common/graphql'

;import { setInterval } from 'timers';
[MCard,
  MTextField,
  MFloatingLabel,
  MLineRipple,
].forEach(component => Vue.use(component))

export default {
  name: 'Question',
  data() {
    return {
      title_: this.data.title,
      value_: this.data.value,
      options_: this.data.options,
      type_: this.data.type,
      change: {},
      changed: false,
      lastChanged: +Date.now(),
      lastUpdated: +Date.now(),
      UPDATE_THRESHOLD: {
        // After data.UPDATE_THRESHOLD.NOT_CHANGED ms without change, update
        NOT_CHANGED: 4 * 1000, // 4 secs
        // After data.UPDATE_THRESHOLD.NOT_UPDATED ms without update, update
        NOT_UPDATED: 10 * 1000, // 10 secs
      },
    }
  },
  components: {
    ...questionTypes,
    TypeSelector,
  },
  props: {
    // TODO: check props
    data: Object,
    texts: Object,
  },
  watch: {
    data() {
      this.title_ = this.data.title
      this.value_ = this.data.value
      this.options_ = this.data.options
      this.type_ = this.data.type
    },
    title_(val) {
      this.change.title = val
      this.resetChangeTime()
      this.$emit('update:title', val)
    },
    value_(val) {
      this.change.value = val
      this.resetChangeTime()
      this.$emit('update:value', val)
    },
    options_(val) {
      this.change.option = val
      this.resetChangeTime()
      this.$emit('update:options', val)
    },
    type_(val) {
      this.data.type = this.change.type = val
      this.resetChangeTime()
      this.$emit('update:type', val)
    },
  },
  methods: {
    resetChangeTime() {
      this.changed = true
      this.lastChanged = +Date.now()
    },
    checkUpdate() {
      if(!this.changed) return
      if(this.lastChanged + this.UPDATE_THRESHOLD.NOT_CHANGED < +Date.now()) {
        return this.update()
      }
      if(this.lastUpdated + this.UPDATE_THRESHOLD.NOT_UPDATED < +Date.now()) {
        return this.update()
      }
    },
    async update() {
      // TODO: show update status to user
      try {
        const res = await query(`
          mutation UpdateQuestion($options: QuestionUpdateInput!) {
            updateQuestion(options: $options)
          }
        `.trim(), {
          options: {
            ...this.change,
            id: this.data.id,
          },
        })
        if(res.errors || !res.data.updateQuestion) throw res
      } catch(e) {
        alert(this.texts.updateError)
        console.log('update error', e.stack)
        return
      }
      this.lastUpdated = +Date.now()
      this.changed = false
    },
  },
  mounted() {
    setInterval(() => this.checkUpdate(), 500)
  },
}
</script>
