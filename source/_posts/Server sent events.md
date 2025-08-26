---
title: Server-Sent Events教程
date: 2024-8-12 01:23:56
tags:
  - Pseudo-tech
categories:
  - Tech
---

## 介绍

服务器向浏览器推送信息，除了 WebSocket，还有一种方法：Server-Sent Events（以下简称 SSE）。

严格地说，HTTP 协议无法做到服务器主动推送信息。但是，有一种变通方法，就是服务器向客户端声明，接下来要发送的是流信息（streaming）。也就是说，发送的不是一次性的数据包，而是一个数据流，会连续不断地发送过来。这时客户端不会关闭连接，会一直等着服务器发过来的新的数据流，文件下载就是基于这种原理。

SSE 就是利用这种机制，使用流信息向浏览器推送信息。它基于 HTTP 协议，目前除了 IE/Legacy Edge，其他浏览器都支持。

## SSE 与 WebSocket

SSE 与 WebSocket 作用相似，都是建立浏览器与服务器之间的通信渠道，然后服务器向浏览器推送信息。

- **WebSocket**: 全双工通道，可以双向通信。
- **SSE**: 单向通道，只能服务器向浏览器发送，因为流信息本质上就是下载。如果浏览器向服务器发送信息，就变成另一次 HTTP 请求。

### 优点

1. SSE 使用 HTTP 协议，现有的服务器软件都支持。WebSocket 是一个独立协议，可能存在无法升级的情况。
2. SSE 属于轻量级，使用简单；WebSocket 协议相对复杂。
3. SSE 默认支持断线重连，WebSocket 需要自己实现。

## 服务器 API

1. 指定响应头

```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

2. 每次发送一个数据包，每个数据包之间用 `\n\n` 分隔，一个数据包内部由若干行文本组成，每行的格式是：

```
field: value\n
```

field 的取值可以是：`data`、`event`、`retry`、`id`

- **data**: 表示传输的数据
- **event**: 表示下一行 data 将触发的 client 的事件名，不指定则触发 `message` 事件
- **retry**: 意外断连后重连的时间间隔
- **id**: 数据标识符，用于在意外断连时，浏览器会自动在请求头中加上 `Last-Event-ID`，帮助服务器重建连接

### 示例

```
retry: 10000\n\n

event: connectTime\n
data: Connection open…\n\n

data: Hello World!\n\n

: This is a comment\n\n
```

## 浏览器 API

### EventSource 对象

1. 实例化

```js
var source = new EventSource(url, { withCredentials: true });
```

2. 获取连接的状态

```js
source.readyState;
// 0 CONNECTING
// 1 OPEN
// 2 CLOSED
```

3. 监听事件

```js
source.onopen;
source.onmessage;
source.onerror;
// 其他自定义事件…
source.close();
```

4. demo

## 原生 EventSource 的缺点

1. 只支持发 GET 请求
2. MS 系浏览器（IE、legacy Edge）不支持

## 基于 fetch 改造

1. 使用 fetch API 流式处理请求

```js
// Chrome 95+
const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
await reader.read();

// Chrome 95-
const reader = response.body.getReader();
const textDecoder = new TextDecoder();
const result = await reader.read();

let str = "";
str += textDecoder.decode(result.value);

// IE
// 取出本段数据（二进制格式）
var chunk = value;
var str = "";
// 假定数据是UTF-8编码，前三字节是数据头，而且每个字符占据一个字节（即都为英文字符）
for (var i = 3; i < chunk.byteLength; i++) {
  str += String.fromCharCode(chunk[i]);
}
```

2. 参照原生，手动解析响应的 body（demo）

- https://github.com/Azure/fetch-event-source
