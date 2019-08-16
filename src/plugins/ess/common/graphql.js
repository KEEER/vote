import {buildSchema, parse, validate} from 'graphql'
import assert from 'assert'
import schemaText from './schemaText'

const schema = buildSchema(schemaText)
export {schema}

export function query(query, variables) {
  variables = variables || {}
  assert(typeof window !== 'undefined', 'graphql.query() shouldn\'t be called out of browser')
  assert(typeof query === 'string')
  assert(typeof variables === 'object')
  assert(validate(schema, parse(query)), 'Invalid graphql query')
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
        resolve(JSON.parse(xhr.response))
      } catch(e) {
        reject(new Error('Invalid response'))
      }
    }
  })
}
