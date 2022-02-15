import { type Server } from 'http'
import database from './database'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function (server: Server): void {
  database()
}