import * as types from './mutation-types'
import {playMode} from "common/js/config"
import {shuffle} from "common/js/util"
import {saveSearch, deleteSearch, deleteAll, savePlayhistory, saveFavorite, deleteFavorite} from "common/js/cache";


/**
 *
 * @param list 数组
 * @param song 目标数据
 * @returns {*|number} 符合条件的index
 */
function getIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}


/**
 * 设置选择播放
 * @param commit
 * @param state
 * @param list
 * @param index
 */
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = getIndex(list, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAY_STATE, true)
}

/**
 * 设置随机播放
 * @param commit
 * @param list
 */
export function randomPlay({commit}, {list}) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_MODE, playMode.random)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAY_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
}

/**
 * 插入歌曲
 * 修改currenIndex playList sequenceList三个数据
 * @param commit
 * @param state
 * @param song
 */
export const insertSong = function ({commit, state}, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playList[currentIndex]
  // 查找当前列表中是否含有待插入的歌曲并返回其索引
  let index = getIndex(playList, song)
  // 因为是插入歌曲，索引索引加1
  currentIndex++
  playList.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌 则需要删除原来位置的歌
  if (index > -1) {
    if (currentIndex > index) {
      playList.splice(index, 1)
      currentIndex--
    } else {
      playList.splice(index + 1, 1)
    }
  }

  let currentSIndex = getIndex(sequenceList, currentSong) + 1
  let sIndex = getIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)

  if (sIndex > -1) {
    if (currentSIndex > sIndex) {
      sequenceList.splice(sIndex, 1)
    } else {
      sequenceList.splice(sIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAY_STATE, true)
  commit(types.SET_FULL_SCREEN, true)

}

/**
 * 保存本地数据到state
 * @param commit
 * @param state
 * @param query
 */
export const saveSearchHistory = function ({commit, state}, query) {

  commit(types.SET_SEARCH_HISTORY, saveSearch(query))

}

/**
 * 删除选中的query历史选项
 * @param commit
 * @param query
 */
export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

/**
 * 删除所有歌曲
 * @param commit
 */
export const deleteAllHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, deleteAll())
}

/**
 * 删除播放列表中的一首歌曲
 * @param commit
 * @param state
 * @param song
 */
export const deleteSong = function ({commit, state}, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = getIndex(playList, song)
  playList.splice(pIndex, 1)

  let sIndex = getIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  if (currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--
  }
  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  // 删完了就讲播放状态变为false
  const playingState = playList.length > 0

  commit(types.SET_PLAY_STATE, playingState)


}

/**
 * 删除播放列表中的所有歌曲
 * @param commit
 */

export const deleteSongList = function ({commit}) {

  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAY_STATE, false)
  commit(types.SET_CURRENT_INDEX, -1)

}


export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlayhistory(song))
}

/**
 * 保存喜欢的歌曲
 * @param commit
 * @param song
 */
export const saveFavoriteList = function ({commit}, song) {
    commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function ({commit}, song) {
    commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
