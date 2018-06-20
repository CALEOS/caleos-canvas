<template>
  <div id="header">
    <h1>Header {{ name }}!</h1>
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
