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
    const youId = map.find(m => m[me.type] === me.id)
    if (!youId) return set(ctx.$t('plugin.121.noYou'))
    const you = people.find(p => p.id === youId[me.type === 'junior' ? 'senior' : 'junior'])
    if (!you) return set('内部错误 2')
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
    const html = []
    html.push(escaper`
      <p>${me.name}，你好！</p>
      <p>
        你匹配到的${you.type === 'senior' ? '大朋友' : '小朋友'}是：<strong>${you.name}</strong>。恭喜你！
        __pronoun的微信号是 <strong>${you.微信号}</strong>，名称为「<span dir="ltr">${you.微信名}</span>」，你可以添加__pronoun的微信来和__pronoun联系。
      </p>
    `)
    if (you.年级 === '高一') html.push(escaper`
      <p>
        ${you.name}初中${you.人本 ? '在' : '不在'}人本就读，
        ${you.住宿生}住宿生，
        ${you.竞赛 && you.竞赛.length > 0 ? `曾参加过${you.竞赛.map(strong).join('、')}` : '未曾参加过竞赛'}。
        __pronoun平时${you.游戏 ? `最喜欢玩<strong>${you.游戏}</strong>` : '不玩游戏'}，
        最常用的软件有 ${you.软件.map(strong).join('、')}，
        在校园活动中对<strong>${you.活动}</strong>最感兴趣，
        在学生组织中对<strong>${you.组织}</strong>最感兴趣。
        __pronoun喜欢${[ ...you.领域, ...(you.其他领域 ? [ you.其他领域 ] : []) ].map(strong).join('、')}。
      </p>
    `)
    else html.push('<p>TODO</p>')

    if (you.介绍) html.push(escaper`<p>__pronoun的补充介绍：</p><p>${you.介绍}</p>`)
    if (you.要求) html.push(escaper`<p>__pronoun希望你是：</p><p>${you.要求}</p>`)

    return set(html.join('\n').replace(/\n\s*|\n\s*\n/g, '\n').replace(/__pronoun/g, pronoun))
  })
  form.on('bundle', ({ data }) => getConfig(data, 'settings', settingsKey) && setConfig(data, 'settings', settingsKey, null))
}
