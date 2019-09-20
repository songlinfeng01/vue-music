<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bgImage="bgImage" :songList="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getMusicList} from "api/rank"
  import {ERR_OK} from "api/config"
  import {createTopListSong} from "common/js/song";
  import {getSongVkey} from "api/song";

  export default {
    components: {
      MusicList
    },
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    computed: {
      ...mapGetters([
        'topList'
      ]),
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        if (this.songs.length) {
          return this.songs[0].image
        }
        // return this.topList.picUrl
        return ''
      }

    },
    created() {
      this._getMusicList(this.topList.id)
    },
    methods: {
      _getMusicList(topid) {
        if (!this.topList.id) {
          this.$router.push({
            path: '/rank'
          })

          return
        }
        getMusicList(topid).then(res => {
          if (res.code === ERR_OK) {
            // this.res
            this.songs = this._formatSong(res.songlist)
            // console.log(this.songs)
          }
        })
      },
      _formatSong(list) {
        let result = []
        list.forEach(item => {
          const musicData = item.data
          // console.log(musicData)
          if (musicData.albumid && musicData.songid) {
            getSongVkey(musicData.songmid).then(res => {
              if (res.code === ERR_OK) {
                const vkey =res.data.items[0].vkey
                result.push(createTopListSong(musicData, vkey))
              }
            })

          }
        })
        // console.log(result)
        return result
      }
    }
  }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
