// express
import express, { Router } from 'express'
// sub routes
import boardsRouter from './boards'

const router = Router()

router.use(express.json(), express.urlencoded({ extended: true }))

router.use('/boards', boardsRouter)

router.get('/', (req, res) => {
  res.send(`
  <head>
    <title>TicTacToe-Driven</title>
  </head>
  <body>
    <h1>Hello, TicTacToe-Driven API!</h1>
  </body>
  `)
})


export default router