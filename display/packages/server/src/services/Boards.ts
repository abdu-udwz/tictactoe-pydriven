// type BoardRow = [number, number, number]
// type BoardMatrix = [BoardRow, BoardRow, BoardRow]
// models
import BoardModel, { BoardDocument } from '@/models/Board'
import { Error as MongooseError } from 'mongoose'
import type { BoardMatrix } from '@/types'
// util
import mainLogger from '@/util/logger'
const logger = mainLogger.child({ service: 'boards-service' })

type NoSuchBoardError = 'NO_SUCH_BOARD'

type BoardCreateError = 'BOARD_EXISTS' | 'INVALID_NAME'

export async function create (name: string): Promise<BoardDocument | BoardCreateError> {
  try {
    const boardDocument = await BoardModel.create({
      name,
    })

    logger.info('board created successfully', { name })
    return boardDocument
  } catch (error: any) {
    let errorCode: BoardCreateError = 'BOARD_EXISTS'
    let message = 'error creating a board'
    if (error instanceof MongooseError.ValidationError) {
      errorCode = 'INVALID_NAME'
    } else {
      message = 'board already exists'
      errorCode = 'BOARD_EXISTS'
    }
    logger.error(message, { name, error })
    return errorCode
  }
}

type BoardMatrixBoardUpDateError = 'BAD_MOVE' | 'BOX_OCCUPIED' | 'OTHER_PLAYER_ROLE'  
type BoardUpdateError = NoSuchBoardError | 'GAME_ENDED' | BoardMatrixBoardUpDateError

interface UpdateBoardPayload {
  matrix: BoardMatrix
}

export async function updateOne (name: string, payload: UpdateBoardPayload): Promise<BoardDocument | BoardUpdateError> {
  let board = await BoardModel.findOne({ name: name.toLowerCase() })

  if (board == null) {
    logger.info('trying to update non-existing board', { name })
    return 'NO_SUCH_BOARD'
  }

  if (board.hasEnded) {
    logger.info('trying to update a game that has finished', { name })
    return 'GAME_ENDED'
  }

  const oldMatrix = board.matrix
  const newMatrix = payload.matrix

  if (board.firstPlayer == null) {
    loop1:
    for (const row of newMatrix) {
      // console.log(row.find(value => value !== -1))
      for (const value of row) {
        if (value !== -1) {
          board.firstPlayer = value
          break loop1
        }
      }
    }
  }

  const validation = validateNewBoardMatrix(oldMatrix, newMatrix, board.firstPlayer as 0 | 1)
  if (validation !== true) {
    return validation
  }

  board.set('matrix', payload.matrix)

  board = await board.save()
  logger.info('board updated successfully', { name }) 
  return board
}

type BoardGetError = NoSuchBoardError

export async function getOne (name: string): Promise<BoardDocument | BoardGetError> {
  try {
    const boardDocument = await BoardModel.findOne({
      name: name.toLowerCase(),
    }).orFail()

    logger.info('successfully fetch board from database', { name })
    return boardDocument
  } catch (error : any) {
    logger.error('could not fetch board form database, none was found with the name provided',
      {
        name,
      },
    )
    return 'NO_SUCH_BOARD'
  }
}
function validateNewBoardMatrix (
  oldMatrix: BoardMatrix,
  newMatrix: BoardMatrix,
  firstPlayer: 0 | 1): true | BoardMatrixBoardUpDateError  {
  // === validation ===
  // * only one box is allowed to be updated a time
  // * cannot overwrite a box
  // * cannot undo a box
  // * respect role
  //   role can be determined with this formula:
  //   same number of boxes (including zeros) => first player role otherwise second player role
  const oldOPositions = buildPlayerPositionsMap(oldMatrix, 0)
  const oldXPositions = buildPlayerPositionsMap(oldMatrix, 1)
  
  const newOPositions = buildPlayerPositionsMap(newMatrix, 0)
  const newXPositions = buildPlayerPositionsMap(newMatrix, 1)

  const oldOccupied = oldOPositions.length + oldXPositions.length
  const newOccupied = newOPositions.length + newXPositions.length

  if (newOccupied - oldOccupied !== 1) {
    // a corrupted move generally (multiple new, nothing, removing old)
    return 'BAD_MOVE'
  }
  
  const oOverwritten = !oldOPositions.every(([row, col]) => newMatrix[row][col] === 0)
  const xOverwritten = !oldXPositions.every(([row, col]) => newMatrix[row][col] === 1)
  // console.log('o overwritten?', oOverwritten, 'x overwritten?', xOverwritten)
  if (oOverwritten || xOverwritten) {
    return 'BOX_OCCUPIED'
  }

  const firstPlayerNewPositions = firstPlayer === 0 
    ? newOPositions
    : newXPositions
  const secondPlayerNewPositions = firstPlayer === 0 
    ? newXPositions
    : newOPositions
  
  if (oldOPositions.length === oldXPositions.length) {
    // only the first player new positions can be greater in this case
    if (!(firstPlayerNewPositions.length > secondPlayerNewPositions.length)) {
      return 'OTHER_PLAYER_ROLE'
    }
  } else {
    if (secondPlayerNewPositions.length !== firstPlayerNewPositions.length) {
      return 'OTHER_PLAYER_ROLE'
    }
  }

  return true
}

// console.log(validateNewBoardMatrix(
//   [
//     [0, 1, -1],
//     [-1, -1, -1],
//     [-1, -1, -1],
//   ],

//   [
//     [0, 1, 0],
//     [-1, -1, -1],
//     [-1, -1, -1],
//   ],
//   0,
// ))

function buildPlayerPositionsMap (matrix: number[][], player: 0 | 1): Array<[number, number]> {
  const result: ReturnType<typeof buildPlayerPositionsMap> = []
  matrix.forEach((row, rowIndex) =>
    row.forEach((value, colIndex) => {
      if (value === player) {
        result.push([rowIndex, colIndex])
      }
    }),
  )

  return result
}
