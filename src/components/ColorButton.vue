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
  box-sizing border-box
  box-shadow #999 3px 3px 5px
  border 1px #888
  border-radius 4px
  border-style solid
  display inline-block
  height 30px
  width 30px
  opacity .6
  &:hover
    border 1px #777
    border-style solid
    opacity 1
    cursor pointer
</style>
