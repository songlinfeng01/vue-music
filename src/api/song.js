import axios from 'axios'
import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getSongVkey(songmid) {
  // const url = '/api/getSongVkey'
  //
  // const data = Object.assign({}, {
  //   hostUin: 0,
  //   needNewCode: 0,
  //   platform: 'yqq.json',
  //   g_tk: 5381,
  //   format: 'json',
  //   inCharset: 'utf8',
  //   loginUin: 1120996904,
  //   data: {
  //     "req": {
  //       "module": "CDN.SrfCdnDispatchServer",
  //       "method": "GetCdnDispatch",
  //       "param": {"guid": "5655257600", "calltype": 0, "userip": ""}
  //     },
  //     "req_0": {
  //       "module": "vkey.GetVkeyServer",
  //       "method": "CgiGetVkey",
  //       "param": {
  //         "guid": "5655257600",
  //         "songmid": [songmid],
  //         "songtype": [0],
  //         "uin": "1120996904",
  //         "loginflag": 1,
  //         "platform": "20"
  //       }
  //     },
  //     "comm": {"uin": "1120996904", "format": "json", "ct": 24, "cv": 0}
  //   },
  //   '-': 'getplaysongvkey15237941371784092'
  // })
  //
  // return axios.get(url, {
  //   params: data
  // }).then(res => {
  //   return Promise.resolve(res.data)
  // })

  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const data = Object.assign({}, {
    callback: 'musicjsoncallback',
    loginuin: 3051522991,
    format: 'jsonp',
    platform: 'yqq',
    neednewcode: 0,
    cid: 205361747,
    uin: 0,
    guid: 3089525306,
    songmid: songmid,
    filename: `c400${songmid}.m4a`
  })

  return jsonp(url, data)
}

export function getLyric(songMid) {
  const url = '/api/getLyric'

  const data = Object.assign({}, commonParams, {
    songmid: songMid,
    platform: 'yqq.json',
    hostUin: 0,
    needNewCode: 0,
    pcachetime: +new Date(),
    inCharset: 'utf8',
    loginUin: 0,
    format: 'json',
    '-': 'MusicJsonCallback_lrc',
    // g_tk: 2116745061
    g_tk: 5381
  })

  return axios.get(url, {
    params: data
  }).then( res => {
    return Promise.resolve(res.data)
  })
}

export function getDiscSongVkey(songmid) {
  const url = '/api/getDiscSongVkey'
  const data = Object.assign({}, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq.json',
    g_tk: 5381,
    format: 'json',
    inCharset: 'utf8',
    loginUin: 1120996904,
    data: {
      "req": {
        "module": "CDN.SrfCdnDispatchServer",
        "method": "GetCdnDispatch",
        "param": {"guid": "5655257600", "calltype": 0, "userip": ""}
      },
      "req_0": {
        "module": "vkey.GetVkeyServer",
        "method": "CgiGetVkey",
        "param": {
          "guid": "5655257600",
          "songmid": [songmid],
          "songtype": [0],
          "uin": "1120996904",
          "loginflag": 1,
          "platform": "20"
        }
      },
      "comm": {"uin": "1120996904", "format": "json", "ct": 24, "cv": 0}
    },
    '-': "getplaysongvkey2895679108157727"
  })

  // return jsonp(url, data)
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
