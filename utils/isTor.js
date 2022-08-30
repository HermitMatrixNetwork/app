import Request from '@/utils/luch-request/index.js'

const http = new Request()

import OrBotList from '@/static/orbotList.js'

export default async function isTor() {
  const ip = (await http.get('http://httpbin.org/ip')).data.origin
  return OrBotList.includes(ip)
}