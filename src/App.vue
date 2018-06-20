<template>
  <div class="app-container">
    <header-component name="" />
    <canvas-component name=" pixels" />
    <footer-component name="" />
  </div>
</template>

<script>
import HeaderComponent from './components/HeaderComponent.vue'
import CanvasComponent from './components/CanvasComponent.vue'
import FooterComponent from './components/FooterComponent.vue'

export default {
  components: {
    HeaderComponent,
    CanvasComponent,
    FooterComponent
  }
}
</script>
