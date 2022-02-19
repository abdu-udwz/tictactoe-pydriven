export interface Board {
  _id: string
  name: string
  matrix: number[][]
  lastUsed: Date

  winner?: null | 0 | 1
  isDraw?: boolean
  hasStarted: boolean
  hasEnded: boolean
}

import type { io as IO } from 'socket.io-client'
declare global {
  const io: typeof IO
}