<template>
  <div
    id="coordinates"
    class="white-text"
  >
    X:
    <span
      id="x-coord"
      class="white-text"
    >
      {{ xCoord }}
    </span>
    Y:
    <span
      id="y-coord"
      class="white-text"
    >
      {{ yCoord }}
    </span>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      xCoord: 'mouseX',
      yCoord: 'mouseY'
    })
  }
}
</script>
<style lang="stylus" scoped></style>
