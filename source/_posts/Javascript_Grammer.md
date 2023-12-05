---
title: 语法拾贝 (Reloaded)
tags:
  - Grammer
categories:
  - JavaScript
---

## ES6

### 1. 解构与改名

```javascript
const { a: a1 } = obj;
```

### 2. 数组去重

```javascript
const c = [...new Set([...a, ...b])];
```

### 3. 数组扁平化

```javascript
arr.flat(Infinity);
```

### 4. ?? or ||

`??` 仅在左侧为 `null`, `undefined` 时跳到右侧
`||` 为 `0`, `''`, `NaN`, `null`, `undefined`（这五个称为假值）

\* `[]` `{}` 的值为 `true`

## typescript

**一、操作符**

### 1. void

作为函数返回值类型，表示不关注返回值类型，可以是任意值

### 2. 非空断言 !

**使用场景：ref**

### 3. 键值获取 keyof

```javascript
type Person = {
  name: string;
  age: number;
}
type PersonKey = keyof Person;  // 'name' | 'age'
```

**使用场景：遍历一个对象的所有 key 时（拿不到类型时可以用 keyof typeof）**

```javascript
(Object.keys(params) as (keyof feedbackParams)[]).forEach((key) => {
  formData.append(key, params[key]);
});
```

### 4. 联合类型 ｜ 交叉类型 &

**不是数学上的交集并集！**

& 交叉类型：产生的新集合包含原各集合的所有属性（语义上的“且”）
| 联合类型：产生的新集合是一个 `select`，可以是 A，也可以是 B，但不能同时拥有 A 和 B （语义上的“或”）

**使用场景：继承**

**二、泛型工具**

### Partial<T>

将泛型中全部属性变为可选的。

### Required<T>

将泛型中全部属性变为必选的。

### Record<K, T>

常用于定义对象。 `Record<string, unknown>`

### Pick<T, K>

取键值对。
`Pick<Animal, "name" | "age">`

### Omit<T, K>

去键值对。
`Omit<Animal, 'name'|'age'>`

**三、Work with React**

### 1. 声明函数式组件

这种方式会在 props 里显式声明 children

```javascript
const App: React.FC<AppProps> = ({ message, children }) => (
  <div>
    {message}
    {children}
  </div>
)
```

### 2. 使用 typeof 减少冗余的 props 类型导出

```javascript
import { Recent } from '@mercury/component'
type RecentProps = React.ComponentProps<typeof Recent>
```

### 3. React 事件类型定义

```javascript
type Props = {
  onClick: (event: React.MouseEvent<HTMLInputElement>) => void
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onkeypress: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void
  onFocus: (event: React.FocusEvent<HTMLInputElement>) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onClickDiv: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}
```

对应的 handler 类型

```javascript
type ChangeEventHandler<T = Element> = EventHandler<React.ChangeEvent<T>>
type KeyboardEventHandler<T = Element> = EventHandler<React.KeyboardEvent<T>>
type MouseEventHandler<T = Element> = EventHandler<React.MouseEvent<T>>
```

## Trick

### if 条件太长时

```javascript
if(
    type == 1 ||
    type == 2 ||
    type == 3 ||
    type == 4 ||
){
   //...
}
```

↓

```javascript
const condition = [1, 2, 3, 4];
if (condition.includes(type)) {
  //...
}
```

### 类型断言/类型守卫

1. 类型断言

```
值 as 类型
<类型>值
```

- 联合类型→单一类型
- 父类→子类
- any→类型

2. 类型守卫：通过 if 自动推断类型。

- 类型判断：`typeof 基本类型`
- 实例判断：`instanceof 类（非接口）`
- 属性判断：`字段 in 接口（所实现的实例）` `in` 其实是 js 自带语法，应用在实例上
- 字面量相等判断：`==`, `===`, `!=`, `!==`，适用于枚举

```javascript
const input1: string | number;
if (typeof input1 == 'string') {
  // 这里 input1 的类型「收紧」为 string
}

class A {};
class B {};
const input2: A | B;
if (input2 instanceof A) {
  // 这里 input2 的类型「收紧」为 A
}

interface Foo {
  foo: string;
}
interface Bar {
  bar: string;
}
const input3: Foo | Bar;
if ('foo' in input3) {
  // 这里 input3 的类型「收紧」为 Foo
}
```

自定义类型守卫函数：代码随便写，返回值保证是`参数 is 类型`

```javascript
function isBatman (man: any): man is Batman {
  // 写各种判断
  return man && man.helmet && man.cloak;
}
```

### 升降 CSS 优先级

内联 > ID > 类/伪类/属性 > 元素/伪元素

- （升优先级）自我重复，提高选择器的优先级：`.{className}.{className}`
- （降优先级）属性选择器 `[id='{targetId}']` 替代 `#{targetId}` 以获得与 `.{className}` 相同的优先级
- 优先级是权重相加制，更具体的选择器拥有更高的优先级

### import type がウザい！

```javascript
import { type RecentProps } from '@mercury/component'
```
