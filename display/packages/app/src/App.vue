<template>
  <VApp>
    <TheAppBar />
    <VMain>
      <VContainer 
        fluid
        class="d-flex justify-center"
        :style="$vuetify.application.height"
      >
        <!-- join/leave form -->
        <VRow justify="center">
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
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VContainer>
    </VMain>
    <VFooter app>
      {{ error }}
    </VFooter>
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

      fetchError: null as any,

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
      return this.fetchError ?? null
    },
  },

  created () {
    this.boardName = localStorage.getItem(BOARD_NAME_STORAGE_KEY) ?? ''
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
        this.fetchError = error
      } finally {
        this.loadingBoard = false
      }
    },

    onLeave () {
      this.board = null
    },

    async fetchBoardData (showError=false): Promise<boolean> {
      try {
        this.loadingBoard = true
        const res = await boardsService.getOne(this.boardName)
        this.board = res.data
        this.loadingBoard = false
        return true
      } catch (error: any) {
        if (showError) {
          this.fetchError = error
        }
        this.loadingBoard = false
        return false
      }
    },

    updateCachedName (name: string): void {
      localStorage.setItem(BOARD_NAME_STORAGE_KEY, name)
    },
  },
})
</script>

<style>
</style>
