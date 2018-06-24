<template>
  <div id="header">
    <h1>Header {{ color }}!</h1>
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
