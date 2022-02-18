import mongoose, { Schema, type HydratedDocument, type Model } from 'mongoose'
import type { BoardMatrix } from '@/types'
import { genEmptyBoardMatrix } from '@/util'

interface Board {
  name: string
  matrix: BoardMatrix
  lastUsed: Date
}

export type BoardDocument = HydratedDocument<Board>

// eslint-disable-next-line @typescript-eslint/ban-types
type BoardModel = Model<Board>


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
      validate (matrix: BoardMatrix) {
        // could be a bit performance neck, but negligible for the size of the user-base
        return Array.isArray(matrix) && matrix.length === 3 
          && matrix.every(row => row.length === 3 && row.every(boxValue => [-1, 0, 1].includes(boxValue)))
      },
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
  },
)


const BoardModel =  mongoose.model<Board, BoardModel>('Board', boardSchema, 'Boards')
export default BoardModel