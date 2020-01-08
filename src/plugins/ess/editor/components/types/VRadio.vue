<template>
  <ul class="radio-ul">
    <div class="radio-controls" v-if="!readonly">
      <m-icon-button @click="add" icon="add" /><!--
      This is to prevent text (only spaces) being inserted into DOM, causing a divider
   --><m-icon-button @click="value_ = ''" icon="clear" />
    </div>
    <draggable
      v-if="!readonly"
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
          <m-icon-button @click="remove(i)" icon="remove" />
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
    <div v-else>
      <li class="radio-li"
        v-for="option in options_"
        :key="option.value"
      >
        <m-radio
          disabled
          :name="uid"
          v-model="value_"
          :value="option.value.toString()"
          :checked="String(value_) === option.value.toString()"
        />
        <span>{{option.label}}</span>
      </li>
    </div>
  </ul>
</template>

<style lang="scss">
@import '../../styles.scss';
@import 'material-components-vue/components/icon-button/styles';
@import 'material-components-vue/components/text-field/styles';
@import 'material-components-vue/components/radio/styles';
@import 'material-components-vue/components/floating-label/styles';
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
import MIconButton from 'material-components-vue/components/icon-button/'
import MIcon from 'material-components-vue/components/icon/'
import MRadio from 'material-components-vue/components/radio/'
import MTextField from 'material-components-vue/components/text-field/'
import MFormField from 'material-components-vue/components/form-field/'
import MFloatingLabel from 'material-components-vue/components/floating-label/'
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
    readonly: Boolean,
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
