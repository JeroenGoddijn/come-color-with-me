import 'dotenv/config'
import { validateEnv } from './utils/validateEnv.js'
import app from './app.js'

validateEnv()

const PORT = parseInt(process.env['PORT'] ?? '4000', 10)

app.listen(PORT, () => {
  console.log(`Come Color With Me API running on port ${PORT}`)
})
