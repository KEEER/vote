const useValidation = {
  type: 'switch',
  label: 'core.question.validation.useValidation',
  name: 'useValidation',
  default: false,
}

const showValidation = {
  type: 'checkbox',
  if: value => value.useValidation,
  label: 'core.question.validation.param.showValidation',
  name: 'showValidation',
  default: true,
}

const invalidTip = {
  type: 'text-field',
  if: value => value.useValidation,
  label: 'core.question.validation.param.invalidTip',
  name: 'invalidTip',
}

const textValidation = [
  useValidation,
  {
    type: 'cascade',
    if: value => value.useValidation,
    label: 'core.question.validation.type',
    name: 'type',
    default: [ 'text', 'startsWith' ],
    options: {
      label: 'core.question.validation.type',
      children: [
        {
          label: 'core.question.validation.types.text',
          value: 'text',
          nextLabel: 'core.question.validation.types.textType',
          children: [
            { label: 'core.question.validation.types.textTypes.startsWith', value: 'startsWith' },
            { label: 'core.question.validation.types.textTypes.notStartsWith', value: 'notStartsWith' },
            { label: 'core.question.validation.types.textTypes.endsWith', value: 'endsWith' },
            { label: 'core.question.validation.types.textTypes.notEndsWith', value: 'notEndsWith' },
            { label: 'core.question.validation.types.textTypes.includes', value: 'includes' },
            { label: 'core.question.validation.types.textTypes.notIncludes', value: 'notIncludes' },
            { label: 'core.question.validation.types.textTypes.is', value: 'is' },
            { label: 'core.question.validation.types.textTypes.isNot', value: 'isNot' },
          ],
        },
        {
          label: 'core.question.validation.types.numeric',
          value: 'numeric',
          nextLabel: 'core.question.validation.types.numericType',
          children: [
            { label: 'core.question.validation.types.numericTypes.isNumber', value: 'isNumber' },
            { label: 'core.question.validation.types.numericTypes.isInt', value: 'isInt' },
            { label: 'core.question.validation.types.numericTypes.gt', value: 'gt' },
            { label: 'core.question.validation.types.numericTypes.ge', value: 'ge' },
            { label: 'core.question.validation.types.numericTypes.lt', value: 'lt' },
            { label: 'core.question.validation.types.numericTypes.le', value: 'le' },
            { label: 'core.question.validation.types.numericTypes.eq', value: 'eq' },
            { label: 'core.question.validation.types.numericTypes.ne', value: 'ne' },
          ],
        },
        {
          label: 'core.question.validation.types.length',
          value: 'length',
          nextLabel: 'core.question.validation.types.lengthType',
          children: [
            { label: 'core.question.validation.types.lengthTypes.minlen', value: 'minlen' },
            { label: 'core.question.validation.types.lengthTypes.maxlen', value: 'maxlen' },
          ],
        },
        { label: 'core.question.validation.types.phone', value: 'phone' },
        { label: 'core.question.validation.types.mobile', value: 'mobile' },
        { label: 'core.question.validation.types.email', value: 'email' },
        { label: 'core.question.validation.types.url', value: 'url' },
      ],
    },
  },
  {
    type: 'text-field',
    if: value => value.useValidation && value.type[0] === 'text',
    label: 'core.question.validation.param.textContent',
    name: 'textContent',
    required: true,
  },
  {
    type: 'text-field',
    validation: 'number',
    if: value => value.useValidation && value.type[0] === 'numeric' && value.type[1] !== 'isNumber' && value.type[1] !== 'isInt',
    label: 'core.question.validation.param.numericContent',
    name: 'numericContent',
    required: true,
  },
  {
    type: 'text-field',
    validation: 'number',
    if: value => value.useValidation && value.type[0] === 'length',
    label: 'core.question.validation.param.lengthContent',
    name: 'lengthContent',
    required: true,
  },
  showValidation,
  invalidTip,
]

const checkboxValidation = [
  useValidation,
  {
    type: 'text-field',
    if: value => value.useValidation,
    validation: 'number',
    label: 'core.question.validation.param.minSelection',
    name: 'minSelection',
  },
  {
    type: 'text-field',
    if: value => value.useValidation,
    validation: 'number',
    label: 'core.question.validation.param.maxSelection',
    name: 'maxSelection',
  },
  showValidation,
  invalidTip,
]

const validationTypes = {
  VText: textValidation,
  VTextarea: textValidation,
  VRadio: [],
  VCheckbox: checkboxValidation,
  VNull: [],
}

export default validationTypes
