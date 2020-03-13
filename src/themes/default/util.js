export function shuffle (arr) {
  let i = arr.length
  while (i !== 0) {
    const newIndex = Math.floor(Math.random() * i)
    i--
    ;[ arr[i], arr[newIndex] ] = [ arr[newIndex], arr[i] ]
  }
  return arr
}
