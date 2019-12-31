if (typeof window === 'undefined') {
  // node
  module.exports = require('fs')
    .readFileSync(
      require('path')
        .resolve(__dirname, 'schema.graphql'))
    .toString()
} else {
  // browser
  module.exports = require('raw-loader!./schema.graphql')
}
