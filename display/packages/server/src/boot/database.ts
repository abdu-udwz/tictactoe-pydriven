import mongoose from 'mongoose'
import mainLogger from '@/util/logger'

const logger = mainLogger.child({ service: 'mongo' })

export default (): void => {
  mongoose.connect(process.env.DATABASE_MONGO_URL ?? 'TicTacToeDriven').then(mongoose => {
    logger.debug('connected successfully')
    mongoose.connection.on('error', (error: any) => {
      logger.error(error)
    })
  }).catch(error => {
    logger.error(error)
  })
}