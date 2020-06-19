import VCheckbox from './VCheckbox.vue'
import VCombined from './VCombined.vue'
import VNull from './VNull.vue'
import VRadio from './VRadio.vue'
import VText from './VText.vue'
import VTextarea from './VTextarea.vue'

const types = {
  VCheckbox,
  VCombined,
  VNull,
  VRadio,
  VText,
  VTextarea,
}
for (const type in types) Vue.component(type, types[type])

export default types
