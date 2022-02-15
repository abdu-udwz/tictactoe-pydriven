<template>
  <VApp>
    <TheAppBar />
    <VMain>
      <VContainer 
        fluid
        class="d-flex justify-center"
      >
        <VCard>
          <VForm
            @submit.prevent="onSubmit"
          >
            <VCardTitle tag="h2">
              <VTextField
                v-model="roomName"
                label="Room"
                :rules="[rules.roomName]"
                validate-on-blur
              />
            </VCardTitle>
            <VCardSubtitle>
              <VBtn 
                type="submit"
                block
                color="primary"
              >
                <span>Join room</span>
                <VIcon>mdi-</VIcon>
              </VBtn>
            </VCardSubtitle>
          </VForm>
        </VCard>
      </VContainer>
    </VMain>
  </VApp>
</template>

<script lang="ts">
// vue
import Vue from 'vue'
// components
import TheAppBar from '@/components/TheAppBar.vue'

const roomNameRegex = /^[a-z\d]{3,32}$/i

export default Vue.extend({
  name: 'App',
  components: { TheAppBar },
  data () {
    return {
      roomName: '',
      rules: {
        roomName (val?: string): string | boolean {
          if (val != null) {
            return roomNameRegex.test(val) 
              ? true 
              : 'Please enter 3-32 characters, only digits and letters are allowed'
          }
          return ''
        },
      },
    }
  },

  methods: {
    onSubmit () {
      console.log('hey you', this.roomName)
    },
  },
})
</script>

<style>
</style>
