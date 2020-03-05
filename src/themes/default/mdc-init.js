import './styles.scss'

// Please keep these in dictionary order (ascending)
import MButton from '@keeer/material-components-vue/components/button/'
import MCard from '@keeer/material-components-vue/components/card/'
import MCheckbox from '@keeer/material-components-vue/components/checkbox/'
import MFloatingLabel from '@keeer/material-components-vue/components/floating-label/'
import MFormField from '@keeer/material-components-vue/components/form-field/'
import MIcon from '@keeer/material-components-vue/components/icon/'
import MIconButton from '@keeer/material-components-vue/components/icon-button/'
import MLineRipple from '@keeer/material-components-vue/components/line-ripple/'
import MList from '@keeer/material-components-vue/components/list/'
import MMenu from '@keeer/material-components-vue/components/menu/'
import MRadio from '@keeer/material-components-vue/components/radio/'
import MSelect from '@keeer/material-components-vue/components/select/'
import MSwitch from '@keeer/material-components-vue/components/switch/'
import MTextField from '@keeer/material-components-vue/components/text-field/'
import MTypo from '@keeer/material-components-vue/components/typography/'

;[
  MButton,
  MCard,
  MCheckbox,
  MFloatingLabel,
  MFormField,
  MIcon,
  MIconButton,
  MLineRipple,
  MList,
  MMenu,
  MRadio,
  MSelect,
  MSwitch,
  MTextField,
  MTypo,
].forEach(component => Vue.use(component))
