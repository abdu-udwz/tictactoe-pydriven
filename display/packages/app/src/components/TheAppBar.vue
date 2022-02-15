<script lang="ts">
// vue
import Vue from 'vue'

export default Vue.extend({
  computed: {
    themeIcon (): string {
      return this.$vuetify.theme.dark ? 'mdi-weather-night' : 'mdi-white-balance-sunny'
    },
  },
})
</script>

<template>
  <VAppBar app>
    <VToolbarTitle>TicTacToe Py-Driven</VToolbarTitle>
    <VSpacer />
    <VBtn 
      icon
      @click="$vuetify.theme.dark = !$vuetify.theme.dark"
    >
      <VIcon v-text="themeIcon" />
    </VBtn>
  </VAppBar>
</template>