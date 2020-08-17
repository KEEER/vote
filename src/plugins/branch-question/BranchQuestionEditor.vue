<template>
  <div>
    <m-dialog v-model="open" @closed="questionEditing = null; branch = ''; branches = []">
      <m-typo-headline slot="header" :level="5">
        分支问题
      </m-typo-headline>
      <m-typo-body v-if="questionEditing" slot="body" :level="1">
        <p>输入该问题所在的分支</p>
        <m-text-field :id="`${uid}`" v-model="branch" outlined>
          <m-floating-label :for="`${uid}-id`">
            所在的分支
          </m-floating-label>
        </m-text-field>
        <template v-if="questionEditing.type === 'VRadio'">
          <hr>
          <p>输入每一选项对应的分支</p>
          <div v-for="option in questionEditing.options" :key="option.value">
            {{ option.label }}:
            <m-text-field
              :id="`${uid}-${option.value}`"
              v-model="branches[option.value]"
              outlined
              @model="syncConfig"
            >
              <m-floating-label :for="`${uid}-id`">
                触发的分支
              </m-floating-label>
            </m-text-field>
          </div>
        </template>
      </m-typo-body>
      <m-button
        slot="acceptButton"
        class="mdc-dialog__button"
        data-mdc-dialog-action="OK"
        @click="handleClick"
        v-text="$t('plugin.ess.editor.ok')"
      />
    </m-dialog>
  </div>
</template>

<style scoped>
hr {
  height: 0;
  color: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, .12);
  width: 100%;
}
</style>

<script>
export default {
  name: 'BranchQuestionEditor',
  data () {
    return {
      open: false,
      branches: [],
      maxlen: 64,
      questionEditing: null,
      branch: '',
    }
  },
  watch: {
    branch (val) { this.questionEditing && this.questionEditing.setConfig('branch', 'at-branch', val) },
    questionEditing (q) {
      if (q) {
        this.branch = q.getConfig('branch', 'at-branch', '')
        this.branches = q.getConfig('branch', 'branches', [])
      }
    },
  },
  methods: {
    handleClick () {
      return
    },
    update () {},
    syncConfig () {
      this.questionEditing.setConfig('branch', 'branches', this.branches)
    },
  },
}
</script>
