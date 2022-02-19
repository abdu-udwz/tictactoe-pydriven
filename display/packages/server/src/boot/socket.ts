import type { Server } from 'http'
import { init } from '@/services/Sockets'

export default function (server: Server): void {
  init(server)
}