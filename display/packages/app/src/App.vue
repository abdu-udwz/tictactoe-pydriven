<template>
  <VApp>
    <TheAppBar />
    <VMain>
      <VContainer 
        fluid
        class="d-flex justify-center"
        :style="$vuetify.application.height"
      >
        <VRow justify="center">
          <!-- join/leave form -->
          <VCol cols="12">
            <VCard
              max-width="50vw"
              class="mx-auto"
            >
              <VForm
                v-if="board == null"
                ref="joinForm"
                @submit.prevent="onJoin"
              >
                <VCardTitle tag="h2">
                  <VTextField
                    v-model="boardName"
                    label="Room"
                    :rules="[rules.boardName]"
                    validate-on-blur
                    :disabled="loadingBoard"
                  />
                </VCardTitle>
                <VCardSubtitle>
                  <VBtn 
                    type="submit"
                    block
                    color="primary"
                    :loading="loadingBoard"
                    :disabled="loadingBoard"
                  >
                    <span>Join game</span>
                    <VIcon>mdi-</VIcon>
                  </VBtn>
                </VCardSubtitle>
              </VForm>
              <div
                v-else
              >
                <VBtn
                  color="primary"
                  block
                  @click="onLeave"
                >
                  <span>Leave game</span>
                  <VIcon right>
                    mdi-logout
                  </VIcon>
                </VBtn>
              </div>
            </VCard>
          </VCol>
          <!-- game board -->
          <VCol
            cols="12"
            sm="6"
            md="5"
          >
            <VCard
              v-show="loadingBoard || board != null"
              :disabled="loadingBoard" 
              flat
            >
              <VCardText>
                <VProgressCircular 
                  v-if="loadingBoard"
                  indeterminate
                  size="96"
                />
                <GameBoard
                  v-if="!loadingBoard && board != null"
                  :value="board.matrix"
                />
                <VOverlay
                  v-if="board != null && board.hasEnded"
                  absolute
                  opacity="0.7"
                  z-index="2"
                >
                  <section class="d-flex flex-column align-center">
                    <!-- win -->
                    <h2 
                      v-show="board.winner != null"
                      class="text-center"
                    >
                      <span 
                        class="board-option-text text-h1"
                        :class="board.winner === 0 ? 'oh' : 'ex'"
                      >{{ board.winner === 0? 'O' : 'X' }}</span>
                      <br>
                      <span class="text-h5 font-weight-bold">WINS</span>
                    </h2>
                    <!-- draw -->
                    <h2
                      v-show="board.isDraw"
                      class="is-draw-text text-h2"
                    >
                      DRAW
                    </h2>
                    <VBtn
                      text
                      class="mt-12 text-body-2"
                      @click="onRestart"
                    >
                      <VIcon left>
                        mdi-restart
                      </VIcon>
                      <span>Restart game</span>
                    </VBtn>
                  </section>
                </VOverlay>     
              </VCardText>
            </VCard>

            <VBtn
              v-if="board != null && !board.hasEnded"
              text
              block
              class="mt-4"
              @click="onRestart"
            >
              <VIcon left>
                mdi-restart
              </VIcon>
              <span>Restart game</span>
            </VBtn>

            <VAlert 
              v-if="unknownError != null"
              text 
              prominent
              type="error"
            >
              <p>
                An unknown error occurred. Please check your internet connection and try again.
                <br>
                <br>
                If the error persists try refreshing the page or contact the developer.
              </p>
            </VAlert>
          </VCol>
        </VRow>
      </VContainer>
    </VMain>
    <!-- on-the-fly notifications -->
    <VSnackbar 
      v-model="notificationsBar.value"
      text
      app
      timeout="2000"
      color="error"
    >
      {{ notificationsBar.text }}
    </VSnackbar>
  </VApp>
</template>

<script lang="ts">
// vue
import Vue from 'vue'
// components
import TheAppBar from '@/components/TheAppBar.vue'
import GameBoard from '@/components/Board.vue'
// services
import * as boardsService from '@/services/boards'
import socketService from '@/services/socket'
// types
import type { Board } from '@/types'

