<template>
  <div id="tool">
    <h1>Tool: {{ name }}!</h1>
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
