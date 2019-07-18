import {buildSchema} from 'graphql'
import {readFileSync} from 'fs'
import {resolve} from 'path'
import assert from 'assert'

const schema = buildSchema(
  readFileSync(
    resolve(__dirname, 'schema.graphql')
  ).toString()
)
export {schema}

export function query(query, variables) {
  assert(typeof window === 'undefined', 'graphql.query() shouldn\'t be called out of browser')
  assert(typeof query === 'string')
  assert(typeof args === 'object')
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    // TODO: figure out path more accurately
    xhr.open('POST', '_query')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify({
      query,
      variables,
    }))
    xhr.onreadystatechange = () => {
      if(xhr.readyState !== 4) return
      if(xhr.status !== 200) {
        reject(new Error(`Status code is ${xhr.status} instead of 200`))
      }
      try {
        return JSON.parse(xhr.response)
      } catch(e) {
        reject(new Error('Invalid response'))
      }
    }
  })
}
