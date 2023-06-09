<template>
  <div class="data-navigator">
    <m-icon-button :disabled="prevDisabled" icon="chevron_left" @click="prev" />
    <span v-if="count > 0" class="data-count">
      <span class="data-index"><m-text-field
        v-model="currentPlusOne"
        outlined
        type="number"
        min="1"
        :max="count"
        step="1"
      /></span> / {{ count }} {{ $t(countLabel) }}
      <m-icon-button v-if="allowAdd" icon="add" @click="$emit('add')" />
      <m-menu-anchor v-if="$slots.menu">
        <m-icon-button icon="more_vert" @click="menuOpen = true" />
        <m-menu v-model="menuOpen">
          <slot name="menu" />
        </m-menu>
      </m-menu-anchor>
    </span>
    <span v-else class="no-data" v-text="$t(nullLabel)" />
    <m-icon-button :disabled="nextDisabled" icon="chevron_right" @click="next" />
  </div>
</template>

<style scoped>
.data-navigator {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

.data-count {
  display: flex;
  align-items: center;
}

.data-index {
  margin-right: 8px;
}
</style>

<style>
.data-index > .mdc-text-field {
  width: 90px;
}
</style>

<script>
export default {
  name: 'DataNavigator',
  props: {
    count: Number,
    current: Number,
    countLabel: String,
    nullLabel: String,
    allowAdd: Boolean,
    beforeUpdate: {},
  },
  data () {
    return {
      current_: this.current || 0,
      currentPlusOne: String((this.current || 0) + 1),
      menuOpen: false,
    }
  },
  computed: {
    prevDisabled () {
      return this.count === 0 || this.current_ === 0
    },
    nextDisabled () {
      return this.count === 0 || this.current_ === this.count - 1
    },
  },
  watch: {
    current (val) { this.current_ = val },
    current_ (val) {
      /**
       * Current page update event.
       * @event editor:DataNavigator#update:current
       * @type {number}
       */
      this.$emit('update:current', val)
      this.currentPlusOne = String(val + 1)
    },
    currentPlusOne (val) {
      const num = Number(val)
      if (num !== Math.floor(val) || num < 1 || num > this.count) return
      this.current_ = num - 1
    },
  },
  methods: {
    async prev () {
      if (this.prevDisabled) return
      if (this.beforeUpdate) await this.beforeUpdate()
      this.current_--
    },
    async next () {
      if (this.nextSubmissionDisabled) return
      if (this.beforeUpdate) await this.beforeUpdate()
      this.current_++
    },
  },
}
</script>
