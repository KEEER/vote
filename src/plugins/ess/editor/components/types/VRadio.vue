<template>
  <div>
    <template v-if="!isStats">
      <ul class="radio-ul">
        <div class="radio-controls" v-if="isEditor">
          <m-icon-button @click="add" icon="add" /><!--
      This is to prevent text (only spaces) being inserted into DOM, causing a divider
   --><m-icon-button @click="value_ = ''" icon="clear" />
        </div>
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
            <li class="radio-li"
                v-for="(option, i) in options_"
                :key="option.value"
            >
              <m-icon-button @click="remove(i)" icon="remove" />
              <m-radio
                :name="uid"
                v-model="value_"
                :value="option.value"
                :checked="value_ === option.value"
              />
              <m-text-field outlined :id="`${uid}-${i}`" v-model="option.label" class="label" @input="syncOptions">
                <m-floating-label :for="`${uid}-${i}`">{{$t('plugin.ess.question.labelPlaceholder')}}</m-floating-label>
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
              :value="option.value"
              :checked="String(value_) === option.value"
            />
            <span>{{option.label}}</span>
          </li>
        </div>
      </ul>
    </template>
    <v-chart class="vote-chart" v-else-if="stats" :options="chartOptions" />
    <m-typo-body v-else :level="1">{{$t('core.question.stats.unavailableForQuestion')}}</m-typo-body>
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
  props: {
    value: {},
    options: {},
    route: String,
    stats: {},
  },
  components: { draggable },
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
  watch: {
    value_ (val) { this.$emit('input', val) },
    value (val) { this.value_ = val },
    options (val) { this.options_ = val },
  },
}
</script>
