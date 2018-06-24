<template>
  <div
    id="color-button"
    :class="color" >
    <h1/>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="stylus" scoped>
#color-button
  height 30px
  width 30px
  display inline-block
</style>
