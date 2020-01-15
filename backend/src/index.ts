import { app } from './app'
import { config, log } from './common'

app.listen(config.PORT, () => {
  log.info(`My Node bootstrap started at port: ${config.PORT}`)
})

process.on('exit', () => {
  log.info('Shutting down server')
})
