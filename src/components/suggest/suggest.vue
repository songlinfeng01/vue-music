<template>
  <scroll ref="scroll" :pullup="pullup" :data="result" class="suggest" @scrollToEnd="getMore"
          :beforeScroll="beforeScroll" @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li class="suggest-item" @click="selectItem(item)" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="searchMore" title=""></loading>
    </ul>
    <div v-show="!searchMore && result.length===0" class="no-result-wrapper">
      <no-result title="抱歉，没有找到相关数据"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from "api/search"
  import {ERR_OK} from "api/config"
  import {createTopListSong} from "common/js/song"
  import {getSongVkey} from "api/song"
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {mapActions, mapMutations} from 'vuex'
  import NoResult from 'base/no-result/no-result'
  import Singer from 'common/js/singer'

  const perpage = 20
  const TYPE_SINGER = 'singer'


  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        pullup: true,
        searchMore: true,
        beforeScroll: true
      }
    },
    methods: {
      refresh() {
        this.$refs.scroll.refresh()
      },
      listScroll() {
        this.$emit('listScroll')
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ]),
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singerMID,
            name: item.singerName
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
        // 点击时派发一个事件  存储数据到本地
        this.$emit('select', item)
      },
      getMore() {
        if (this.searchMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then(res => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._formatData(res.data.song.list))
            this.checkMore(res.data)
          }
          // console.log(this.result)
        })
      },
      _search() {
        // 改变query后 page也要重置
        this.page = 1
        this.$refs.scroll.scrollTo(0, 0)
        this.searchMore = true
        search(this.query, this.page, this.showSinger, perpage).then(res => {
          if (res.code === ERR_OK) {
            // console.log(res)
            this.result = this._formatData(res.data)
            // console.log(this.result)
            this.checkMore(res.data)
          }
        })
      },
      checkMore(data) {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * perpage) > song.list.length) {
          this.searchMore = false
        }
      },
      _formatData(data) {
        let ret = []
        if (data.zhida && data.zhida.zhida_singer) {
          ret.push({...data.zhida.zhida_singer, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach(item => {
          if (item.songid && item.albumid) {
            // getSongVkey(item.songmid).then(res => {
            //   const vkey = res.data.items[0].vkey
            //
            // })
            ret.push(createTopListSong(item))
          }
        })
        return ret
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singerName
        } else {
          return `${item.name} - ${item.singer}`
        }

      },
      getIconCls(item) {
        if (item.type === 'singer') {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      }
    },
    watch: {
      query() {
        this._search()
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden

    .suggest-list
      padding: 0 30px

      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px

      .icon
        flex: 0 0 30px
        width: 30px

        [class^="icon-"]
          font-size: 14px
          color: $color-text-d

      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden

        .text
          no-wrap()

    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)


</style>
