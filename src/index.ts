import {App} from 'vue'

import ls from "./stg/local"

const LS = {
  version: "1.0.0-bata.1",
  install: (app: App) => {
    ls.start()
    app.config.globalProperties.$ls = ls
  },
  ls: ls
}

export default LS
