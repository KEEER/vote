import VRadio from './types/VRadio'
import VCheckbox from './types/VCheckbox'
import VText from './types/VText'
import VTextarea from './types/VTextarea'
import VCombined from '@vote/api/VCombinedForm'

export const types = {
  VRadio,
  VCheckbox,
  VText,
  VTextarea,
  VCombined,
}
for (const k in types) Vue.component(k, types[k])
