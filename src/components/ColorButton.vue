<template>
  <div id="color-button">
    <h1>Color:{{ color }}</h1>
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

</style>
