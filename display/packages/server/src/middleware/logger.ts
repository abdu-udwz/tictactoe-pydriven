import morgan from 'morgan'
import logger from '@/util/logger'

export default morgan('common', {
  stream: {
    write (message) {
      // take a slice ignoring the last character of morgan's output
      // because it appends a '\n' by default
      logger.http(message.slice(0, -2))
    },
  },
})
