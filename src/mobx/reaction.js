let nowFn = null // 表示当前的 autorun 中的 handler 方法
let counter = 0 // 记录一个计数器值作为每个 observable 属性的 id 值进行和 nowFn 进行绑定

class Reaction {
  constructor() {
    this.id = ++counter // 每次对 observable 属性进行 Proxy 的时候，对 Proxy 进行标记
    this.store = {} // 存储当前可观察对象的nowFn, { id: [nowFn] }
  }

  // 进行依赖搜集
  collect() {
    // 当前有需要绑定的函数才进行绑定
    if (nowFn) {
      this.store[this.id] = this.store[this.id] || []
      this.store[this.id].push(nowFn)
    }
  }

  // 运行依赖函数
  run() {
    if (this.store[this.id]) {
      this.store[this.id].forEach(w => {
        w()
      })
    }
  }

  // 用于在调用 autorun 方法时候对 nowFn 进行设置和消除
  static start(handler) {
    nowFn = handler
  }

  // 在注册绑定这个就要清空当前的 nowFn，用于之后进行搜集绑定
  static end() {
    nowFn = null
  }
}

export default Reaction
