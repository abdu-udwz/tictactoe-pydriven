// express
import { Router } from 'express'
// controller
import * as BoardsControllers from '@/controllers/Boards'
const router = Router()

// create board
router.post('/', BoardsControllers.createOne)

// get board
router.get('/:name', BoardsControllers.getOne)

router.patch('/:name', BoardsControllers.updateOne)

export default router