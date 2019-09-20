<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songList="songs"></music-list>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getSongList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import {getDiscSongVkey} from 'api/song'
  export default {
    computed: {
      ...mapGetters(['disc']),
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      }
    },
    components: {
      MusicList
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getSongList()
    },
    methods: {
      _getSongList() {
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }
        getSongList(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            // console.log(res.cdlist[0].songlist)
            this.songs = this._formatSongs(res.cdlist[0].songlist)
            // console.log(this.songs)
          }
        })
      },
      _formatSongs(list) {
        let result = []
        list.forEach((item) => {
          getDiscSongVkey(item.mid).then((res) => {
            if (res.code === 0) {
              // const vkey = res.req_0.data.midurlinfo[0].vkey
              // this.songVkey.push(vkey)
              // console.log(res)
              const vkey = res.req_0.data.midurlinfo[0].vkey
              result.push(createSong(item, vkey))
            }
          })
        })

        return result
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)


</style>
