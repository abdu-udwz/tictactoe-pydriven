import type { Server as HttpServer } from 'http'
import { Server as IOServer } from 'socket.io'
// util
import mainLogger from '@/util/logger'
const logger = mainLogger.child({ service: 'sockets' })

let ioServer: null | IOServer  = null

export function init (server: HttpServer): void{
  ioServer = new IOServer(server, {
    path: '/_api/socket.io',
  })


  ioServer.on('connection', (socket) => {
    logger.info('user connected', { id: socket.id })
  })
}

const accessor = {
  get io (): IOServer {
    if (ioServer == null) {
      const error = new Error('trying to access socket server before initialization')
      logger.error('accessing sockets server, server is not initialized', { error: error.stack })
      throw error
    }
    return ioServer
  },
}

export default accessor