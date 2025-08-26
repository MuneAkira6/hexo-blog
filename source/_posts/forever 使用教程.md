---
title: forever 使用教程
date: 2023-4-12 01:23:56
tags:
  - Pseudo-tech
categories:
  - Tech
---

## 何为 forever

forever 可以看做是一个 nodejs 的守护进程，能够启动，停止，重启我们的 app 应用。

官方的说明是说：
A simple CLI tool for ensuring that a given script runs continuously (i.e. forever).
一个用来持续（或者说永远）运行一个给定脚本的简单的命令行工具

Github 地址：https://github.com/nodejitsu/foreverbash

## forever 用途

forever 的用途就是帮我们更好的管理我们 node App 服务，本质上就是在 forever 进程之下，创建一个 node app 的子进程。
比如，你有一个基于 express 应用，那么它将会很方便你更新和操作你的服务，并且保证你服务能持续运行。
更好的一点就是每次更改文件，它都可以帮你自动重启服务而不需要手动重启。

## 安装 forever

```bash
npm install forever -g
```

## 使用 forever

### 启动相关

简单的启动，其实就是 node app.js，forever start 默认会调用系统的 node

```bash
forever start app.js
```

指定 forever 信息输出文件，当然，默认它会放到~/.forever/forever.log

```bash
forever start -l forever.log app.js
```

指定 app.js 中的日志信息和错误日志输出文件
-o 就是 console.log 输出的信息，-e 就是 console.error 输出的信息

```bash
forever start -o out.log -e err.log app.js
```

追加日志，forever 默认是不能覆盖上次的启动日志，
所以如果第二次启动不加-a，则会不让运行

```bash
forever start -l forever.log -a app.js
```

监听当前文件夹下的所有文件改动

```bash
forever start -w app.js
```

文件改动监听并自动重启

```bash
forever start -w app.js
```

显示所有运行的服务

```bash
forever list
```

### 停止操作

停止其中一个 node App

```bash
forever stop app.js
```

当然还可以这样

```bash
// forever list uid
forever stop uid
forever stopall
```

### 重启操作

重启操作跟停止操作保持一致。

```bash
forever restart uid
forever restartall
```

开发和线上建议配置

```bash
forever start -l forever.log -e err.log -a app.js

forever start -l ~/.forever/forever.log -e ~/.forever/err.log -w -a app.js
```

### config 文件

也可以通过 json 文件来配置
比如forever start -l forever.log -e err.log -a app.js改成配置文件是：

```json
// config.json
[
  {
    // App1
    "uid": "app",
    "append": true, // -a
    "watch": true, // -w
    "script": "app.js",
    "sourceDir": "/path/of/app",
    "logFile": "forever.log",
    "errFile": "error.log"
  },
  {
    // App2
    // ...
  }
]
```

使用 forever start 启动这个 json 文件即可。

```bash
forever start ./forever/config.json
```

## 和 npm start 搭配

有时我们的服务使用 npm start 起的，forever start 默认只支持 node，怎么办呢？
像下面这样写，/path/to/app/dir/ 就是你打算执行 npm start 的目录：

```bash
forever start -c "npm start" /path/to/app/dir/
```

但这个命令偶尔会报错，报 cannot find package.json...，遇到这种情况的话推荐另一种方式：

1. cd到项目路径下
2. 查看 package.json，查找 scripts 里面的命令。
3. 比如你原来的项目是用 npm start:prod 起的，查看项目的 package.json，长这样：

```js
"scripts": {
  // ...
  "start:prod": "export NODE_ENV='production' && pm2 start dist/main.js --name anno",
},
```

那么实际你输入 npm start:prod 的时候，它实际执行的是后面那一串命令。我们可以参照这串命令，在终端输入：

```bash
export NODE_ENV='production' && forever start dist/main.js
```

还有的package.json更简单：

```js
"scripts": {
  // ...
  "start": "node bin/start.js"
},
```

那么就写成：

```bash
forever start bin/start.js
```
