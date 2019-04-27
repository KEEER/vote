import {Pool, Client} from 'pg'

// connection pool
const pool = new Pool()
export {pool}

export async function useClient(cb) {
  const client = await pool.connect()
  try {
    await cb(client)
  } finally {
    client.release()
  }
}

export function query() {
  return pool.query.apply(pool, arguments)
}
