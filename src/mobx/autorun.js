import Reaction from './reaction'

function autorun(handler) {
  Reaction.start(handler) // 先保存函数，搜集依赖，设置Reaction中的nowFn
  handler() // 调用该方法会触发 get 属性
  Reaction.end() // 清除nowFn
}

export default autorun
