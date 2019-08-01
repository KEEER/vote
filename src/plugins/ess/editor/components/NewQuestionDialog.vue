<template>
  <m-dialog class="new-question-dialog" v-model="open_" scrollable>
    <m-typo-headline :level="5" slot="header">{{texts.new}}</m-typo-headline>
    <m-typo-body :level="1" slot="body">
      <m-select
        id="new-question-type"
        class="new-question-dialog-option"
        required
        outlined
        enhanced
        v-model="data.type"
      >
        <m-list-item
          v-for="(name, value) in questionTypes"
          :key="value"
          :data-value="value"
          aria-selected="false"
        >{{name}}</m-list-item>
        <m-floating-label
          for="new-question-type"
          id="new-question-type-label"
          slot="label"
        >{{texts.newQuestionType}}</m-floating-label>
      </m-select>
      <m-text-field
        id="new-question-title"
        class="new-question-dialog-option"
        outlined
        required
        v-model="data.title"
      >
        <m-floating-label for="new-question-title">{{texts.newQuestionTitle}}</m-floating-label>
      </m-text-field>
      <m-form-field class="new-question-dialog-option">
        <m-checkbox id="new-question-required" v-model="data.required" />
        <label for="new-question-required">{{texts.newQuestionRequired}}</label>
      </m-form-field>
    </m-typo-body>
    <m-button
      class="mdc-dialog__button"
      data-mdc-dialog-action="Cancel"
      slot="cancelButton"
    >{{texts.cancel}}</m-button>
    <m-button
      unelevated
      class="mdc-dialog__button"
      data-mdc-dialog-action="OK"
      slot="acceptButton"
      @click="$emit('newQuestion')"
    >{{texts.ok}}</m-button>
  </m-dialog>
</template>

<style lang="scss">
@import '../styles.scss';
@import 'material-components-vue/dist/dialog/styles';
@import 'material-components-vue/dist/typography/styles';
@import 'material-components-vue/dist/select/styles';
@import 'material-components-vue/dist/text-field/styles';
@import 'material-components-vue/dist/checkbox/styles';
@import 'material-components-vue/dist/floating-label/styles';
@import 'material-components-vue/dist/list/styles';
</style>

<style scoped>
.new-question-dialog-option {
  display: flex;
  margin-top: 10px;
  align-items: center;
}
</style>

<script>
import MButton from 'material-components-vue/dist/button/button.min.js'
import MDialog from 'material-components-vue/dist/dialog/dialog.min.js'
import MTypo from 'material-components-vue/dist/typography/typography.min.js'
import MSelect from 'material-components-vue/dist/select/select.min.js'
import MTextField from 'material-components-vue/dist/text-field/text-field.min.js'
import MCheckbox from 'material-components-vue/dist/checkbox/checkbox.min.js'
import MFloatingLabel from 'material-components-vue/dist/floating-label/floating-label.min.js'
import MFormField from 'material-components-vue/dist/form-field/form-field.min.js'
import MList from 'material-components-vue/dist/list/list.min.js'
import {types as questionTypes} from '../../../../question'

;[
  MButton,
  MDialog,
  MTypo,
  MSelect,
  MFloatingLabel,
  MFormField,
  MList,
  MTextField,
].forEach(component => Vue.use(component))

export default {
  name: 'NewQuestionDialog',
  data() {
    return {
      data: {
        type: null,
        title: null,
        required: false,
      // TODO: figure out `options` for VCheckbox and VRadio
      },
      open_: false,
      questionTypes,
    }
  },
  props: {
    open: Boolean,
    texts: Object,
  },
  watch: {
    open_(v) {
      this.$emit('update:open', v)
    },
    open(v) {
      this.open_ = v
    }
  },
}
</script>
