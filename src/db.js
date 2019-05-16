/** @module db */
import {Pool} from 'pg'

// connection pool
const pool = new Pool()
/** The connection pool. */
export {pool}

/**
 * A wrapper for the database client object.
 * @param {function} cb Callback. The function should be asynchronous, receiving one param which is the client.
 */
export async function useClient(cb) {
  const client = await pool.connect()
  try {
    await cb(client)
  } finally {
    client.release()
  }
}

/**
 * A wrapper for pool.query(). See pg.Pool
 */
export function query() {
  const args = arguments
  args[0] = args[0].replace(/PRE_/g, process.env.TABLEPREFIX)
  return pool.query.apply(pool, args)
}
