<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box @query="onQueryChange" ref="search"></search-box>
    </div>

    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll :refreshDelay="refreshDelay" :data="shortcut" class="shortcut" ref="scroll">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="item in hotKeyList">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>

          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click.stop="showConfirm">
               <i class="icon-clear"></i>
            </span>
            </h1>
            <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>

    <div ref="searchResult" class="search-result" v-show="query">
      <suggest ref="suggest" @select="selectItem" @listScroll="blurInput" :query="query"></suggest>
    </div>

    <confirm ref="confirm" confirmText="清空" @confirmOperate="deleteAllHistory" :text="title"></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import {getHotKey} from "api/search"
  import {ERR_OK} from "api/config"
  import Suggest from 'components/suggest/suggest'
  import {mapActions, mapGetters} from 'vuex'
  import SearchList from 'base/search-list/search-list'
  import Confirm from 'base/confirm/confirm'
  import Scroll from 'base/scroll/scroll'
  import {playlistMixin} from 'common/js/mixin'


  export default {
    mixins: [playlistMixin],
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll
    },
    created() {
      this._getHotKey()
    },
    data() {
      return {
        hotKeyList: [],
        query: '',
        title: '是否清空历史记录',
        refreshDelay: 100

      }
    },
    watch: {
      query(newval) {
        if (!newval) {
          setTimeout(() => {
            this.$refs.scroll.refresh()
          }, 20)
        }
      }
    },
    computed: {
      shortcut() {
        return this.hotKeyList.concat(this.searchHistory)
      },
      ...mapGetters([
        'searchHistory'
      ])
    },
    methods: {
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? '60px' : 0
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.scroll.refresh()
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()
      },
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',
        'deleteAllHistory'
      ]),
      // deleteQuery(query) {
      //   this.deleteSearchHistory(query)
      // },
      showConfirm() {
        this.$refs.confirm.show()
      },
      selectItem() {
        this.saveSearchHistory(this.query)
      },
      // 收起移动端的输入法
      blurInput() {
        this.$refs.search._blur()
      },
      onQueryChange(query) {
        this.query = query
      },
      _getHotKey() {
        getHotKey().then(res => {
          if (res.code === ERR_OK) {
            this.hotKeyList = res.data.hotkey.slice(0, 10)
          }
        })
      },
      addQuery(query) {
        this.$refs.search.setQuery(query)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px

    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%

      .shortcut
        height: 100%
        overflow: hidden

        .hot-key
          margin: 0 20px 20px 20px

          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l

          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d

        .search-history
          position: relative
          margin: 0 20px

          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l

            .text
              flex: 1

            .clear
              extend-click()

              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d

    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
