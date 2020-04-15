import VCheckbox from './types/VCheckbox'
import VCombined from '@vote/api/VCombinedForm'
import VRadio from './types/VRadio'
import VText from './types/VText'
import VTextarea from './types/VTextarea'

export const types = {
  VCheckbox,
  VCombined,
  VRadio,
  VText,
  VTextarea,
}
for (const k in types) Vue.component(k, types[k])
