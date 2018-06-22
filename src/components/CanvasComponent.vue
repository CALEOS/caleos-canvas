<template>
  <div id="canvas">
    <h1>Canvas{{ $place.placeTest() }}!</h1>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
