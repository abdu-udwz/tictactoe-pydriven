<script lang="ts">
// vue
import Vue from 'vue'
import type { PropType } from 'vue'

interface Box {
  value: -1 | 0 | 1
  displayValue: string
  coordinate: [number, number]
}

function parseRawBox (value: -1 | 1 | 0): Box {
  const box: Box = {
    value,
    displayValue: '',
    coordinate: [0, 0],
  }

  if (value === 0) {
    box.displayValue = 'O'
  } else if (value === 1) {
    box.displayValue = 'X'
  }

  return box
}

export default Vue.extend({
  name: 'GameBoard',
  props: {
    // @ts-expect-error
    value: {
      type: Array,
      required: true,
    } as PropType<Array<Array<Box['value']>>>,
  }, 

  computed: {
    internalMatrix (): Box[]{
      const boxes: Box[] = []
      for (let rowIndex = 0; rowIndex < this.value.length; rowIndex++ ) {
        const row = this.value[rowIndex]
        for (let colIndex = 0; colIndex< row.length; colIndex++) {
          const rawBox = row[colIndex]
          const parsedBox = parseRawBox(rawBox)
          parsedBox.coordinate = [rowIndex, colIndex]
          boxes.push(parsedBox)
        }
      }
      return boxes
    },
  },
})
</script>

<template>
  <div class="game-board-container">
    <VCard
      class="game-board"
      flat
    >
      <VCard 
        v-for="(box, index) of internalMatrix"
        :key="index"
        class="game-board__box d-flex justify-center align-center pa-2 pa-md-4"
        flat
      >
        <span
          class="game-board__box-text board-option-text text-h3 text-md-h2"
          :class="[box.value === -1 ? 'empty' : box.value === 0 ? 'oh' : 'ex']"
          v-text="box.displayValue"
        />
        <span class="game-board__box-index text-caption">{{ box.coordinate[0] + 1 }}/{{ box.coordinate[1] + 1 }}</span>
      </VCard>
    </VCard>
  </div>
</template>

<style scoped>
.game-board-container {
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  position: relative; /* If you want text inside of it */
}

.game-board {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template: repeat(3, 1fr)/ repeat(3, 1fr);
  gap: 5px;
}

.game-board__box {
  box-shadow: inset 0px 2px 10px rgb(0, 0, 0, 15%) !important;
  position: relative;
}

.game-board__box-index {
  position: absolute;
  width: 100%;
  bottom: 3px;
  left: 50%;
  opacity: 0.4;
}

</style>