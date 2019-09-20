import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from "common/js/config"
import {shuffle} from "common/js/util"

/**
 * 设置列表距离底部的距离的公用代码
 * @type {{computed: {[p: string]: Computed}, mounted(): void, activated(): void, watch: {playList(*=): void}, methods: {handlePlayList(*): void}}}
 */
export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlayList(this.playList)
  },
  activated() {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal)
    }
  },
  methods: {
    handlePlayList(playList) {
      throw new Error('component must implement handlePlaylist method')
    }

  }
}

/**
 * 设置播放模式的公用列表
 * @type {{computed: {iconMode(): *, [p: string]: Computed}, methods: {[p: string]: MutationMethod, changeMode(): void, _setCurrentIndex(*): void}}}
 */
export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'playList',
      'currentSong',
      'mode',
      'favoriteList'
    ]),
  },

  methods: {
    ...mapMutations({
      setPlayState: 'SET_PLAY_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'deleteFavoriteList',
      'saveFavoriteList'
    ]),
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setMode(mode)
      let list = null
      if (this.mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      // 设置当前歌曲索引
      this._setCurrentIndex(list)
      this.setPlayList(list)
    },
    _setCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getFavoriteIcon(currentSong) {
      if (this.isFavorite(currentSong)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    toggleFavorite(currentSong){
      if (this.isFavorite(currentSong)) {
        this.deleteFavoriteList(currentSong)
      } else {
        this.saveFavoriteList(currentSong)
      }
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex(item => {
        return item.id === song.id
      })

      return index > -1
    },
  }
}


export const searchMixin = {
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  data() {
    return {
      query: ''
    }
  },
  methods: {
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ]),
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
    addQuery(query) {
      this.$refs.search.setQuery(query)
    }
  }
}
