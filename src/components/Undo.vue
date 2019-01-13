<template>
  <div
    class="toolbox-button"
    :name="name"
    @click="undoPaint()"
  >
    <Icon
      :name="name"
      :scale="1.8"
    />
  </div>
</template>
<script>
import 'vue-awesome/icons/undo'
import Icon from 'vue-awesome/components/Icon.vue'
export default {
  components: {
    Icon
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  methods: {
    undoPaint () {
      if (!this.$store.state.pixelCoordArray.length) {
        return
      }
      this.$root.$emit('undo-last')
    }
  }
}
</script>
<style lang="stylus" scoped>
svg
  fill #999
  margin-bottom 2px
  text-align center
</style>
