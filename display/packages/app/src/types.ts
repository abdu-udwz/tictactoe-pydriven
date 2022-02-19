export interface Board {
  _id: string
  name: string
  matrix: number[][]
  lastUsed: Date
}

import type { io as IO } from 'socket.io-client'
declare global {
  const io: typeof IO
}