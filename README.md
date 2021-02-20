# `vue-ls-plus`

![npm](https://img.shields.io/npm/v/vue-ls-plus?color=orange&label=vue-ls-plus&style=flat-square)

> `localStorage with expiry time.`

## `main.js`
```js
import {createApp} from 'vue'
import App from './App.vue'

import LS from "vue-ls-plus"

const app = createApp(App)
  .use(LS)

app.mount('#app')
```

## `Test.vue`
```vue
<script>
export default {
  name: "Test",
  created() {
    this.$ls.set("key", "value")

    this.$ls.set("key", "value", 10000)

    this.$ls.get("key")

    this.$ls.remove("key")
  },
  methods: {}
}
```

## `normal.js`

```js
import ls from "vue-ls-plus"

ls.set("key", "value")

ls.set("key", "value", 10000)

ls.get("key")

ls.remove("key")
```

