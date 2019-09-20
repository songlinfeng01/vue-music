import storage from 'good-storage'

// 存储搜索历史的键
const SEARCH_KEY = '__search__'
// 最大存储条数
const SEARCH_MAX_LENGTH = 15

// 播放记录的key
const PLAY_KEY = '__play__'
// 播放记录最大存储量
const PLAY_MAX_LENGTH = 200


const FAVORITE_KEY = '__favorite__'

const FAVORITE_MAX_LENGTH = 200

/**
 * 将查询到的结果存到本地
 * @param query 查询结果
 * @returns {*} 存储数据的数组
 */
export function saveSearch(query) {
  // 得到当前的存储情况
  let searches = storage.get(SEARCH_KEY, [])

  insertArr(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)

  storage.set(SEARCH_KEY, searches)

  return searches
}

/**
 *
 * @param arr 需要插入数据的数组
 * @param val 需要插入的数据
 * @param compare 自定义的比较函数
 * @param maxlen arr的最大长度
 */
function insertArr(arr, val, compare, maxlen) {
  let index = arr.findIndex(compare)

  // val是第一条数据 什么都不用做
  if (index === 0) {
    return
  }

  // 表明arr中有该数据 先删除 再插入到数组最前面
  if (index > 0) {
    arr.splice(index, 1)
  }

  arr.unshift(val)
  if (maxlen && arr.length > maxlen) {
    arr.pop()
  }

}

/**
 * 读取本地搜索历史到state中
 * @returns {*}
 */
export function getSearchHistory() {
  return storage.get(SEARCH_KEY, [])
}

function deleteIndex(arr, compare) {
  let index = arr.findIndex(compare)

  if (index > -1) {
    arr.splice(index, 1)
  }

}

/**
 * 删除query选项
 * @param query
 * @returns {*}
 */
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteIndex(searches, item => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)

  return searches
}


export function deleteAll() {
  storage.remove(SEARCH_KEY)
  return []
}

/**
 * 将歌曲保存到本地数组
 * @param song
 */
export function savePlayhistory(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArr(songs, song, item => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)

  storage.set(PLAY_KEY, songs)

  return songs
}

/**
 * 读取本地数组到state
 * @returns {*}
 */
export function loadPlayhistory() {
  return storage.get(PLAY_KEY, [])
}

export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])

  insertArr(songs, song, item => {
    return song.id === item.id
  }, FAVORITE_MAX_LENGTH)

  storage.set(FAVORITE_KEY, songs)

  return songs

}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])

  deleteIndex(songs, item=>{
    return song.id === item.id
  })

  storage.set(FAVORITE_KEY, songs)

  return songs
}

export  function loadFavoriteList() {
  return storage.get(FAVORITE_KEY, [])
}
