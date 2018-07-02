<template>
  <div
    id="color-button"
    :class="[color,{active: isActive}]"
    @click="triggerEvent()"
  >
    <h1/>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: true
    },
    hex: {
      type: String,
      required: true
    }
  },
  computed: {
    isActive: function () { return this.color != null ? this.color === this.$store.state.activeColorName : false }
  },
  methods: {
    triggerEvent: function (event) {
      if (this.$store.state.activeColorName === this.color) {
        this.$store.commit('setActiveColorName', null)
        this.$store.commit('setActiveColorHex', null)
      } else {
        this.$store.commit('setActiveColorName', this.color)
        this.$store.commit('setActiveColorHex', this.hex)
        console.log('Color: ' + this.$store.state.activeColorName + '\nHex: ' + this.$store.state.activeColorHex)
      }
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
  &.active
    border 1px #777
    border-style solid
    opacity 1
    cursor pointer
</style>
