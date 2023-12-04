---
title: 语法拾贝 (Reloaded)
date: 2023-12-04 16:24:56
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

### 3. 键值获取 keyof

```javascript
type Person = {
  name: string;
  age: number;
}
type PersonKey = keyof Person;  // 'name' | 'age'
```

**使用场景：任意定义一个 key 变量去对象里取 value 时，通常会不允许取。故需要手动指定。**
**那如果无法获取显式目标对象的类型时？keyof typeof**

```javascript
type PersonKey = keyof typeof me;   // 'name' | 'age'
```

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

这种方式会显示声明 children

```javascript
const App: React.FC<AppProps> = ({ message, children }) => (
  <div>
    {message}
    {children}
  </div>
)
```

### 2. 使用 typeof 减少冗余的 props 类型导出

### 3. 事件

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
