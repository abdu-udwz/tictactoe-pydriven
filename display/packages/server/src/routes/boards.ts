// express
import { Router } from 'express'
// controller
import * as BoardsControllers from '@/controllers/Boards'
const router = Router()

// create board
router.post('/', BoardsControllers.createOne)

// get board
router.get('/:name', BoardsControllers.getOne)

// update
router.patch('/:name', BoardsControllers.updateOne)

// though not quite RESTful but it is an edge case not 
// a regular update and easily handled separated
router.post('/:name/reset', BoardsControllers.resetOne)

export default router