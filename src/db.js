/** @module db */
import { Pool } from 'pg'

// connection pool
const pool = new Pool()
/** The connection pool. */
export { pool }

const wrapQuery = (fn, ctx) => {
  return (...args) => {
    args[0] = args[0].replace(/PRE_/g, process.env.TABLEPREFIX)
    return fn.apply(ctx, args)
  }
}

/**
 * A wrapper for the database client object.
 * @param {function} cb Callback. The function should be asynchronous, receiving one param which is the client.
 */
export async function useClient (cb) {
  const client = await pool.connect()
  try {
    client.query = wrapQuery(client.query, client)
    await cb(client)
  } finally {
    client.release()
  }
}

/**
 * A wrapper for pool.query(). See pg.Pool
 */
export const query = wrapQuery(pool.query, pool)

/**
 * Update some values in a table.
 * @param {string} table The table name to be updated
 * @param {object} args A mapping from keys to update to values to update
 * @param {string} key The pkey name
 * @param {*} cond pkey value
 * @example await update('PRE_forms', {id: 'newid', title: 'newtitle'}, 'id', 'oldid')
 */
export async function update (table, args, key, cond) {
  let argarr = [], count = 0, values = []
  for (let i in args) {
    argarr.push(`${i} = $${++count}`)
    values.push(args[i])
  }
  values.push(cond)
  const stmt = `UPDATE ${table} SET ${argarr.join(', ')} WHERE ${key} = $${++count};`
  return await query(stmt, values)
}
