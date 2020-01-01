<template>
  <ul class="radio-ul">
    <div class="radio-controls">
      <m-icon-button @click="add">
        <m-icon icon="add" />
      </m-icon-button><!-- This is to prevent text (only spaces) being inserted into DOM, causing a divider
   --><m-icon-button @click="value_ = ''">
        <m-icon icon="clear" />
      </m-icon-button>
    </div>
    <draggable
      v-model="options_"
      @start="dragging = true"
      @end="syncOptions"
      :animation="200"
      handle=".handle"
      ghost-class="ghost"
    >
      <transition-group type="transition" :name="!dragging ? 'flip-list' : null">
        <li class="radio-li"
          v-for="(option, i) in options_"
          :key="option.value"
        >
          <m-icon-button @click="remove(i)">
            <m-icon icon="remove" />
          </m-icon-button>
          <m-radio
            :name="uid"
            v-model="value_"
            :value="option.value.toString()"
            :checked="value_ === option.value.toString()"
          />
          <m-text-field outlined :id="`${uid}-${i}`" v-model="option.label" class="label">
            <m-floating-label :for="`${uid}-${i}`" @input="syncOptions">{{texts.question.labelPlaceholder}}</m-floating-label>
          </m-text-field>
          <m-icon icon="drag_handle" class="handle" />
        </li>
      </transition-group>
    </draggable>
  </ul>
</template>

<style lang="scss">
@import '../../styles.scss';
@import 'material-components-vue/dist/icon-button/styles';
@import 'material-components-vue/dist/text-field/styles';
@import 'material-components-vue/dist/radio/styles';
@import 'material-components-vue/dist/floating-label/styles';
</style>

<style scoped>
.radio-ul {
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.ghost {
  opacity: 0.5;
}

.radio-li {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 6px 0;
}

.label {
  flex: auto;
}

.handle {
  padding: 12px;
}
</style>

<script>
import MIconButton from 'material-components-vue/dist/icon-button/icon-button.min.js'
import MIcon from 'material-components-vue/dist/icon/icon.min.js'
import MRadio from 'material-components-vue/dist/radio/radio.min.js'
import MTextField from 'material-components-vue/dist/text-field/text-field.min.js'
import MFormField from 'material-components-vue/dist/form-field/form-field.min.js'
import MFloatingLabel from 'material-components-vue/dist/floating-label/floating-label.min.js'
import draggable from 'vuedraggable'

;[
  MIconButton,
  MIcon,
  MRadio,
  MTextField,
  MFormField,
  MFloatingLabel,
].forEach(component => Vue.use(component))

export default {
  name: 'VRadio',
  props: {
    value: {},
    options: {},
    texts: Object,
  },
  components: {
    draggable,
  },
  data () {
    return {
      value_: this.value || null,
      options_: this.options,
      dragging: false,
    }
  },
  methods: {
    add () {
      this.options_ = this.options_ || []
      const value = this.options_.map(o => o.value).reduce((a, b) => Math.max(a, b), -1) + 1
      this.options_.push({
        label: '',
        value,
      })
      this.syncOptions()
    },
    remove (index) {
      this.options_.splice(index, 1)
      this.syncOptions()
    },
    syncOptions () {
      this.$emit('update:options', [ ...this.options_ ])
    },
  },
  watch: {
    value_ (val) {
      this.$emit('input', val)
    },
    value (val) {
      this.value_ = val
    },
    options (val) {
      this.options_ = val
    },
  },
}
</script>