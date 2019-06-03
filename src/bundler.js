/** @module bundler */

/**
 * Bundles a form to a JS script.
 * @param {module:form~Form} form The form object to be bundled
 * @param {string} action The action of the form
 * @param {string} method Must be 'POST', reserved for future use
 * @returns {string} Bundled form
 */
export default function bundler(form, action, method) {
  const data = {
    title: form.options.title,
    action,
    method,
    data: form.pages.map(page => page.questions.map(q => q.toObject())),
  }
  return '(function(){ window.KVoteFormData = ' + JSON.stringify(data) + '})()'
  // TODO: plugins
}
