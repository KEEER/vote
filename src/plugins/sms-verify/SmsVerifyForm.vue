<template>
  <div class="container">
    <template v-if="done">
      您的手机号码：{{ number }} ·
      <m-button @click="showVerificationCode = false; value_ = code = ''">
        切换手机号
      </m-button>
    </template>
    <template v-else>
      <div>
        <m-text-field
          :id="`${uid}-number`"
          v-model="number"
          outlined
          type="tel"
          autocomplete="tel"
          :valid="!invalidNumber"
          :disabled="showVerificationCode"
        >
          <m-floating-label :for="`${uid}-number`">
            手机号码
          </m-floating-label>
        </m-text-field>
        <m-text-field-helper-line v-if="invalidNumber">
          <m-text-field-helper-text persistent validation-msg>
            请输入正确的手机号码
          </m-text-field-helper-text>
        </m-text-field-helper-line>
      </div>
      <div v-if="showVerificationCode">
        <m-text-field :id="`${uid}-code`" v-model="code" outlined type="number" autocomplete="off" :valid="!invalidCode">
          <m-floating-label :for="`${uid}-code`">
            验证码
          </m-floating-label>
        </m-text-field>
        <m-text-field-helper-line v-if="invalidCode">
          <m-text-field-helper-text persistent validation-msg>
            验证码错误，请检查后重新输入
          </m-text-field-helper-text>
        </m-text-field-helper-line>
        <div>
          <m-button @click="showVerificationCode = false">
            切换手机号
          </m-button>
        </div>
      </div>
      <m-button class="validate-button" outlined :disabled="networking" @click="validate">
        验证
      </m-button>
    </template>
  </div>
</template>

<style scoped>
.container { margin: 16px 0; }
.validate-button { margin: 8px 0; }
</style>

<script>
import { FormStorage, questionMixin } from '@vote/api'

export const numberValidator = { v: () => true }
const tokenStorage = new FormStorage('sms-verification-tokens', 'user')

export default {
  name: 'SmsVerifyForm',
  mixins: [ questionMixin ],
  props: {
    value: { type: String, default: '' },
  },
  data () {
    return {
      number: '',
      code: '',
      invalidNumber: false,
      done: false,
      networking: false,
      invalidCode: false,
      showVerificationCode: false,
    }
  },
  watch: {
    value_ (val) {
      this.done = !!val
      this.number = val.split(':')[0]
    },
  },
  methods: {
    async validate () {
      if (!numberValidator.v(this.number)) return this.invalidNumber = true
      this.invalidNumber = false
      if (tokenStorage.data[this.number]) {
        this.value_ = `${this.number}:${tokenStorage.data[this.number]}`
        return
      }
      if (this.showVerificationCode) {
        if (!this.code) return
        this.networking = true
        const { number, code } = this
        const resp = await fetch('_sms-token', { method: 'put', body: JSON.stringify({ number, code }), headers: { 'Content-Type': 'application/json' } })
        if (resp.status === 200) {
          this.invalidCode = false
          // store token
          const token = tokenStorage.data[this.number] = await resp.text()
          tokenStorage.update()
          this.value_ = `${this.number}:${token}`
          this.networking = false
          return
        } else if (resp.status === 429) { // 429 Too Many Requests
          this.invalidCode = this.networking = false
          alert('尝试过于频繁，请稍候再试')
        } else {
          this.invalidCode = true
          this.networking = false
        }
        return
      }
      // send code
      this.networking = true
      const resp = await fetch('_sms-code', { method: 'put', body: JSON.stringify({ number: this.number }), headers: { 'Content-Type': 'application/json' } })
      if (resp.status !== 200) alert(await resp.text())
      this.networking = false
      this.showVerificationCode = true
    },
  },
}
</script>
