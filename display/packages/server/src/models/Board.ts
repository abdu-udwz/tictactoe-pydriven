import mongoose, { Schema, type HydratedDocument, type Model } from 'mongoose'
import type { BoardMatrix } from '@/types'
import { genEmptyBoardMatrix } from '@/util'

interface Board {
  name: string
  matrix: BoardMatrix

  firstPlayer?: null | 0 | 1
  winner?: null | 0 | 1
  isDraw?: boolean

  hasStarted: boolean
  hasEnded: boolean
  lastUsed: Date
}

export type BoardDocument = HydratedDocument<Board>

// eslint-disable-next-line @typescript-eslint/ban-types
type BoardModel = Model<Board>


function playerValidator (value: null | number): boolean | undefined {
  return value == null || value === 0 || value === 1
}

const boardSchema = new Schema<Board, BoardModel>(
  {
    name: {
      type: String,
      trim: true,
      validate: /^[a-z\d]{3,32}$/i,
      lowercase: true,
      required: true,
      unique: true,
    },

    matrix: {
      type: [[Number]],
      required: true,
      default: genEmptyBoardMatrix,
      // only basic value validation is applied here
      // the complete game rules are implemented separately
      validate (matrix: BoardMatrix) {
        // could be a bit performance nick, but negligible for the size of the user-base
        return Array.isArray(matrix) && matrix.length === 3 
          && matrix.every(row => row.length === 3 && row.every(boxValue => [-1, 0, 1].includes(boxValue)))
      },
    },

    firstPlayer: {
      type: Number,
      required (this: BoardDocument) {
        return this.hasStarted
      },
      validate: playerValidator,
    },

    winner: {
      type: Number,
      validate: playerValidator,
    },

    isDraw: {
      type: Boolean,
    },

    lastUsed: {
      type: Date,
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      default: () => new Date(),
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      getters: true,
    },
    toObject: {
      getters: true,
      virtuals: true,
    },
  },
)

boardSchema.index( { lastUsed: -1 }, { expires: '3d' })

boardSchema.virtual('hasStarted').get(function (this: BoardDocument) {
  return this.matrix.some(row => row.some(value => value !== -1))
})

boardSchema.virtual('hasEnded').get(function (this: BoardDocument) {
  return this.winner != null || this.isDraw
})

boardSchema.pre('save',  function (this: BoardDocument) {
  if (this.isModified('matrix')) {
    this.lastUsed = new Date()

    // compute `isDraw` and `winner`
    if (!this.hasStarted) {
      // the game is reset back to initial state
      this.winner = null
      this.isDraw = false
    } else {
      const status = checkGameStatus(this)
      this.isDraw = status === 'draw'
      this.winner = status === 'draw' ? null : status
    }
  }
})

function checkGameStatus (board: BoardDocument): null | 0 | 1 | 'draw' {
  for (const player of [0, 1] as [0, 1]) {
    // check rows
    const inRow = board.matrix.some(row => row.every(value => value === player))
    if (inRow) {
      return player
    }

    // check cols
    let isCol = false
    for (let colIndex = 0; colIndex < 3; colIndex++) {
      const col = [
        board.matrix[0][colIndex],
        board.matrix[1][colIndex],
        board.matrix[2][colIndex],
      ]

      isCol = col.every(value => value === player)
      if (isCol) {
        break
      }
    }

    if (isCol) {
      return player
    }

    // check diagonals
    let isDiagonal = false
    const mainDiagonal = [board.matrix[0][0], board.matrix[1][1], board.matrix[2][2]]
    const subDiagonal = [board.matrix[0][2], board.matrix[1][1], board.matrix[2][0]]
    isDiagonal = mainDiagonal.every(value => value === player) ||
     subDiagonal.every(value => value ===player)

    if (isDiagonal) {
      return player
    }
  }

  // check for draw
  if (board.matrix.every(row => row.every(value => value !== -1))) {
    return 'draw'
  }

  return null
}

const BoardModel =  mongoose.model<Board, BoardModel>('Board', boardSchema, 'Boards')
export default BoardModel