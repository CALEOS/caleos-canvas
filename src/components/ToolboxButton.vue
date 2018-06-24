<template>
  <div id="toolbox-button">
    <!-- <icon {{ name }} scale="2" ></icon> -->
    <h1>Tool: {{ name }}</h1>
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
