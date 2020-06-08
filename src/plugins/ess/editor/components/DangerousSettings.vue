<template>
  <div>
    <m-dialog :open="deleteOpen || renameOpen" @closed="deleteOpen = renameOpen = false">
      <m-typo-headline slot="header" :level="5" v-text="$t('plugin.ess.settings.' + (deleteOpen ? 'deleteTitle' : 'renameTitle'))" />
      <m-typo-body slot="body" :level="1">
        <p>{{ $t('plugin.ess.settings.' + (deleteOpen ? 'deleteInstruction' : 'renameInstruction'), { routeName }) }}</p>
        <m-text-field
          :id="`${uid}-id`"
          ref="textField"
          v-model="name"
          outlined
          :maxlength="maxlen"
          pattern="([a-zA-Z0-9]|-|_)*"
        >
          <m-floating-label :for="`${uid}-id`" v-text="$t('plugin.ess.settings.' + (deleteOpen ? 'deleteConfirmName' : 'renameNewName'))" />
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
    <m-typo-headline class="typo" :level="4" v-text="$t('plugin.ess.settings.rename')" />
    <m-typo-body class="typo" :level="1" v-text="$t('plugin.ess.settings.renameSummary')" />
    <m-button @click="name = routeName, renameOpen = true">
      <m-icon slot="icon" icon="edit" />
      {{ $t('plugin.ess.settings.rename') }}
    </m-button>
    <hr>
    <m-typo-headline class="typo" :level="4" v-text="$t('plugin.ess.settings.delete')" />
    <m-typo-body class="typo" :level="1" v-text="$t('plugin.ess.settings.deleteSummary')" />
    <m-button @click="name = '', deleteOpen = true">
      <m-icon slot="icon" icon="delete" />
      {{ $t('plugin.ess.settings.delete') }}
    </m-button>
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
export default {
  name: 'DangerousSettings',
  data () {
    return {
      renameOpen: false,
      deleteOpen: false,
      name: '',
      routeName: window.KVoteFormData.name,
      maxlen: 64,
    }
  },
  computed: {
    okDisabled () {
      return (
        !this.name
        || this.name.length > this.maxlen
        || (this.deleteOpen && this.name !== this.routeName)
        || !this.$refs.textField.mdcTextField.valid
      )
    },
  },
  methods: {
    handleClick () {
      if (this.renameOpen) {
        const url = new URL('_rename', location)
        url.search = new URLSearchParams({ name: this.name })
        location = url
        return
      }
      if (this.deleteOpen) {
        location = '_delete'
        return
      }
    },
    update () {},
  },
}
</script>
