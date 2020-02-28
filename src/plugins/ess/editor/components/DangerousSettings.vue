<template>
  <div>
    <m-dialog class="new-question-dialog" :open="deleteOpen || renameOpen" @closed="deleteOpen = renameOpen = false">
      <m-typo-headline :level="5" slot="header">{{$t('plugin.ess.settings.' + (deleteOpen ? 'deleteTitle' : 'renameTitle'))}}</m-typo-headline>
      <m-typo-body :level="1" slot="body">
        <p>{{$t('plugin.ess.settings.' + (deleteOpen ? 'deleteInstruction' : 'renameInstruction'), { routeName })}}</p>
        <m-text-field
          ref="textField"
          :id="`${uid}-id`"
          outlined
          v-model="name"
          :maxlength="maxlen"
          pattern="([a-zA-Z0-9]|-|_)*"
        >
          <m-floating-label :for="`${uid}-id`">{{$t('plugin.ess.settings.' + (deleteOpen ? 'deleteConfirmName' : 'renameNewName'))}}</m-floating-label>
        </m-text-field>
      </m-typo-body>
      <m-button
        class="mdc-dialog__button"
        data-mdc-dialog-action="Cancel"
        slot="cancelButton"
      >{{$t('plugin.ess.editor.cancel')}}</m-button>
      <m-button
        class="mdc-dialog__button"
        data-mdc-dialog-action="OK"
        slot="acceptButton"
        @click="handleClick"
        :disabled="okDisabled"
      >{{$t('plugin.ess.editor.ok')}}</m-button>
    </m-dialog>
    <m-button @click="name = routeName, renameOpen = true">
      <m-icon slot="icon" icon="edit" />
      {{$t('plugin.ess.settings.rename')}}
    </m-button>
    <br />
    <m-button @click="name = '', deleteOpen = true">
      <m-icon slot="icon" icon="delete" />
      {{$t('plugin.ess.settings.delete')}}
    </m-button>
  </div>
</template>

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
