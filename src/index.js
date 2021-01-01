import { observable, autorun } from './mobx'

let obj = observable({
  name: 'jacky',
  // job: {
  //   type: 'developer',
  // },
  age: 22,
})
// autorun方法这个回调函数会在初始化的时候被执行一次，之后每次内部相关的observable中的依赖发生变动时被再次调用
autorun(() => {
  console.log('autorun', obj.name, obj.age)
})

obj.name = 'xxx'
