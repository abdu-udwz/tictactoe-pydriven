// express
import type { Request, Response } from 'express'
// service
import {
  create as createBoard, 
  getOne as getBoardByName, 
  updateOne as updateBoard, 
} from '@/services/Boards'
// util
import mainLogger from '@/util/logger'
// types
import type { BoardMatrix } from '@/types'

const logger = mainLogger.child({
  service: 'boards-controller',
})

interface SingleBoardReqParams {
  name: string
}

// === read
type GetBoardReqParams = SingleBoardReqParams

export async function getOne (req: Request<GetBoardReqParams>, res: Response): Promise<any> {
  try {
    logger.info('trying to get board', { name: req.params.name })
    const result = await getBoardByName(req.params.name)
    if (typeof result == 'string') {
      return res.status(404).json(result)
    } else {
      return res.status(201).json(result)
    }
  } catch (error: any) {
    logger.error('unknown error while fetching board data', {
      name: req.params.name,
    })

    return res.sendStatus(500)
  }
}

// === write
interface CreateBoardReqBody {
  name?: string
}

export async function createOne (req: Request<any, any, CreateBoardReqBody>, res: Response): Promise<any> {
  try {
    if (req.body.name == null || !req.body.name?.trim()) {
      return res.status(400).json('BAD_NAME')
    }

    const result = await createBoard(req.body.name)
    if (typeof result == 'string') {
      return res.status(400).json(result)
    } else {
      return res.status(201).json(result)
    }
  } catch (error: any) {
    logger.error('unknown error while creating board', {
      name: req.body.name,
    })

    return res.sendStatus(500)
  }
}

interface UpdateBoardReqBody {
  matrix?: BoardMatrix
}

export async function updateOne (req: Request<SingleBoardReqParams, any, UpdateBoardReqBody>, res: Response): Promise<any> {
  try {
    const { name: boardName } = req.params
    logger.info('attempt to update board', { name: boardName } )

    if (req.body.matrix == null || !Array.isArray(req.body.matrix)) {
      return res.status(400).json('INVALID_MATRIX')
    }

    const result = await updateBoard(boardName, { matrix: req.body.matrix })

    if (typeof result === 'string') {
      switch (result) {
        case 'NO_SUCH_BOARD':
          res.status(404)
          break
      }

      res.json(result)
      return res.send()
    }

    return res.json(result)
  } catch (error: any) {
    logger.error('unknown error while updating board', { name: req.params.name, error })
    return res.sendStatus(500)
  }
}