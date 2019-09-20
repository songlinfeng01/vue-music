<template>
  <div class="singer" ref="singer">
    <list-view @select="selectSinger" :data="singerList" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import getPy from 'common/js/getFirstCharacter'
  import ListView from 'base/listview/listview'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from "common/js/mixin";

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10 // 定义前10条都是热门歌手


  export default {
    mixins: [playlistMixin],
    data() {
      return {
        singerList: []
      }
    },
    mounted() {
      this._getSingerList()
    },
    methods: {
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? '60px' : 0
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      _getSingerList() {
        getSingerList().then(res => {
          if (res.code === ERR_OK) {
            //console.log(res.singerList.data.singerlist)
            this.singerList = res.singerList.data.singerlist
            this.singerList.forEach((item, index) => {
              // 给singerList添加一个Findex属性方便后面按歌手首字母分类
              item.Findex = getPy(item.singer_name).slice(0, 1)
            })

            this.singerList = this._normalizeSinger(this.singerList)
            // console.log(this.singerList)
          }
        })
      },
      _normalizeSinger(list) {  // 将请求到的歌手数据处理为需要的数据结构  二维数组  外层为热门 内层为歌手数据
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }

        // 遍历数组将数据填充至item中
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push({
              id: item.singer_mid,
              name: item.singer_name,
              avatar: item.singer_pic
            })
          }

          const key = item.Findex

          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }

          map[key].items.push({
            id: item.singer_mid,
            name: item.singer_name,
            avatar: item.singer_pic
          })
        })

        // console.log(map)
        // 为了得到有序数组我们要处理map
        let hot = []
        let res = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            res.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }

        // 对res进行排序
        res.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })

        return hot.concat(res)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      ListView
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
