<template>
  <div>
    <template v-if="!isStats">
      <ul class="checkbox-ul">
        <m-icon-button v-if="isEditor" @click="add" icon="add"/>
        <draggable
          v-if="isEditor"
          v-model="options_"
          @start="dragging = true"
          @end="syncOptions"
          :animation="200"
          handle=".handle"
          ghost-class="ghost"
        >
          <transition-group type="transition" :name="!dragging ? 'flip-list' : null">
            <VCheckboxInput
              :route="route"
              v-for="(option, i) in options_"
              :key="option.value"
              :label.sync="option.label"
              @update:label="syncOptions"
              @remove="remove(i)"
              :cbvalue="option.value"
              :value.sync="value_[option.value]"
              @update:value="syncValue"
            />
          </transition-group>
        </draggable>
        <div v-else>
          <VCheckboxInput
            :route="route"
            v-for="option in options_"
            :key="option.value"
            :label="option.label"
            :cbvalue="option.value"
            :value="value_[option.value]"
          />
        </div>
      </ul>
    </template>
    <v-chart class="vote-chart" v-else-if="stats" :options="chartOptions" />
    <m-typo-body v-else :level="1">{{ $t('core.question.stats.unavailableForQuestion') }}</m-typo-body>
  </div>
</template>

<style scoped>
.checkbox-ul {
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.ghost {
  opacity: 0.5;
}
</style>

<script>
import VCheckboxInput from './VCheckboxInput'
import draggable from 'vuedraggable'

export default {
  name: 'VCheckbox',
  props: {
    value: Object,
    options: {},
    route: String,
    stats: {},
  },
  components: {
    VCheckboxInput,
    draggable,
  },
  data () {
    return {
      value_: this.value || {},
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
        xAxis: { data: this.options.map(o => o.label) },
        yAxis: {},
        tooltip: {},
        series: [ {
          type: 'bar',
          data: this.options.map(o => this.stats[o.value]),
        } ],
      }
    },
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
    syncValue () { this.$emit('input', { ...this.value_ }) },
  },
  watch: {
    value_ (val) { this.$emit('input', val) },
    value (val) { this.value_ = val },
    options (val) { this.options_ = val },
  },
}
</script>
