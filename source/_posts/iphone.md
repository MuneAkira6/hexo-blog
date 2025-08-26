---
title: iPhone调试移动端webview
date: 2022-11-12 01:23:56
tags:
  - Pseudo-tech
categories:
  - Tech
---

## 一、模拟器调试

1、启动Xcode
2、选择菜单Xcode - Open Developer Tool - Simulator
3、启动Simulator后，选择Simulator菜单Hardware - Device - iOS12.x - 再选择需要的手机/iPad型号
4、安装App，直接拖放App安装包到Simulator屏幕上，等待自动安装结束。
5、在App内访问开发环境，打开电脑端Safari浏览器，选择菜单：开发 - 模拟器，右侧会显示App内打开的web地址列表，选择你要调试的地址，会打开一个
浏览器控制台，开始调试web view

## 二、真机调试

1、全局安装`spy-debugger`包

```bash
npm install spy-debugger -g
```

2、启动spy-debugger，浏览器自动打开调试页面 http://127.0.0.1:63564

```bash
spy-debugger
```

3、 打开调试页面http://127.0.0.1:49858/，点击RootCA下载证书，发到手机上安装并添加信任。
4、确保手机和电脑在同一局域网且在同一网段，手机设置电脑为代理，设置路径：设置 - 无线局域网 - 点击当前连接的wifi右侧图标 - 配置代理 - 手
动 - 服务器填电脑IP，端口默认填9888，保存，注意：因某些公司网络限制，电脑和手机很可能不在同一网段，如果电脑有无线网卡，将电脑wifi开关也打
开，设置代理时就用wifi连接的IP地址
5、在App内访问开发环境，在http://127.0.0.1:49858/页面查看请求和控制台输出，页面分为两块：【页面调试】和【请求抓包】。
