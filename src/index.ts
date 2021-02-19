import {App} from 'vue'
import LocalStorage from "./stg/local"

class LS extends LocalStorage {
  install(app: App): void {
    app.config.globalProperties.$ls = this
  }
}

const ls = new LS()
export default ls
