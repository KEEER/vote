<template>
  <div>
    <m-dialog :open="deleteOpen" @closed="deleteOpen = false">
      <m-typo-headline slot="header" :level="5">
        分支问题
      </m-typo-headline>
      <m-typo-body slot="body" :level="1">
        <p> 输入该问题所在的分支 </p>
        <m-text-field
          :id="`${uid}`"
          ref="textField"
          v-model="branch"
          outlined
          :maxlength="maxlen"
          pattern="([a-zA-Z0-9]|-|_)*"
        >
          <m-floating-label :for="`${uid}-id`">
            所在的分支
          </m-floating-label>
        </m-text-field>
        <hr>
        <p> 输入每一选项对应的分支 </p>
        <m-text-field
          v-for="option in questionEditing.options"
          :id="`${uid}-${option.value}`"
          :key="option.value"
          ref="textField"
          v-model="branches[option_value]"
          outlined
          :maxlength="maxlen"
          pattern="([a-zA-Z0-9]|-|_)*"
          @model="syncConfig"
        >
          <m-floating-label :for="`${uid}-id`">
            触发的分支
          </m-floating-label>
        </m-text-field>
      </m-typo-body>
      <m-button
        slot="cancelButton"
        class="mdc-dialog__button"
        data-mdc-dialog-action="Cancel"
        v-text="$t('plugin.ess.editor.cancel')"
      />
      <m-button
        slot="acceptButton"
        class="mdc-dialog__button"
        data-mdc-dialog-action="OK"
        :disabled="okDisabled"
        @click="handleClick"
        v-text="$t('plugin.ess.editor.ok')"
      />
    </m-dialog>
  </div>
</template>

<style scoped>
.typo {
  display: block;
  margin: 8px 0;
}
hr {
  height: 0;
  color: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, .12);
  width: 100%;
}
</style>

<script>
import { setConfig } from '@vote/api'

export default {
  name: 'BranchQuestionEditor',
  data () {
    return {
      deleteOpen: false,
      branches: [],
      routeName: window.KVoteFormData.name,
      maxlen: 64,
      questionEditing: null,
      branch: '',
    }
  },
  computed: {
    okDisabled () {
      return false
    },
  },
  methods: {
    handleClick () {
      return
    },
    update () {},
    syncConfig () {
      for (option of questionEditing.options) {
        this.questionEditing.setConfig('branch', 'branches', this.branches)
      }
    },
  },
}
</script>
