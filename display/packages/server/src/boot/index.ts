import { type Server } from 'http'
import database from './database'
import socket from './socket'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function (server: Server): void {
  database()
  socket(server)
}