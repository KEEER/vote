import { parsePhoneNumberFromString } from '@keeer/libphonenumber/max'
import { randomBytes as randomBytesCb } from 'crypto'
import { promisify } from 'util'
import smsCb from 'ali-sms'
import { v4 as uuid } from 'uuid'
import { createServerInjection, addPage } from '@vote/api'
import logger from '@vote/core/log'
import { query } from '@vote/core/db'
const log = logger.child({ part: 'plugin-sms-verify' })

const randomBytes = promisify(randomBytesCb)
const sms = promisify(smsCb)

const SMS_MAXAGE = parseInt(process.env.SMS_MAXAGE)
const SMS_INTERVAL = parseInt(process.env.SMS_INTERVAL)
const { SMS_VERIFICATION_CODE_TEMPLATE } = process.env

const sendSms = async (number, templateCode, param) => await sms({
  accessKeyID: process.env.ALI_SMS_ACCESS_KEY_ID,
  accessKeySecret: process.env.ALI_SMS_ACCESS_KEY_SECRET,
  paramString: param,
  recNum: [ number ],
  signName: process.env.ALI_SMS_SIGN_NAME, // i.e. '客页KEEER'
  templateCode,
})

const checkNumber = phoneNumber => {
  const number = parsePhoneNumberFromString(phoneNumber, 'CN')
  if (!number || !number.isValid() || number.getType() !== 'MOBILE' || number.country !== 'CN') return false
  return number.nationalNumber // format: '15000000000'
}
const generateCode = async () => String((await randomBytes(8)).readUInt32BE() % 10000).padStart(4, '0')
const hits = {}

export default form => {
  injectionMixin(form)
  form.on('validateQuestionOverride', async ({ question, data, invalidate, finalize }) => {
    if (question.type !== 'VSmsVerify') return
    const answer = data[question.id]
    if (!question.required && !answer) return finalize()
    if (typeof answer !== 'string') return invalidate()
    const res = await query('SELECT number FROM PRE_sms_verification_tokens WHERE token = $1;', [ answer.split(':')[1] ])
    if (res.rows.length < 1) return invalidate()
    const { number } = res.rows[0]
    data[question.id] = number
    return finalize()
  })
}

const injectionMixin = createServerInjection(() => {
  addPage('_sms-code', async ctx => {
    if (ctx.method !== 'PUT') return ctx.status = 405
    if (!ctx.request.body) ctx.request.body = {}
    const { number } = ctx.request.body
    if (!number || typeof number !== 'string') return ctx.status = 400
    const phoneNumber = checkNumber(number)
    if (!phoneNumber) {
      ctx.body = '无效的手机号'
      return ctx.status = 400
    }
    const checkRes = await query(
      'SELECT id FROM PRE_sms_verification_codes WHERE time > $1 AND number = $2;',
      [ new Date(Date.now() - SMS_INTERVAL), phoneNumber ],
    )
    if (checkRes.rows.length > 0) {
      ctx.status = 429
      return ctx.body = '验证码发送过于频繁，请稍候再试'
    }
    const code = await generateCode()
    log.info(`sms:send About to send verification code to ${phoneNumber}.`)
    const res = await query('INSERT INTO PRE_sms_verification_codes (number, code) VALUES ($1, $2) RETURNING id;', [ phoneNumber, code ])
    try {
      await sendSms(phoneNumber, SMS_VERIFICATION_CODE_TEMPLATE, { code })
      return ctx.status = 200
    } catch (e) {
      try {
        await query('DELETE FROM PRE_sms_verification_codes WHERE id = $1;', [ res.rows[0].id ])
      } catch (e) { log.warn(e) }
      log.warn(e)
      ctx.body = '未知错误'
      return ctx.status = 500
    }
  })
  addPage('_sms-token', async ctx => {
    if (ctx.method !== 'PUT') return ctx.status = 405
    if (!ctx.request.body) return ctx.status = 400
    const { number, code } = ctx.request.body
    if (!number || !code) return ctx.status = 400
    const phoneNumber = checkNumber(number)
    if (!phoneNumber) return ctx.status = 400
    // rate limiting
    if (!hits[phoneNumber]) hits[phoneNumber] = { expiry: Date.now() + 3600000, hits: 0 }
    if (hits[phoneNumber].hits++ > 16) {
      log.info(`sms:rate Phone number ${phoneNumber} has been rate limited`)
      return ctx.status = 429
    }
    log.info(`sms:del About to verify verification code from ${phoneNumber} with ${code}.`)
    const res = await query(
      'DELETE FROM PRE_sms_verification_codes WHERE number = $1 AND code = $2 AND time > $3;',
      [ phoneNumber, code, new Date(Date.now() - SMS_MAXAGE) ],
    )
    if (res.rowCount > 0) {
      log.info(`sms:token About to create SMS token for ${phoneNumber}.`)
      const token = uuid()
      await query('INSERT INTO PRE_sms_verification_tokens (number, token) VALUES ($1, $2);', [ phoneNumber, token ])
      return token
    } else return ctx.status = 403
  })
})

setInterval(async () => {
  try {
    await query('DELETE FROM PRE_sms_verification_codes WHERE time < $1;', [ new Date(Date.now() - SMS_MAXAGE) ])
  } catch (e) { log.error(e) }
  const now = Date.now()
  for (const number in hits) if (hits[number].expiry < now) delete hits[number]
}, parseInt(process.env.SMS_CLEAR_INTERVAL))
