import secretjs from '@/utils/secretjs/index.js'

console.log('secretjs',secretjs)

export function getBalance(address){
  let res = secretjs.query.bank.balance({
    address,
    denom: 'uGHM'
  })
  console.log('res',res)
  return res
}