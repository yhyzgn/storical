const Forever: number = -2

/**
 * 淘汰策略：定时 + 懒汉
 */
class LocalStorage {
  /**
   * 开始监视每个 localStorage 的有效期
   */
  start() {
    const count = localStorage.length;
    for (let i = 0; i < count; i++) {
      (function (index) {
        lookup(localStorage.key(index))
      })(i)
    }
  }

  /**
   * 保存
   * @param {String} key 名称
   * @param {Object} value 值
   * @param {Number} expiry 有效期，单位：ms
   *
   * expiry = undefined || expiry < 0  :  当前会话有效
   * expiry <= 0                       :  永久有效
   * expiry > 0                        :  规定有效期内有效
   */
  set(key: string, value: any, expiry?: number): void {
    if (expiry && expiry > 0) {
      expiry = new Date().getTime() + expiry;
    } else {
      // 永久有效
      expiry = Forever;
    }
    localStorage.setItem(key, JSON.stringify({value: value, expiry: expiry}));
  }

  /**
   * 获取
   * @param {String} key 名称
   */
  get(key: string): any {
    let cache = localStorage.getItem(key);
    if (cache) {
      const _cache = JSON.parse(cache);
      const expiry = _cache.expiry;
      if (expiry === Forever) {
        // 永久有效
        return _cache.value;
      }
      if (expiry > 0) {
        const expiryDate = new Date(expiry);
        if (new Date().getTime() >= expiryDate.getTime()) {
          this.remove(key);
          return null;
        }
      }
      return _cache.value;
    }
    // localStorage 中未找到
    return null;
  }

  /**
   * 删除
   * @param {String} key 名称
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  }
}

/**
 * 让每个 localStorage 定时自动删除
 * @param {String} key 名称
 */
function lookup(key) {
  const jTemp = localStorage.getItem(key);
  if (jTemp) {
    try {
      const temp = JSON.parse(jTemp);
      if (typeof temp == 'object' && temp) {
        let expiry = temp.expiry;
        // expiry !== Forever && expiry > 0 时，才控制到期时间
        if (expiry !== Forever && expiry > 0) {
          // 对比是否过期
          expiry = new Date(temp).getTime() - new Date().getTime();
          if (expiry <= 0) {
            localStorage.removeItem(key)
            return;
          }
          setTimeout(function () {
            localStorage.removeItem(key);
          }, expiry);
        }
      }
    } catch (ignored) {
    }
  }
}

export default new LocalStorage()
