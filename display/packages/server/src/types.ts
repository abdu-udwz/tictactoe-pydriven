export type BoardMatrixSpaceOption = -1 | 1 | 0
export type BoardMatrixRow = [BoardMatrixSpaceOption, BoardMatrixSpaceOption, BoardMatrixSpaceOption]
export type BoardMatrix = [BoardMatrixRow, BoardMatrixRow, BoardMatrixRow]

declare module 'socket.io' {
  interface Socket {
    board?: string
  }
}