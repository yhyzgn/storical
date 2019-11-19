/**
 * localStorage & sessionStorage
 */
class Storical {
    /**
     * 开始监视每个 localStorage 的有效期
     */
    start() {
        const count = localStorage.length;
        for (let i = 0; i < count; i++) {
            (function (index) {
                look(localStorage.key(index))
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
     * expiry = 0                        :  永久有效
     * expiry > 0                        :  规定有效期内有效
     */
    set(key, value, expiry) {
        // 未设置有效期或者有效期小于0的，就设置成 sessionStorage ，当前会话有效
        if (!expiry || expiry === 0) {
            sessionStorage.setItem(key, value);
            return;
        }
        if (expiry > 0) {
            expiry = new Date().getTime() + expiry;
        } else {
            expiry = 0;
        }
        localStorage.setItem(key, JSON.stringify({ value: value, expiry: expiry }));
    }

    /**
     * 获取
     * @param {String} key 名称
     */
    get(key) {
        let cache = localStorage.getItem(key);
        if (cache) {
            cache = JSON.parse(cache);
            const expiry = cache.expiry;
            if (expiry > 0) {
                const expiryDate = new Date(expiry);
                if (new Date().getTime() >= expiryDate.getTime()) {
                    localStorage.removeItem(key);
                    return null;
                }
            }
            return cache.value;
        }
        // 如果 localStorage 中未找到，尝试从 sessionStorage 中获取
        return sessionStorage.getItem(key);
    }

    /**
     * 删除
     * @param {String} key 名称
     */
    remove(key) {
        localStorage.removeItem(key);
    }
}

/**
 * 让每个 localStorage 定时自动删除
 * @param {String} key 名称
 */
function look(key) {
    let temp = localStorage.getItem(key);
    if (temp) {
        try {
            temp = JSON.parse(temp);
            if (typeof temp == 'object' && temp) {
                temp = temp.expiry;
                // expiry > 0 时，才控制到期时间
                if (temp > 0) {
                    // 对比是否过期
                    temp = new Date(temp).getTime() - new Date().getTime();
                    if (temp <= 0) {
                        localStorage.removeItem(key)
                        return;
                    }
                    setTimeout(function () {
                        localStorage.removeItem(key);
                    }, temp);
                }
            }
        }
        catch (e) {
        }
    }
}

// 导出组件
export default new Storical();