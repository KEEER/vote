<template>
  <m-card class="question-card" :class="{ 'question-card__folded': folded }" :outlined="folded">
    <QuestionConfigDialog
      v-if="themeOpen"
      v-model="themeConfig_"
      :entries="themeConfigEntries"
      :open.sync="themeOpen"
    />
    <QuestionConfigDialog
      v-if="validationOpen"
      v-model="validationConfig_"
      :entries="validationEntries"
      :open.sync="validationOpen"
    />
    <div class="question" :class="{ 'is-data': isData, 'is-stats': isStats }" v-if="!folded">
      <div class="title-type" v-if="isEditor">
        <m-text-field
          outlined
          required
          v-model="title_"
          :id="`${uid}-title`"
          class="question-title"
        >
          <m-floating-label :for="`${uid}-title`">{{ $t('plugin.ess.question.title') }}</m-floating-label>
        </m-text-field>
        <TypeSelector v-model="type_" />
      </div>
      <div v-else class="question-title--display question-title--data">
        {{ title_ }}
        <sup v-if="required_" class="title-required"></sup>
      </div>
      <HTMLEditor
        class="description"
        ref="description"
        :data="description_"
        @change="logDescriptionChange"
        v-if="isEditor"
      />
      <div v-else-if="description_" v-html="description_.html || ''"></div>
      <component
        :is="questionTypes[data.type || 'VNull']"
        :route="route"
        v-model="value_"
        :options.sync="options_"
        :stats="stats"
      />
    </div>
    <template v-if="!folded && isEditor">
      <span slot="actionButtons">
        <m-icon class="handle" icon="drag_handle" />
      </span>
        <span slot="actionIcons" v-if="!folded && isEditor">
        {{ $t('plugin.ess.question.required') }}
        <m-switch v-model="required_" class="required-switch" />
        <span class="divider" />
        <m-menu-anchor>
          <m-icon-button @click="menuOpen = true" icon="more_vert" />
          <m-menu v-model="menuOpen">
            <m-list>
              <m-list-item v-for="(item, i) in menuItems" :key="i" @click="menuClick(i)">
                <m-icon :icon="item.icon" class="question-menu__icon" slot="graphic" />
                <template slot="text">{{ $t(item.label) }}</template>
              </m-list-item>
            </m-list>
          </m-menu>
        </m-menu-anchor>
        <m-dialog v-model="removeDialogOpen">
          <m-typo-headline :level="5" slot="header">{{ $t('plugin.ess.editor.removeQuestionTitle') }}</m-typo-headline>
          <m-typo-body :level="1" slot="body">{{ $t('plugin.ess.editor.removeQuestionDescription') }}</m-typo-body>
          <m-button class="mdc-dialog__button" data-mdc-dialog-action="Cancel" slot="cancelButton">{{ $t('plugin.ess.editor.cancel') }}</m-button>
          <m-button @click="remove" class="mdc-dialog__button" data-mdc-dialog-action="OK" slot="acceptButton">{{ $t('plugin.ess.editor.ok') }}</m-button>
        </m-dialog>
        <m-icon-button @click="fold" icon="keyboard_arrow_up" />
      </span>
    </template>
    <div class="folded" v-if="folded && isEditor">
      <m-icon class="handle handle--folded" icon="drag_handle" />
      <span class="question-title--display">{{ title_ }}</span>
      <m-icon-button class="fold-button" @click="unfold" v-if="folded" icon="keyboard_arrow_down" />
    </div>
  </m-card>
</template>

<style scoped>
.question {
  padding: 16px 16px 0 16px;
  display: flex;
  flex-direction: column;
}

.question.is-data, .question.is-stats { padding: 16px; }
.question-card { margin: 16px; }
.question-card__folded { margin: 8px 16px; }
.question-title { flex: auto; }
.question-title--data { margin-bottom: 8px; }

.title-type {
  display: flex;
  flex-direction: row;
}

.description { margin-bottom: 16px; }

@media(max-width: 720px) {
  .title-type { flex-direction: column; }
  .question-title { margin-bottom: 16px; }
}

.divider {
  border-left: 1px solid #e0e0e0;
  height: 32px;
  margin: 0 16px;
}

.required-switch { margin-left: 8px; }

.question-title--display {
  font-size: 1.2rem;
  font-weight: 300;
  flex: auto;
}

.folded {
  display: flex;
  flex-direction: row;
  padding: 4px;
  padding-left: 12px;
  align-items: center;
}

.handle { cursor: move; }

.handle--folded { padding: 0 8px 0 0; }

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
import questionTypes from './types'
import validationTypes from '../../common/validationTypes'
import TypeSelector from './TypeSelector.vue'
import { query } from '../../common/graphql'
import updateObservable from './updateObservable'
import HTMLEditor from './HTMLEditor.vue'
import QuestionConfigDialog from './QuestionConfigDialog.vue'
import hooks from '../hooks'

