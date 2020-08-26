const people = []
const map = []
const x = '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄和穆萧尹姚邵湛汪祁毛禹狄米贝明臧计伏成戴谈宋茅庞熊纪舒屈项祝董梁杜阮蓝闵席季麻强贾路娄危江童颜郭梅盛林刁锺徐邱骆高夏蔡田樊胡凌霍虞万支柯昝管卢莫经房裘缪干解应宗丁宣贲邓郁单杭洪包诸左石崔吉钮龚程嵇邢滑裴陆荣翁荀羊於惠甄曲家封'
const m = '富强民主文明和谐自由平等公正法治爱国敬业诚信友善'
const 年级 = '高一'
const id = (function* (s = 0) { while (1) yield s++ })()
const getName = () => x[~~(Math.random() * x.length)] + m[~~(Math.random() * m.length)]
const getWxId = () => `wxid_${Buffer.allocUnsafe(8).toString('hex')}`
const number = (function* (s = 0) { while (1) yield String(13500000000 + s++) })()

const getPerson = () => ({
  id: id.next().value,
  number: number.next().value,
  gender: Math.random() > .5 ? 'male' : 'female',
  年级,
  name: getName(),
  微信号: getWxId(),
  微信名: 'WX ' + getName(),
  人本: Math.random() > .5,
  住宿生: [ '是', '曾是', '不曾是' ][~~(Math.random() * 3)],
  竞赛: Math.random() > .5 ? [] : [ '数学竞赛', '信息学竞赛' ],
  游戏: Math.random() > .5 ? 'SimCity' : '',
  软件: [ 'gcc', 'gdb', 'cat', 'man', 'ls', 'node' ],
  活动: '电影节',
  组织: 'KEEER',
  领域: [ 'Minecraft', 'Realms' ],
  其他领域: Math.random() > .5 ? '<img src onerror="alert(/xss/)">' : '',
  介绍: Math.random() > .5 ? 'qazwsxedcrfvtgbyhn\n'.repeat(4) : '',
  要求: Math.random() > .5 ? 'pl,okmijnuhbygvtfc\n'.repeat(4) : '',
})

for (const _ of Array(128).keys()) people.push({ ...getPerson(), type: 'senior' })
for (const _ of Array(64).keys()) people.push({ ...getPerson(), type: 'junior' })
for (const i of Array(64).keys()) map.push({ junior: i + 128, senior: i })

console.log(JSON.stringify({ people, map }, null, 2))
