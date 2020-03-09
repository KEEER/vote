/** @module api */

import { readFileSync } from 'fs'
import path from 'path'

/**
 * Reads a file from `dist`.
 * @param {string} name filename
 * @returns {string}
 */
export const readDistFile = (name) => readFileSync(path.resolve(__dirname, '../../dist', name)).toString()
