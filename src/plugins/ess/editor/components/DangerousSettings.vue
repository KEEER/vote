<template>
  <div>
    <m-dialog class="new-question-dialog" :open="deleteOpen || renameOpen">
      <m-typo-headline :level="5" slot="header">{{$t('plugin.ess.settings.' + (deleteOpen ? 'deleteTitle' : 'renameTitle'))}}</m-typo-headline>
      <m-typo-body :level="1" slot="body">
        <p>{{$t('plugin.ess.settings.' + (deleteOpen ? 'deleteInstruction' : 'renameInstruction'), { routeId })}}</p>
        <m-text-field :id="`${uid}-id`" outlined v-model="id" :maxlength="maxlen" pattern="([a-zA-Z0-9]|-|_)*">
          <m-floating-label :for="`${uid}-id`">{{$t('plugin.ess.settings.' + (deleteOpen ? 'deleteConfirmId' : 'renameNewId'))}}</m-floating-label>
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
        :disabled="!id || id.length > maxlen || (deleteOpen && id !== routeId)"
      >{{$t('plugin.ess.editor.ok')}}</m-button>
    </m-dialog>
    <m-button @click="id = routeId, renameOpen = true">
      <m-icon slot="icon" icon="edit" />
      {{$t('plugin.ess.settings.rename')}}
    </m-button>
    <br />
    <m-button @click="id = '', deleteOpen = true">
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
      id: '',
      routeId: this.$route.params.id,
      maxlen: 63 - this.$route.params.uid.length,
    }
  },
  methods: {
    handleClick () {
      if (this.renameOpen) {
        const url = new URL('_rename', location)
        url.search = new URLSearchParams({ id: this.id })
        location = url
        return
      }
      if (this.deleteOpen) {
        location = '_delete'
        return
      }
    },
  },
}
</script>
