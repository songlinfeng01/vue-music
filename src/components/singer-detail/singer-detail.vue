<template>
  <transition name="slide">
    <music-list :title="title" :songList="songList"  :bgImage="bgImage"></music-list>
  </transition>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getSingerDetailList} from "api/singer"
  import {ERR_OK} from "api/config"
  import {getSongVkey} from 'api/song'
  import {createSong} from "common/js/song"
  import MusicList from 'components/music-list/music-list'

  export default {
    computed: {
      ...mapGetters([
        'singer'
      ]),
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      }
    },
    data() {
      return {
        songList: []
      }
    },
    created() {
      this._getSingerDetailList(this.singer.id)
    },
    methods: {
      /**
       * 根据歌手id获取歌手的详细信息  详细信息里面有歌手的所有歌曲信息
       * @param singerId
       * @private
       */
      _getSingerDetailList(singerId) {
        if (!this.singer.id) {
          this.$router.push({
            path: '/singer'
          })
        }
        getSingerDetailList(singerId).then(res => {
          if (res.code === ERR_OK) {
            this.songList = this._formatSongs(res.singer.data.songlist)
            // console.log(res.singer.data.songlist)
            // console.log(this.singer)
          }
        })
      },
      /**
       *
       * 通过歌曲列表返回符合数据结构的songlist
       * @param list  每一个歌手的歌曲列表
       * @returns {Array}
       * @private
       */
      _formatSongs(list) {
        let result = []
        list.forEach(item => {
          getSongVkey(item.file.media_mid).then(res => {
            if (res.code === 0) {
              // const vkey = res.req_0.data.midurlinfo[0].vkey
              // this.songVkey.push(vkey)
              // console.log(res.data.items[0].vkey)
              const vkey = res.data.items[0].vkey
              result.push(createSong(item, vkey))
            }
          })
        })

        return result
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slide-enter-active, .slide-leave-active
    transition: all 1s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)

</style>
