<template>
  <div class="app-container">
    <header-container name=""/>
    <canvas-container name=" pixels" />
    <footer-container name="" />
  </div>
</template>

<script>

import HeaderContainer from './components/Header.vue'
import CanvasContainer from './components/Canvas.vue'
import FooterContainer from './components/Footer.vue'

export default {
  components: {
    HeaderContainer,
    CanvasContainer,
    FooterContainer
  }
}
</script>
