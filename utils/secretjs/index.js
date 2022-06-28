import NetworkClient from './SecretNetWorkClient'
import * as _secretjs from 'secretjs-cjgs'
const SecretJs = {

  get SecretNetworkClient() {
    return NetworkClient
  }
}

Object.setPrototypeOf(SecretJs, _secretjs)

export default SecretJs
