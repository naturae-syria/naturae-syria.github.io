// Utility module to provide product data for Node.js environments
const fs = require('fs')
const path = require('path')
const vm = require('vm')

const file = fs.readFileSync(path.join(__dirname, 'products.js'), 'utf8')
const sandbox = { products: [] }
vm.runInNewContext(file, sandbox)
module.exports = sandbox.products
