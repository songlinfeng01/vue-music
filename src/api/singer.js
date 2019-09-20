import {commonParams, options} from "./config";
import jsonp from 'common/js/jsonp'
import axios from 'axios'

/**
 * 获取歌手列表
 * @returns {Promise<AxiosResponse<T> | never>}
 */
export function getSingerList() {
  const url = '/api/getSingerList'

  const data = Object.assign({}, commonParams, {
    '-': 'getUCGI3239679182473396',
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    format: 'json',
    data: {
      "comm": {"ct": 24, "cv": 0},
      "singerList": {
        "module": "Music.SingerListServer",
        "method": "get_singer_list",
        "param": {"area": -100, "sex": -100, "genre": -100, "index": -100, "sin": 0, "cur_page": 1}
      }
    }
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

/**
 * 根据歌手的id获取歌手的所有歌曲
 * @param singerId
 * @returns {Promise<AxiosResponse<T> | never>}
 */
export function getSingerDetailList(singerId) {
  const url = '/api/getSingerDetailList'

  const data = Object.assign({}, commonParams, {
    '-': 'getUCGI0966630712027079',
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: {
      "comm": {"ct": 24, "cv": 0},
      "singer": {
        "method": "get_singer_detail_info",
        "param": {"sort": 5, "singermid": singerId, "sin": 0, "num": 100},
        "module": "music.web_singer_info_svr"
      }}
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })

}

