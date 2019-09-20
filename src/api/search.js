import {commonParams, options} from "api/config"
import jsonp from 'common/js/jsonp'
import axios from 'axios'

/**
 * 获取热搜的数据  {"k":"周杰伦 ","n":2288654}
 */
export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    g_tk: 2116745061,
    needNewCode: 0,
    platform: 'yqq.json',
    inCharset: "utf8"
  })

  return jsonp(url, data, options)
}

export function search(query, page, zhida, perpage) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp'
  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    n: perpage,
    lag_qc: 0,
    cr: 1,
    aggr: 0,
    catZhida: zhida ? 1 : 0,
    ie: 'utf-8',
    flag: 1,
    t: 0,
    sem: 1,
    perage: perpage,
    uid: 0,
    needNewCode: 1,
    remoteplace: 'txt.mqq.all',
    platform: 'h5'
  })

  return jsonp(url, data, options)
}


