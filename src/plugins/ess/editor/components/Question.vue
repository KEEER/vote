<template>
  <m-card class="question-card">
    <div class="question" v-if="!folded">
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
    </div>
    <span slot="actionButtons" v-if="!folded">
      <m-icon class="handle" icon="drag_handle" />
    </span>
    <span slot="actionIcons" v-if="!folded">
      <m-icon-button @click="remove">
        <m-icon icon="delete" />
      </m-icon-button>
      <span class="divider" />
      {{texts.question.required}}
      <m-switch v-model="required_" class="required-switch" />
      <span class="divider" />
      <m-icon-button @click="folded = true">
        <m-icon icon="keyboard_arrow_up" />
      </m-icon-button>
    </span>
    <div class="folded" v-if="folded">
      <m-icon class="handle handle--folded" icon="drag_handle" />
      <span class="question-title--display">{{title_}}</span>
      <m-icon-button class="fold-button" @click="folded = false" v-if="folded">
        <m-icon icon="keyboard_arrow_down" />
      </m-icon-button>
    </div>
  </m-card>
</template>

<style lang="scss">
@import '../styles.scss';
@import 'material-components-vue/dist/card/styles';
@import 'material-components-vue/dist/text-field/styles';
@import 'material-components-vue/dist/floating-label/styles';
@import 'material-components-vue/dist/line-ripple/styles';
@import 'material-components-vue/dist/icon-button/styles';
@import 'material-components-vue/dist/switch/styles';
</style>

<style scoped>
.question {
  padding: 16px 16px 0 16px;
  display: flex;
  flex-direction: column;
}

.question-card {
  margin: 16px;
}

.question-title {
  flex: auto;
}

.title-type {
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
}

@media(max-width: 720px) {
  .title-type {
    flex-direction: column;
  }

  .question-title {
    margin-bottom: 16px;
  }
}

.divider {
  border-left: 1px solid #e0e0e0;
  height: 32px;
  margin: 0 16px;
}

.required-switch {
  margin-left: 8px;
}

.question-title--display {
  font-size: 1.45rem;
  font-weight: 300;
  flex: auto;
}

.folded {
  display: flex;
  flex-direction: row;
  padding: 16px;
  align-items: center;
}

.handle--folded {
  padding: 0 8px 0 0;
  cursor: pointer;
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
import MIcon from 'material-components-vue/dist/icon/icon.min.js'
import MIconButton from 'material-components-vue/dist/icon-button/icon-button.min.js'
import MSwitch from 'material-components-vue/dist/switch/switch.min.js'
import { query } from '../../common/graphql'

;[
  MCard,
  MTextField,
  MFloatingLabel,
  MLineRipple,
  MIcon,
  MIconButton,
  MSwitch,
].forEach(component => Vue.use(component))

export default {
  name: 'Question',
  data () {
    return {
      title_: this.data.title,
      value_: this.data.value,
      options_: this.data.options,
      type_: this.data.type,
      required_: this.data.required,
      change: {},
      changed: false,
      lastChanged: +Date.now(),
      lastUpdated: +Date.now(),
      UPDATE_THRESHOLD: {
        // After data.UPDATE_THRESHOLD.NOT_CHANGED ms without change, update
        NOT_CHANGED: 2 * 1000, // 3 secs
        // After data.UPDATE_THRESHOLD.NOT_UPDATED ms without update, update
        NOT_UPDATED: 10 * 1000, // 10 secs
      },
      intervalId: -1,
      saveState: 'notChanged',
      removed: false,
      folded: false,
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
    isFirst: Boolean,
    isLast: Boolean,
  },
  watch: {
    data () {
      this.title_ = this.data.title
      this.value_ = this.data.value
      this.options_ = this.data.options
      this.type_ = this.data.type
    },
    title_ (val) {
      if (val) {
        this.change.title = val
        this.logChange()
      }
      this.$emit('update:title', val)
    },
    value_ (val) {
      this.change.value = val
      this.logChange()
      this.$emit('update:value', val)
    },
    options_ (val) {
      this.change.options = val
      this.logChange()
      this.$emit('update:options', val)
    },
    required_ (val) {
      this.change.required = val
      this.logChange()
      this.$emit('update:required', val)
    },
    type_ (val) {
      this.data.type = val
      if (val) {
        this.change.type = val
        this.logChange()
      }
      this.$emit('update:type', val)
    },
    saveState (val) {
      this.$emit('update:saveState', val)
    },
  },
  methods: {
    logChange () {
      this.changed = true
      this.lastChanged = +Date.now()
      this.saveState = 'awaitInputStop'
    },
    checkUpdate () {
      if (!this.changed) return
      if (this.lastChanged + this.UPDATE_THRESHOLD.NOT_CHANGED < +Date.now()) {
        return this.update()
      }
      if (this.lastUpdated + this.UPDATE_THRESHOLD.NOT_UPDATED < +Date.now()) {
        return this.update()
      }
    },
    async update () {
      // TODO: show update status to user
      if (!this.changed) return
      this.changed = false
      const change = this.change
      this.change = {}
      this.saveState = 'saving'
      try {
        for (let i of [ 'value', 'options' ]) {
          change[i] = JSON.stringify(change[i])
        }
        const res = await query(`
          mutation UpdateQuestion($options: QuestionUpdateInput!) {
            updateQuestion(options: $options)
          }
        `.trim(), {
          options: {
            ...change,
            id: this.data.id,
          },
        })
        if (res.errors || !res.data.updateQuestion) throw res
      } catch (e) {
        this.saveState = 'error'
        alert(this.texts.updateError)
        console.log('update error', e.stack)
        return
      }
      if (!this.changed) this.saveState = 'saved'
      this.lastUpdated = +Date.now()
    },
    async remove () {
      try {
        // TODO: prompt before removal
        const res = await query(`
          mutation RemoveQuestion($id: Int!) {
            removeQuestion(id: $id)
          }
        `.trim(), {
          id: this.data.id,
        })
        if (res.errors || !res.data.removeQuestion) throw res
      } catch (e) {
        alert(this.texts.removeError)
        console.log('remove error', e.stack)
        return
      }
      this.$emit('remove')
      this.removed = true
    },
    reorder (reorder) {
      this.change.reorder = this.change.reorder || 0
      this.change.reorder += reorder
      if (this.change.reorder !== 0) {
        this.logChange()
      } else {
        // remove log of reordering
        delete this.change.reorder
        if ([ ...Object.keys(this.change) ].length === 0) {
          this.changed = false
        }
      }
    },
  },
  mounted () {
    this.intervalId = setInterval(() => this.checkUpdate(), 500)
    this.$on('reorder', reorder => this.reorder(reorder))
  },
  beforeDestroy () {
    clearInterval(this.intervalId)
    if (this.changed) this.update()
  },
}
</script>
