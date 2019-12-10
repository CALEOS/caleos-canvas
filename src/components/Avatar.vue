<template>
  <v-avatar>
    <v-img :src="imgSrc" />
  </v-avatar>
</template>

<script>
import Identicon from 'identicon.js'
const md5 = require('md5')

export default {
  name: 'Avatar',
  props: {
    accountName: String,
    avatarUrl: String
  },
  data () {
    return {
      imgSrc: ''
    }
  },
  created () {
    if (!this.avatarUrl) {
      let hash = md5(this.accountName)
      let identicon = new Identicon(hash, 400).toString()
      this.imgSrc = `data:image/png;base64,${identicon}`
    } else {
      this.imgSrc = this.avatarUrl
    }
  }
}
</script>