const boardNameRegex = /^[a-z\d]{3,32}$/i

const BOARD_NAME_STORAGE_KEY = 'tttPyBoard'

export default Vue.extend({
  name: 'App',
  components: { TheAppBar, GameBoard },
  data () {
    return {
      // the form field model
      boardName: '',
      // the actual board
      board: null as null | Board,

      loadingBoard: false,

      unknownError: null as any,

      notificationsBar: {
        value: false,
        text: '',
      },
      boardError: null as null | string,

      rules: {
        boardName (val?: string): string | boolean {
          if (val != null) {
            return boardNameRegex.test(val) 
              ? true 
              : 'Please enter 3-32 characters, only digits and letters are allowed'
          }
          return ''
        },
      },
    }
  },

  computed: {
    error (): any {
      return this.unknownError ?? null
    },
  },

  watch: {
    board: {
      deep: false,
      async handler (value: Board | null) {
        if (value == null) {
          socketService.disconnect()
        } else {
          socketService.connect()
        }
      },
    },
  },

  created () {
    this.boardName = localStorage.getItem(BOARD_NAME_STORAGE_KEY) ?? ''

    socketService.removeAllListeners()

    socketService.on('boardUpdate', (board: Board) => {
      if (this.board == null) {
        return
      }

      this.$set(this, 'board', board)
    })
    
    socketService.on('boardUpdateError', (error: string) => {
      // console.log('received an update error to board', error)
      let errorText = 'Unknown error occurred'
      switch (error) {
        case 'BAD_MOVE':
          errorText = 'Invalid move. Only one box can be updated each time.'
          break
        case 'BOX_OCCUPIED':
          errorText = 'Box already occupied. You cannot overwrite a box.'
          break
        case 'GAME_ENDED':
          errorText = 'Game has already ended. Please restart game.'
          break
        case 'OTHER_PLAYER_ROLE':
          errorText = 'It\'s not your role.'
          break
      }

      this.notificationsBar.text = errorText
      this.notificationsBar.value = true
    })

    socketService.on('connect', () => {
      // this is fired for reconnection as well
      // the user could have lost connection for a second while playing
      if (this.board?.name != null) {
        this.joinBoardRoom()
      }
    })
  },

  methods: {
    async onJoin () {
      console.log('join game')
      // @ts-expect-error
      if (!this.$refs.joinForm?.validate()) {
        console.log('invalid form')
        return
      }
      try {
        this.loadingBoard = true
        const success = await this.fetchBoardData(false)
        if (!success) {
          // try to create the room
          console.log('New board, send create request...')
          const res = await boardsService.createOne({
            name: this.boardName,
          })
          this.board = res.data
        }
        this.updateCachedName(this.board?.name ?? '')
      } catch (error: any) {
        this.unknownError = error
      } finally {
        this.loadingBoard = false
      }
    },

    onLeave () {
      this.board = null
    },

    async onRestart () {
      try {
        this.unknownError = null
        this.loadingBoard = true
        const res = await boardsService.resetOne(this.board?.name ?? '')
        this.board = res.data
      } catch (error: any) {
        this.unknownError = error
      } finally {
        this.loadingBoard = false
      }
    },

    async fetchBoardData (showError=false): Promise<boolean> {
      try {
        this.loadingBoard = true
        const res = await boardsService.getOne(this.boardName)
        this.board = res.data
        this.loadingBoard = false
        this.unknownError = null
        return true
      } catch (error: any) {
        if (showError) {
          this.unknownError = error
        }
        this.loadingBoard = false
        return false
      }
    },

    updateCachedName (name: string): void {
      localStorage.setItem(BOARD_NAME_STORAGE_KEY, name)
    },

    // socket-related
    joinBoardRoom (): void {
      if (this.board == null) {
        return 
      }
      socketService.emit('joinRoom', this.board.name, (error: any, joined: boolean) => {
        if (error != null || !joined) {
          console.log('could not join game room', error)
        } else {
          console.log('join game room successfully')      
        }
      })
    },
  },
})
</script>

<style scoped>
.is-draw-text {
  color: orange
}
</style>>
