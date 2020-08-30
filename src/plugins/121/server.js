import { getConfig, setConfig } from '@vote/api'

const settingsKey = '121'
export default form => {
  form.on('updateSettings', ({ name, value, set }) => {
    if (name === settingsKey) try { set(JSON.parse(value)) } catch (_) { set({}) }
  })
  form.on('respondSubmission', ({ form, ctx, data, set }) => {
    const { people, map } = getConfig(form, 'settings', settingsKey, {})
    if (!people || !map) return set(ctx.$t('plugin.121.noData'))
    const number = data[form.questions.find(q => q.type === 'VSmsVerify').id]
    if (!number) return set('内部错误')
    const me = people.find(p => p.number === number)
    if (!me) return set(ctx.$t('plugin.121.noMe'))
    const youIds = map.filter(m => m[me.type] === me.id)
    if (!youIds) return set(ctx.$t('plugin.121.noYou'))
    const yous = youIds.map(youId => people.find(p => p.id === youId[me.type === 'junior' ? 'senior' : 'junior']))
    if (!yous) return set('内部错误 2')

    let str = ""
    for ([you, youId] of [yous, youIds]) {
      const pronoun = { male: '他', female: '她' }[you.gender]
      const escaper = (strings, ...keys) => {
        let html = ''
        for (const i of keys.keys()) {
          html += strings[i]
          html += keys[i].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\n/g, '<br>').replace(/&lt;strong&gt;/g, '<strong>').replace(/&lt;\/strong&gt;/g, '</strong>')
        }
        html += strings[strings.length - 1]
        return html
      }
      const strong = x => `<strong>${x}</strong>`
      let html = []
      html.push(escaper`
        <p>${me.name}，你好！</p>
        <p>
          你匹配到的${you.type === 'senior' ? '大朋友' : '小朋友'}是：<strong>${you.name}</strong>。恭喜你！
          __pronoun的手机号是 <strong>${you.number}</strong>，微信号是 <strong>${you.微信号}</strong>，名称为「<span dir="ltr">${you.微信名}</span>」，你可以添加__pronoun的微信来和__pronoun联系。
        </p>
      `)
      if (you.年级 === 'ICC') html.push(escaper`
        <p>
          ${you.name}初中${you.人本 ? '在' : '不在'}人本就读，
          ${you.住宿生}住宿生，
          最常用的软件有 ${you.软件.map(strong).join('、')}。
        </p>
      `)
      else html.push('<p>TODO</p>')

      str += html.join('\n').replace(/\n\s*|\n\s*\n/g, '\n').replace(/__pronoun/g, pronoun)
    }

    str += escaper`
      <p>祝你们的交流顺利、愉快！</p>
      <p>人大附中志愿团</p>
    `

    return set(str)
  })
  form.on('bundle', ({ data }) => getConfig(data, 'settings', settingsKey) && setConfig(data, 'settings', settingsKey, null))
}
