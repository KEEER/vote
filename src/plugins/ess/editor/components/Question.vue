<template>
  <m-card class="question-card">
    <div class="question" :class="{ readonly }" v-if="!folded">
      <div class="title-type" v-if="!readonly">
        <m-text-field
          outlined
          required
          v-model="title_"
          :id="`${uid}-title`"
          class="question-title"
        >
          <m-floating-label :for="`${uid}-title`">{{$t('plugin.ess.question.title')}}</m-floating-label>
        </m-text-field>
        <TypeSelector v-model="type_" />
      </div>
      <div v-else class="question-title--display question-title--readonly">
        {{title_}}
        <sup v-if="required_" class="title-required"></sup>
      </div>
      <HTMLEditor
        class="description"
        ref="description"
        :data="description_"
        @change="logDescriptionChange"
        v-if="!readonly"
      />
      <div v-else-if="description_" v-html="description_.html || ''"></div>
      <component
        :is="data.type || 'VNull'"
        :readonly="readonly"
        v-model="value_"
        :options.sync="options_"
      />
    </div>
    <span slot="actionButtons" v-if="!folded && !readonly">
      <m-icon class="handle" icon="drag_handle" />
    </span>
    <span slot="actionIcons" v-if="!folded && !readonly">
      {{$t('plugin.ess.question.required')}}
      <m-switch v-model="required_" class="required-switch" />
      <span class="divider" />
      <m-menu-anchor>
        <m-icon-button @click="menuOpen = true" icon="more_vert" />
        <m-menu v-model="menuOpen">
          <m-list>
            <m-list-item @click="themeOpen = true">
              <m-icon icon="palette" class="question-menu__icon" slot="graphic" />
              <template slot="text">{{$t('plugin.ess.question.theme')}}</template>
            </m-list-item>
            <m-list-item @click="remove">
              <m-icon icon="delete" class="question-menu__icon" slot="graphic" />
              <template slot="text">{{$t('plugin.ess.question.remove')}}</template>
            </m-list-item>
          </m-list>
        </m-menu>
      </m-menu-anchor>
      <m-icon-button @click="folded = true" icon="keyboard_arrow_up" />
    </span>
    <div class="folded" v-if="folded && !readonly">
      <m-icon class="handle handle--folded" icon="drag_handle" />
      <span class="question-title--display">{{title_}}</span>
      <m-icon-button class="fold-button" @click="folded = false" v-if="folded" icon="keyboard_arrow_down" />
    </div>
  </m-card>
</template>

<style lang="scss">
@import '../styles.scss';
@import 'material-components-vue/components/card/styles';
@import 'material-components-vue/components/text-field/styles';
@import 'material-components-vue/components/floating-label/styles';
@import 'material-components-vue/components/line-ripple/styles';
@import 'material-components-vue/components/icon-button/styles';
@import 'material-components-vue/components/switch/styles';
@import 'material-components-vue/components/menu/styles';
@import 'material-components-vue/components/list/styles';
</style>

<style scoped>
.question {
  padding: 16px 16px 0 16px;
  display: flex;
  flex-direction: column;
}

.question.readonly {
  padding: 16px;
}

.question-card {
  margin: 16px;
}

.question-title {
  flex: auto;
}

.question-title--readonly {
  margin-bottom: 8px;
}

.title-type {
  display: flex;
  flex-direction: row;
}

.description {
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

.title-required::before {
  content: '*';
  color: red;
}

.mdc-menu .mdc-list .question-menu__icon {
  color: rgba(0, 0, 0, 0.6);
  margin-right: 12px;
}
</style>

<style>
.question-title .mdc-text-field__input {
  font-size: 1.45rem;
  font-weight: 300;
}
</style>

<script>
import MCard from 'material-components-vue/components/card/'
import MTextField from 'material-components-vue/components/text-field/'
import MFloatingLabel from 'material-components-vue/components/floating-label/'
import MLineRipple from 'material-components-vue/components/line-ripple/'
import questionTypes from './types'
import TypeSelector from './TypeSelector.vue'
import MIcon from 'material-components-vue/components/icon/'
import MIconButton from 'material-components-vue/components/icon-button/'
import MSwitch from 'material-components-vue/components/switch/'
import MMenu from 'material-components-vue/components/menu/'
import MList from 'material-components-vue/components/list/'
import { query } from '../../common/graphql'
import updateObservable from './updateObservable'
import HTMLEditor from './HTMLEditor.vue'

;[
  MCard,
  MTextField,
  MFloatingLabel,
  MLineRipple,
  MIcon,
  MIconButton,
  MSwitch,
  MMenu,
  MList,
].forEach(component => Vue.use(component))

// TODO: to be decided: should we allow customizing question menu?

export default {
  name: 'Question',
  mixins: [
    updateObservable(async (vm, change) => {
      for (let i of [ 'value', 'options' ]) {
        change[i] = JSON.stringify(change[i])
      }
      if (change.description) {
        change.description = JSON.stringify(await vm.$refs.description.save())
      }
      const res = await query(`
        mutation UpdateQuestion($options: QuestionUpdateInput!) {
          updateQuestion(options: $options)
        }
      `.trim(), {
        options: {
          ...change,
          id: vm.data.id,
        },
      })
      if (res.errors || !res.data.updateQuestion) throw res
    }),
  ],
  data () {
    return {
      title_: this.data.title,
      value_: this.data.value,
      options_: this.data.options,
      type_: this.data.type,
      required_: this.data.required,
      description_: this.data.description,
      removed: false,
      folded: false,
      menuOpen: false,
      themeOpen: false, // TODO: API design
    }
  },
  components: {
    ...questionTypes,
    TypeSelector,
    HTMLEditor,
  },
  props: {
    // TODO: check props
    data: Object,
    readonly: { type: Boolean, required: false, default: false },
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
  },
  methods: {
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
        alert(this.$t('plugin.ess.editor.removeError'))
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
    logDescriptionChange () {
      this.change.description = true
      this.logChange()
    },
  },
  mounted () {
    this.$on('reorder', reorder => this.reorder(reorder))
  },
  beforeDestroy () {
    clearInterval(this.intervalId)
    if (this.changed) this.update()
  },
}
</script>
