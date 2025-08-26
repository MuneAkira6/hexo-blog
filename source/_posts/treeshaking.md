---
title: 笔记：Tree Shaking
date: 2024-12-01 01:23:56
tags:
  - Pseudo-tech
categories:
  - Tech
---

Tree Shaking 的核心思想是：通过静态分析模块的导入/导出关系，找出那些从未被实际使用的代码，并在最终产物中将其删除，从而减小打包体积、提升性能。
这个概念最早由 Rollup 推出，随后 Webpack 在 2.0 版本开始支持，如今已经是几乎所有构建工具的标配。

## 为什么必须依赖 ES Modules？

Tree Shaking 的前提是 **静态可分析性**。  
CommonJS 的 `require` 过于灵活（可以在运行时拼接路径、条件加载），构建工具无法在编译阶段完整确定模块依赖，因此无法精确删除未使用的代码。相比之下，ES Modules 的 import/export 语法必须写在顶层，路径是字符串字面量，这让依赖关系在构建阶段就能完全确定。

举个例子：

```js
// 不合法的 ES Module 写法（因此保证了静态可分析性）
if (condition) {
  import { foo } from "./module";
}
```

这种语法在 ESM 中直接报错，但在 CommonJS 中却是允许的。这也是为什么 Tree Shaking 只能在 ESM 下可靠运行。

## 在 Webpack 中启用 Tree Shaking

要让 Webpack 正确执行 Tree Shaking，需要满足几个条件：

1. 代码必须使用 ESM 语法（`import/export`），而不是 CommonJS。
2. 生产模式：`mode: "production"`。
3. 启用 usedExports：
   ```js
   optimization: {
     usedExports: true;
   }
   ```
   这一步会让 Webpack 标记哪些导出未被使用。
4. 设置 sideEffects：在 `package.json` 中标记哪些文件有副作用。
   - 全部无副作用：
     ```json
     { "sideEffects": false }
     ```
   - 仅样式文件有副作用：
     ```json
     { "sideEffects": ["*.css", "*.scss"] }
     ```
5. 确保 Babel 不会把 ESM 转成 CommonJS，否则 Tree Shaking 会失效。

同时，在代码层面也要注意避免整包导入，而是只引入需要的部分：

```js
// 不推荐（难以 shake 掉没用的代码）
import _ from "lodash";

// 推荐（可被 tree shake）
import { debounce } from "lodash";
```

## Webpack 的实现原理

Webpack 的 Tree Shaking 大体分为两个阶段：**标记 (mark)** 和 **清除 (prune)**

1. 编译阶段 (Make/Seal)
   - Webpack 构建模块依赖图 (ModuleGraph)，收集所有导出。
   - 判断哪些导出实际被引用，未使用的导出会被打上特殊注释（如 `/* unused harmony export foo */`）。
2. 生成阶段
   - 打包输出时，这些未使用的导出依然会保留，但带有注释标记。
3. 压缩阶段
   - 由 Terser 等工具读取这些标记，真正删除无用代码。

这种设计的好处是：Webpack 本身只做“分析+标记”，而“删除”交给压缩器处理，两者解耦。

## FlagDependencyExportsPlugin 与 ModuleGraph

Webpack 内部有个核心插件 `FlagDependencyExportsPlugin`，负责分析每个模块的导出信息并写入缓存。  
它依赖于 **ModuleGraph** 这个数据结构来记录模块之间的依赖关系和导出使用情况。

每个导出的信息里会包含：

- 是否真的导出了该变量 (`provided`)
- 是否被其他模块使用 (`used`)
- 是否允许重命名压缩 (`canMangle`)
- 是否重定向自其他模块 (`from`)

特别是 `canMangle` 字段：

- 如果是内部函数、常量等，可以安全地压缩成短变量名。
- 如果是库对外暴露的 API，则必须保留原始名字，避免破坏外部调用。

## Example

有如下代码：

```js
// moment.js
export const moment = "moment";

// index.js
import { moment } from "./moment";

const foo = "foo";
const bar = "bar";
export default "foo-bar";

console.log(moment);
```

在开发模式下打包后，Webpack 会给未使用的导出加上注释：

```js
/* unused harmony exports bar, foo */
/* unused harmony default export */
```

只有 `moment` 被识别为真正使用。到了生产模式下，Terser 就会据此移除无用代码，最终产物只包含 `moment` 的部分。

## 总结

1. 必须使用 ESM，因为它保证了依赖关系的静态可分析性。
2. Webpack 分两步走：标记未使用导出 → 压缩阶段清理。
3. 内部依赖于 ModuleGraph 和 FlagDependencyExportsPlugin 来精确追踪导出和使用关系。
4. 合理使用 sideEffects 和按需导入，才能让 Tree Shaking 发挥最大效果。

## Ref
