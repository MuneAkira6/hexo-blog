---
title: 如何避免 React hooks 闭包陷阱

date: 2022-11-01 01:23:56
tags:
  - Pseudo-tech
categories:
  - Tech
---

在 react 中 提供了一些性能优化函数 react.memo 、useMemo、useCallback。

```js
const cachedValue = useMemo((fn) => calculateValue, dependencies);
```

useMemo：memoized 值，只有依赖项变更的时候才会重新计算

```js
const cachedFn = useCallback(fn, dependencies);
```

useCallback：memoized 函数，只有依赖项变更的时候才会重新更新

```js
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

memo：缓存组件，当 props 没变化的时候，不会执行 render。arePropsEqual 是一个可选函数，可以自定义对比新旧的 props, 返回 true 就会缓
存，返回 false，就不会缓存。

```js
const arePropsEqual=(oldProps: Props, newProps: Props) => boolean
```

有时候我们使用了这些函数来优化性能，这些函数与外围的 state 形成闭包，导致缓存函数中获取到的 state 不是最新的值，这就是闭包陷阱。

## 实例演示

比如下面代码，在项目中有一个计时器组件，还有一个 Child 组件, 点击 Child 组件需要返回 App 组件中的最新 state 值；

```js
import React, { useCallback, useEffect, useLayoutEffect } from "react";
import "antd/dist/antd.css";
import { Button, ButtonProps } from "antd";
const Child = ({ onClick }: ButtonProps) => {
console.log("render");
return (
<Button onClick={onClick} type="primary">
Button
</Button>
);
};
const App: React.FC = () => {
const [count, setCount] = React.useState(0);
useEffect(() => {
const time = setInterval(() => {
setCount((count) => count + 1);
}, 1000);
return () => {
clearInterval(time);
};
}, []);
const handleClick = () => {
console.log(count);
};
return (
<>

 <h2>{count}</h2>
 <Child onClick={handleClick} />
 </>
 );
};
export default App;
```

这样没什么问题，但是每次渲染的时候 Child 组件都会执行 render
为了防止 App 组件在更新的时候，不重复渲染（render）子组件，我们使用 React.memo 包裹下 Child 组件， handleClick 也需要使用 useCallb
ack 包裹，这样 Child 组件只会 render 一次。

```js
const Child = React.memo(({ onClick }: ButtonProps) => {
console.log("render");
return (
<Button onClick={onClick} type="primary">
Button
</Button>
);
});
const handleClick = useCallback(() => {
console.log(count);
}, []);
```

这样一来 useCallback 和 state 就形成了一个闭包，每次打印的 state 就是初始化的 state。
为了获得最新的 state 值，必须将 count 参数写进 useCallback 的第二个参数。

```js
const handleClick = useCallback(() => {
  console.log(count);
}, [count]);
```

但这样，又会导致 Child 组件更新。那么有什么好的解决办法呢？既能防止子组件的更新，又可以获取到最新的 state 值呢？

## 方法

我们可以使用 useRef 来存一个函数，每次更新的时候设置 ref.current 的值，通过函数来获取最新的 state 值。

```js
const App: React.FC = () => {
const [count, setCount] = React.useState(0);
const ref = React.useRef<VoidFunction>();
useEffect(() => {
const time = setInterval(() => {
setCount((count) => count + 1);
}, 1000);
return () => {
clearInterval(time);
};
}, []);
const fn = () => {
console.log(count);
};
ref.current = fn;
const handleClick = useCallback(() => {
ref.current();
}, []);
return (
<>

 <h2>{count}</h2>
 <Child onClick={handleClick} />
 </>
 );
};
```

## 小结

解决闭包陷阱的方法

1. 当页面更新不频繁的时候，不使用 useMemo、useCallback 缓存函数来优化页面；
2. 将更新依赖的参数写进 useCallback 的第二个参数
3. 使用 useRef 来存在一个函数，用一个函数实时获取最新的 state 值
