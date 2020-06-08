<template>
  <div>
    <template v-if="!isStats">
      <ul class="radio-ul">
        <div v-if="isEditor" class="radio-controls">
          <m-icon-button icon="add" @click="add" /><!--
      This is to prevent text (only spaces) being inserted into DOM, causing a divider
   --><m-icon-button icon="clear" @click="value_ = ''" />
        </div>
        <draggable
          v-if="isEditor"
          v-model="options_"
          :animation="200"
          handle=".handle"
          ghost-class="ghost"
          @start="dragging = true"
          @end="syncOptions"
        >
          <transition-group type="transition" :name="!dragging ? 'flip-list' : null">
            <li
              v-for="(option, i) in options_"
              :key="option.value"
              class="radio-li"
            >
              <m-icon-button icon="remove" @click="remove(i)" />
              <m-radio
                v-model="value_"
                :name="uid"
                :value="option.value"
                :checked="value_ === option.value"
              />
              <m-text-field :id="`${uid}-${i}`" v-model="option.label" outlined class="label" @input="syncOptions">
                <m-floating-label :for="`${uid}-${i}`" v-text="$t('plugin.ess.question.labelPlaceholder')" />
              </m-text-field>
              <m-icon icon="drag_handle" class="handle" />
            </li>
          </transition-group>
        </draggable>
        <div v-else>
          <li
            v-for="option in options_"
            :key="option.value"
            class="radio-li"
          >
            <m-radio
              v-model="value_"
              disabled
              :name="uid"
              :value="option.value"
              :checked="String(value_) === option.value"
            />
            <span v-text="option.label" />
          </li>
        </div>
      </ul>
    </template>
    <v-chart v-else-if="stats" class="vote-chart" :options="chartOptions" />
    <m-typo-body v-else :level="1" v-text="$t('core.question.stats.unavailableForQuestion')" />
  </div>
</template>

<style scoped>
.radio-ul {
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.ghost { opacity: 0.5; }

.radio-li {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 6px 0;
}
.label { flex: auto; }

.handle {
  padding: 12px;
  cursor: move;
}
</style>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'VRadio',
  components: { draggable },
  props: {
    value: {},
    options: {},
    route: String,
    stats: {},
  },
  data () {
    return {
      value_: this.value || null,
      options_: this.options,
      dragging: false,
    }
  },
  computed: {
    isEditor () { return this.route === 'editor' },
    isStats () { return this.route === 'stats' },
    chartOptions () {
      if (!this.isStats) return null
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
        },
        series: [ {
          type: 'pie',
          data: this.options.map(({ label, value }) => ({ name: label, value: this.stats[value] })),
        } ],
      }
    },
  },
  watch: {
    value_ (val) { this.$emit('input', val) },
    value (val) { this.value_ = val },
    options (val) { this.options_ = val },
  },
  methods: {
    add () {
      this.options_ = this.options_ || []
      const value = String(this.options_.map(o => o.value).reduce((a, b) => Math.max(Number(a), Number(b)), -1) + 1)
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
    syncOptions () { this.$emit('update:options', [ ...this.options_ ]) },
  },
}
</script>
