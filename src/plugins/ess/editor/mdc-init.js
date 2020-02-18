// Please keep these in dictionary order (ascending)
import MButton from 'material-components-vue/components/button/'
import MCard from 'material-components-vue/components/card/'
import MCheckbox from 'material-components-vue/components/checkbox/'
import MDialog from 'material-components-vue/components/dialog'
import MDrawer from 'material-components-vue/components/drawer/'
import MFloatingLabel from 'material-components-vue/components/floating-label/'
import MFormField from 'material-components-vue/components/form-field/'
import MIcon from 'material-components-vue/components/icon/'
import MIconButton from 'material-components-vue/components/icon-button/'
import MLineRipple from 'material-components-vue/components/line-ripple/'
import MList from 'material-components-vue/components/list/'
import MMenu from 'material-components-vue/components/menu/'
import MRadio from 'material-components-vue/components/radio/'
import MSelect from 'material-components-vue/components/select/'
import MSwitch from 'material-components-vue/components/switch/'
import MTextField from 'material-components-vue/components/text-field/'
import MTopAppBar from 'material-components-vue/components/top-app-bar/'
import MTypo from 'material-components-vue/components/typography/'

;[
  MButton,
  MCard,
  MCheckbox,
  MDialog,
  MDrawer,
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
  MTopAppBar,
  MTypo,
].forEach(component => Vue.use(component))
