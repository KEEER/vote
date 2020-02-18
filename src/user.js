/** @module user */

import { query, update } from './db'
import KASClient from 'kas-client-node'
import logger from './log'

const log = logger.child({ part: 'user' })

export const kas = new KASClient({ base: process.env.KAS_BASE, secretKey: process.env.KAS_KEY })

const maxAge = parseInt(process.env.TOKEN_MAXAGE)

export class KASError extends Error {}

/** Class representing a user. */
export class User {
  /**
   * Creates a new user object.
   * @param {string} options.id KEEER ID
   * @param {string} options.nickname nickname of the user
   * @param {string} options.avatarUrl avatar URL
   * @param {*} options.settings settings
   */
  constructor (options) {
    this._updated = []
    this.options = new Proxy(options, {
      set: (obj, prop, val) => {
        if (prop === 'id') {
          throw new TypeError('KEEER ID cannot be mutated')
        }
        if (this._updated.indexOf(prop) < 0) this._updated.push(prop)
        obj[prop] = val
        return true
      },
    })
  }

  // getters / setters for aliases
  get id () { return this.options.id }
  set id (val) { this.options.id = val }
  get nickname () { return this.options.nickname }
  set nickname (val) { this.options.nickname = val }
  get avatarUrl () { return this.options.avatarUrl }
  set avatarUrl (val) { this.options.avatarUrl = val }
  get settings () { return this.options.settings }
  set settings (val) { this.options.settings = val }

  /** Saves a user into the database. */
  async save () {
    if (this._saved) return await this.update()
    const stmt = 'INSERT INTO PRE_users (id, avatar_url, nickname, settings) VALUES ($1, $2, $3, $4);'
    await query(stmt, [ this.id, this.avatarUrl, this.nickname, this.settings ])
    this._saved = true
  }

  /** Updates a user in database. */
  async update () {
    if (!this._saved) return await this.save()
    if (this._updated.length === 0) return
    const args = {}
    for (let name of this._updated) args[name] = this.options[name]
    this._updated.length = 0
    await update('PRE_users', args, 'id', this.id)
  }

  /**
   * Gets a user from its KEEER ID.
   * @param {string} id KEEER ID
   */
  static async fromId (id) {
    const res = await query('SELECT * FROM PRE_users WHERE id = $1;', [ id ])
    if (res.rows.length > 1) {
      log.error(`duplicate user id ${id}`)
      throw new Error('duplicate user id')
    }
    if (res.rows.length === 0) return null
    const user = new User(res.rows[0])
    user._saved = true
    return user
  }

  /**
   * Gets a user from the database from a KAS account token.
   * @param {string} token KAS account token
   */
  static async fromToken (token) {
    const res = await query('SELECT id FROM PRE_tokens WHERE token = $1;', [ token ])
    if (res.rows.length === 0) return null
    return await this.fromId(res.rows[0].id)
  }

  /**
   * Gets user from a Koa context.
   * @async
   * @param {module:Koa~Context} ctx Koa Context
   * @returns {User} the user
   * @throws {KASError} if exception occurred
   */
  static async fromContext (ctx) {
    const token = ctx.cookies.get(process.env.TOKEN_COOKIE_NAME)
    if (!token) return null
    let user
    user = await this.fromToken(token)
    if (user) return user
    try {
      await kas.validateToken(token)
      const info = await kas.getInformation(token)
      const id = info.keeer_id
      try {
        const expiry = new Date(Date.now() + maxAge)
        await query('INSERT INTO PRE_tokens (token, id, expiry) VALUES ($1, $2, $3);', [ token, id, expiry ])
      } catch (e) {
        log.error(e)
        // 23505: pkey not unique
        if (e.code !== '23505') throw e
      }
      user = await this.fromId(id)
      if (user) {
        if (user.avatarUrl !== info.avatarUrl) user.avatarUrl = info.avatarUrl
        if (user.nickname !== info.nickname) user.nickname = info.nickname
        await user.update()
        return user
      }
      // new user
      // TODO: guidethrough
      user = new User({
        id,
        avatarUrl: info.avatar,
        nickname: info.nickname,
      })
      await user.save()
      return user
    } catch (e) {
      throw e
    }
  }
}

setInterval(async () => {
  try {
    await query('DELETE FROM PRE_tokens WHERE expiry <= to_timestamp($1);', [ Date.now() / 1000 ])
  } catch (e) {
    log.error(e)
  }
}, parseInt(process.env.SESSION_CLEAN_INTERVAL))