export default {
  name: 'Question',
  mixins: [
    updateObservable(async (vm, change) => {
      if (!vm.isEditor) return
      const desc = vm.folded ? vm.description_ : await vm.$refs.description.save()
      vm.description_ = desc
      if (desc && desc.html === '<br>') desc.html = ''
      /**
       * Question data update event.
       * @event editor:Question#update:data
       * @type {object}
       */
      vm.$emit('update:data', {
        ...vm.data,
        required: vm.required_,
        title: vm.title_,
        description: desc,
        value: vm.value_,
        options: vm.options_,
        type: vm.type_,
        config: { theme: vm.themeConfig_, validation: vm.validationConfig_ },
      })
      for (let i of [ 'value', 'options' ]) {
        change[i] = JSON.stringify(change[i])
      }
      if ('themeConfig' in change || 'validationConfig' in change) {
        change.config = JSON.stringify({
          theme: vm.themeConfig_,
          validation: vm.validationConfig_,
        })
        delete change.themeConfig
        delete change.validationConfig
      }
      if (change.description) change.description = JSON.stringify(desc)
      /**
       * Before update (sync) event.
       * @event editor:Question#beforeUpdate
       * @type {object}
       * @property {editor:Question} question the question itself
       * @property {object} changes made and prepared
       */
      vm.$emit('beforeUpdate', { question: vm, change })
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
      // TODO: update when type changes
      themeConfig_: (this.data.config || {}).theme || {},
      validationConfig_: (this.data.config || {}).validation || {},
      menuItems: [],
      removed: false,
      folded: false,
      menuOpen: false,
      themeOpen: false,
      validationOpen: false,
      removeDialogOpen: false,
      questionTypes,
      validationEntries: validationTypes[this.data.type] || [],
    }
  },
  components: {
    TypeSelector,
    HTMLEditor,
    QuestionConfigDialog,
    ...questionTypes,
  },
  provide () { return { Question: this } },
  props: {
    // TODO: check props
    data: Object,
    route: String,
    stats: {},
  },
  computed: {
    themeConfigEntries () {
      if (!this.hasThemeConfigEntries) return []
      const cfg = window.KVoteFormData.themeConfig
      const entries = cfg.provides.questionConfig[this.type_]
      /**
       * Preprocess theme config entries event.
       * @event editor:Question#preprocessThemeConfigEntries
       * @type {object}
       * @property {editor:Question} question Vue instance of the question itself
       * @property {object[]} entries question config entries.
       */
      this.$emit('preprocessThemeConfigEntries', { question: this, entries })
      return entries
    },
    hasThemeConfigEntries () {
      const cfg = window.KVoteFormData.themeConfig
      return 'provides' in cfg && 'questionConfig' in cfg.provides && this.type_ in cfg.provides.questionConfig
    },
    hasValidationEntries () {
      return this.validationEntries.length > 0
    },
    isEditor () { return this.route === 'editor' },
    isData () { return this.route === 'data' },
    isStats () { return this.route === 'stats' },
  },
  watch: {
    data () {
      this.title_ = this.data.title
      this.description_ = this.data.description
      this.value_ = this.data.value
      this.options_ = this.data.options
      this.type_ = this.data.type
      this.themeConfig_ = (this.data.config || {}).theme || {}
      this.validationConfig_ = (this.data.config || {}).validation || {}
    },
    type_ (val) {
      this.data.type = val
      if (val) {
        delete this.data.value
        this.value_ = null
        this.validationEntries = validationTypes[this.data.type] || []
        this.updateMenuItems()
        this.change.type = val
        this.logChange()
      }
      this.$emit('update:type', val)
    },
  },
  methods: {
    async fold () {
      await this.update()
      this.folded = true
    },
    unfold () { this.folded = false },
    async remove () {
      try {
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
      /**
       * Question removal event.
       * @event editor:Question#remove
       */
      this.$emit('remove')
      this.removed = true
    },
    reorder (reorder) {
      this.change.reorder = this.change.reorder || 0
      this.change.reorder += reorder
      if (this.change.reorder !== 0) {
        this.logChange()
        this.update()
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
    menuClick (i) {
      const handler = this.menuItems[i].handler
      if (typeof handler === 'function') handler(this)
    },
    updateMenuItems () {
      this.menuItems = [
        ...(this.hasValidationEntries ? [ {
          icon: 'done',
          label: 'plugin.ess.question.validation',
          handler: () => this.validationOpen = true,
        } ] : []),
        ...(this.hasThemeConfigEntries ? [ {
          icon: 'palette',
          label: 'plugin.ess.question.theme',
          handler: () => this.themeOpen = true,
        } ] : []),
        {
          icon: 'delete',
          label: 'plugin.ess.question.remove',
          handler: () => this.removeDialogOpen = true,
        },
      ]
      /**
       * Menu items update event.
       * @event editor:Question#update:menuItems
       */
      this.$emit('update:menuItems')
    },
  },
  mounted () {
    this.updateMenuItems()
    const thingsToWatch = [ 'title', 'value', 'options', 'themeConfig', 'validationConfig', 'required' ]
    for (const i of thingsToWatch) {
      this.$watch(`${i}_`, val => {
        this.change[i] = val
        this.logChange()
        this.$emit(`update:${i}`, val)
      })
    }
    /**
     * Editor Question component mounted event
     * @event editor.editor:questionMounted
     * @type {editor:Question}
     */
    hooks.emit('editor:questionMounted', this)
    this.$on('reorder', reorder => this.reorder(reorder))
  },
  beforeDestroy () {
    clearInterval(this.intervalId)
    if (this.changed) this.update()
  },
}
</script>
