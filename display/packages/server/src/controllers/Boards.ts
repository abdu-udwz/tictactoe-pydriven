// express
import type { Request, Response } from 'express'
// service
import { create as createBoard, getOne as getBoardByName } from '@/services/Boards'
// util
import mainLogger from '@/util/logger'
const logger = mainLogger.child({
  service: 'boards-controller',
})

// === read
interface GetBoardReqParams {
  name: string
}
export async function getOne (req: Request<GetBoardReqParams>, res: Response): Promise<any> {
  try {
    logger.info('trying to get board', { name: req.params.name })
    const result = await getBoardByName(req.body.name)
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

// export async function updateOne (req: Request, res: Response): Promise<any> {

// }