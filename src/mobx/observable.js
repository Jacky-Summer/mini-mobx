import Reaction from './reaction'

// 深层Proxy代理返回
function deepProxy(val, handler) {
  if (typeof val !== 'object') return val
  for (let key in val) {
    // 从后往前依次实现代理的功能，相当于是后序遍历
    val[key] = deepProxy(val[key], handler)
  }

  return new Proxy(val, handler())
}

function createObservable(val) {
  // 声明一个专门用来代理的对象
  let handler = () => {
    let reaction = new Reaction()

    return {
      get(target, key) {
        reaction.collect()
        return Reflect.get(target, key)
      },
      set(target, key, value) {
        // 对于数组的值设置处理: 当对数组进行观察监听时，由于对数组的操作会有两步执行:
        // 更新数组元素值
        // 更改数组的length属性，所以需要将更改length属性的操作给拦截，避免一次操作数组，多次触发handler
        if (key === 'length') return true
        let r = Reflect.set(target, key, value)
        reaction.run()
        return r
      },
    }
  }
  return deepProxy(val, handler)
}

function observable(target, key, descriptor) {
  if (typeof key === 'string') {
    // 装饰器写法：先把装饰的对象进行深度代理
    let v = descriptor.initializer()
    v = createObservable(v)
    let reaction = new Reaction()
    // 返回描述器
    return {
      enumerable: true,
      configurable: true,
      get() {
        reaction.collect()
        return v
      },
      set(value) {
        v = value
        reaction.run()
      },
    }
  }
  return createObservable(target) // 不是装饰器写法：将目标对象进行代理操作，创建成可操作对象
}

export default observable
