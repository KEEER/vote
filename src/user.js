/** @module user */

import { query } from './db'
import KASClient from 'kas-client-node'

export const kas = new KASClient({ base: process.env.KAS_BASE, secretKey: process.env.KAS_KEY })

export class KASError extends Error {}
export class NotLoggedInError extends Error {}
export class UserNotFoundError extends Error {}

/** Class representing a user. */
export class User {
  constructor (options) {
    this.options = options
  }

  save () {}
  update () {}
  static fromId () {}
  static async fromToken () {}

  /**
   * Gets user from a Koa context.
   * @async
   * @param {module:Koa~Context} ctx Koa Context
   * @returns {User} the user
   * @throws {KASError|NotLoggedInError} if exception occurred
   */
  static async fromContext (ctx) {
    const token = ctx.cookies.get(process.env.TOKEN_COOKIE_NAME)
    if (!token) throw new NotLoggedInError()
    let user
    try {
      user = await this.fromToken(user)
      if (user) return user
    } catch (e) {
      if (!(e instanceof UserNotFoundError)) throw e
    }
    try {
      await kas.validateToken(token)
      const info = await kas.getInformation(token)
      // TODO
    } catch (e) {
      throw e
    }
  }
}
