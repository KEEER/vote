import {buildSchema} from 'graphql'
import {readFileSync} from 'fs'
import {resolve} from 'path'

const schema = buildSchema(
  readFileSync(
    resolve(__dirname, 'schema.graphql')
  ).toString()
)
export {schema}
