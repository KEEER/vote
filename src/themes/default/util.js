export function getQuestionConfig (data, type, name, defaultValue) {
  // Badly wanted to use ?. but it is not supported by Vue right now :(
  if (!data.config || !data.config[type] || typeof data.config[type][name] === 'undefined') return defaultValue
  return data.config[type][name]
}

export function shuffle (arr) {
  let i = arr.length
  while (i !== 0) {
    const newIndex = Math.floor(Math.random() * i)
    i--
    ;[ arr[i], arr[newIndex] ] = [ arr[newIndex], arr[i] ]
  }
  return arr
}
