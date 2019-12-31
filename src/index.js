// Load env config before anything else
require('dotenv').config()
require('esm')(module, { cjs: { dedefault: true } })('./main')
