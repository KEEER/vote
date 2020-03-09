/** @module api */

/**
 * @callback addPageCallback
 * @param {Koa.Context} ctx Koa context
 * @param {module:form~Form} form the form
 * @param {string} path the path of the request
 * @returns {number|string|undefined}
 */

/**
 * Adds a page entry to the form.
 * @param {string} path path to listen on
 * @param {string|Buffer|addPageCallback} callback the page itself or a callback to get the page
 */
export const addPage = (path, callback) => form => form.on('getPage', async ([ form, path1, ctx, set ]) => {
  if (path === path1) {
    const res = typeof callback === 'function' ? await callback(ctx, form, path1) : callback
    if (typeof res !== 'undefined') set(res)
  }
})
