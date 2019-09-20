<template>
  <div class="recommend" ref="recommend">
    <!--discList是后渲染出来的数据 在调用refresh方法时就可以计算到轮播图的高度了-->
    <scroll class="recommend-content" ref="scroll" :data="discList">
      <div>
        <!--轮播图-->
        <div class="recommend-content">
          <div class="slider-wrapper">
            <slider :recommendList="recommendList"></slider>
          </div>
        </div>
        <!--热门歌单推荐-->
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" v-for="item in discList" class="item" :key="item.imgurl">
              <div class="icon">
                <img @load="loadImg" width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <!--歌单列表未加载时的显示内容 -->
        <loading></loading>
      </div>
    </scroll>

    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getRecommend, getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import Slider from 'base/slider/slider'
  import {Toast} from 'mint-ui'
  import Loading from 'base/loading/loading'
  import {playlistMixin} from "common/js/mixin"
  import {mapMutations} from 'vuex'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        recommendList: [],
        discList: []
      }
    },
    created() {
      this._getRecommend()
      this._getDiscList()
    },
    methods: {
      ...mapMutations({
        setDisc: 'SET_DISC'
      }),
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
      },
      handlePlayList(playList) {
        let bottom = playList.length > 0 ? '60px' : 0
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      _getRecommend() { // 获取轮播数据
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommendList = res.data.slider
          } else {
            Toast('加载轮播图失败')
          }
        })
      },
      _getDiscList() { // 获取歌单页列表
        getDiscList().then(res => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      loadImg() {
        if (!this.checkLoaded) { // 当图片渲染完成后，在调用scroll组件的刷新方法计算滚动高度，这样就不会产生轮播图还没渲染就调用refresh
          this.$refs.scroll.refresh()
          this.checkLoaded = true
        }
      }
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  image[lazy=loading]
    width 40px
    height 300px
    margin auto

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0px
    .recommend-content
      height: 100%
      overflow: hidden
    .recommend-list
      .list-title
        height: 65px
        line-height: 65px
        text-align: center
        font-size: $font-size-medium
        color: $color-theme
      .item
        display: flex
        box-sizing: border-box
        align-items: center
        padding: 0 20px 20px 20px
        .icon
          flex: 0 0 60px
          width: 60px
          padding-right: 20px
        .text
          display: flex
          flex-direction: column
          justify-content: center
          flex: 1
          line-height: 20px
          overflow: hidden
          font-size: $font-size-medium
          .name
            margin-bottom: 10px
            color: $color-text
          .desc
            color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
