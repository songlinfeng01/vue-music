// 抽象歌曲的数据结构
import {commonParams} from "../../api/config";
import axios from "axios"
import {getLyric} from "api/song"
import {ERR_OK} from "api/config";
import {Base64} from 'js-base64'

export default class Song {
  constructor({id, mid, singer, name, albumId, albumName, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.albumId = albumId
    this.albumName = albumName
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    if (this.lyric) {
      return
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('无法获取歌词')
        }
      })
    })

  }

}

/**
 *
 * @param songData
 * @param vkey  获取播放列表中的vkey  需要发生请求获取vkey
 * @returns {Song}
 */
export function createSong(songData, vkey) {
  return new Song({
    id: songData.id,
    mid: songData.mid,
    name: songData.name,
    singer: filterSinger(songData.singer),
    albumName: songData.album.name,
    albumId: songData.album.id,
    duration: songData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${songData.album.mid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/C400${songData.file.media_mid}.m4a?guid=7764733037&vkey=${vkey}&uin=0&fromtag=66`
  })
}



export function createTopListSong(songData,vkey) {
  return new Song({
    id: songData.songid,
    mid: songData.songmid ,
    name: songData.songname,
    singer: filterSinger(songData.singer),
    albumName: songData.albumname,
    albumId: songData.albummid,
    duration: songData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${songData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/C400${songData.albummid}.m4a?guid=7764733037&vkey=${vkey}&uin=0&fromtag=66`
  })
}


/**
 *
 * 每一首个可能有多个歌手  使用/将歌手分开
 * @param singers
 * @returns {string}
 */
function filterSinger(singers) {
  let result = []
  if (!singers) {
    return ''
  }

  singers.forEach(item => {
    result.push(item.name)
  })

  return result.join('/')

}
