---
title: 笔记：React Query优化
date: 2024-12-13 02:23:56
tags:
  - Pseudo-tech
categories:
  - Tech
---

## isFetching 引起的重复渲染

在 React Query 中，每个 query 会暴露一些 meta 数据，如 `isFetching`，用于标记数据是否正在请求中。例如：

```ts
export const useTodosQuery = (select) =>
  useQuery(['todos'], fetchTodos, { select })

export const useTodosCount = () => useTodosQuery((data) => data.length)

function TodosCount() {
  const todosCount = useTodosCount()
  return <div>{todosCount.data}</div>
}
```

当后台数据正在 refetch 时，组件会根据以下数据重复渲染两次：

```
{ status: 'success', data: 2, isFetching: true }
{ status: 'success', data: 2, isFetching: false }
```

如果不需要展示加载状态，这种重复渲染就显得冗余。

## 使用 notifyOnChangeProps 控制渲染

React Query 提供了 `notifyOnChangeProps`，用于指定组件仅在关注的字段变动时才触发渲染。例如：

```ts
export const useTodosQuery = (select, notifyOnChangeProps) =>
  useQuery(["todos"], fetchTodos, { select, notifyOnChangeProps });

export const useTodosCount = () => useTodosQuery((data) => data.length, ["data"]);
```

通过将 `notifyOnChangeProps` 设置为 `['data']`，组件只会在数据发生变化时渲染，从而减少不必要的更新。

注意：`notifyOnChangeProps` 中指定的字段必须与组件实际使用的字段保持同步，否则某些字段变化时组件不会自动更新。

---

## Tracked Queries

Tracked Queries 是 React Query 提供的功能，可以自动追踪组件渲染过程中使用到的字段：

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      notifyOnChangeProps: 'tracked',
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  )
}
```

**使用提示**：

- 使用对象解构时，要注意使用剩余运算符才能追踪所有字段：

```ts
const { isLoading, ...queryInfo } = useQuery(...)
```

- Tracked Queries 只在渲染过程中生效，在 effect 中访问数据不会被追踪：

```ts
// 无法追踪
React.useEffect(() => {
  console.log(queryInfo.data);
});

// 正确代码
React.useEffect(() => {
  console.log(queryInfo.data);
}, [queryInfo.data]);
```

从 React Query v4 起，Tracked Queries 默认启用，可通过 `notifyOnChangeProps: 'all'` 关闭。

## Structural Sharing

Structural Sharing 是 React Query 默认启用的另一项优化机制，它确保更新数据时保留未变更的数据引用，从而减少无意义的渲染。

举例：

```ts
[
  { id: 1, name: "Learn React", status: "active" },
  { id: 2, name: "Learn React Query", status: "todo" },
];
```

当我们将第一个待办的状态更新为 `done` 并后台 refetch：

```ts
[
  { id: 1, name: "Learn React", status: "done" },
  { id: 2, name: "Learn React Query", status: "todo" },
];
```

React Query 会只更新实际变动的数据引用，未变化的数据仍保持原引用，减少重复渲染。

使用 selector 可以部分订阅数据：

```ts
const { data } = useTodo(2); // 只有 id 为 2 的数据变化时组件才会渲染
```

可在 query 中设置 `structuralSharing: false` 关闭 Structural Sharing。

## Ref

https://tkdodo.eu/blog/practical-react-query
