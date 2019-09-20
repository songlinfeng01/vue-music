import {playMode} from 'common/js/config'
import {getSearchHistory, loadPlayhistory, loadFavoriteList} from "common/js/cache";

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  mode: playMode.sequence,
  sequenceList: [],
  currentIndex: -1,
  disc: {},
  topList: {},
  searchHistory: getSearchHistory(),
  playHistory: loadPlayhistory(),
  favoriteList: loadFavoriteList()
}

export default state
