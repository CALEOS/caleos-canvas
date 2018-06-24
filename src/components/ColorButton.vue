<template>
  <div
    id="color-button"
    :class="color" >
    <h1>{{ color }}</h1>
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
