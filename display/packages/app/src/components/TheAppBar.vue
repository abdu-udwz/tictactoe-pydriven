<script lang="ts">
// vue
import Vue from 'vue'

const COLOR_MODE_STORAGE_KEY = 'tttPyColorMode'

export default Vue.extend({
  computed: {
    themeIcon (): string {
      return this.$vuetify.theme.dark ? 'mdi-weather-night' : 'mdi-white-balance-sunny'
    },
  },

  watch: {
    '$vuetify.theme.dark' (value) {
      localStorage.setItem(COLOR_MODE_STORAGE_KEY, value)
    },
  },

  created () {
    const storageValue =  localStorage.getItem(COLOR_MODE_STORAGE_KEY) ?? 'true'
    this.$vuetify.theme.dark = storageValue === 'true'
  },
})
</script>

<template>
  <VAppBar app>
    <VToolbarTitle>TicTacToe Py-Driven</VToolbarTitle>
    <VSpacer />
    <VToolbarItems>
      <VBtn 
        icon
        @click="$vuetify.theme.dark = !$vuetify.theme.dark"
      >
        <VIcon v-text="themeIcon" />
      </VBtn>
    </VToolbarItems>
  </VAppBar>
</template>