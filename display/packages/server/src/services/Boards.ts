// type BoardRow = [number, number, number]
// type BoardMatrix = [BoardRow, BoardRow, BoardRow]
// models
import BoardModel, { BoardDocument } from '@/models/Board'
import { Error as MongooseError } from 'mongoose'
// util
import mainLogger from '@/util/logger'
const logger = mainLogger.child({ service: 'boards-service' })

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

type BoardGetError = 'NO_SUCH_BOARD'

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