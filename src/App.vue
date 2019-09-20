<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <router-view></router-view>
    <music-player></music-player>
  </div>
</template>

<script>

import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import MusicPlayer from 'components/music-player/music-player'
export default {
  name: 'App',
  components:{
      MHeader,
      Tab,
      MusicPlayer
  }
}
</script >

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
