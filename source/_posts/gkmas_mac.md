---
title: 学マスをMacで遊ぶ方法
date: 2025-5-12 01:23:56
tags:
  - Pseudo-tech
categories:
  - Tech
---

## はじめに

学マスは本来 iOS / Android 向けのアプリですが、Mac 上でも動かす方法があります。  
ここでは、**Sideloady** を使って IPA ファイルを Mac にインストールし、実際に動作させるまでの手順と、遭遇した問題・解決策をまとめます。

Refはこちら：

- https://note.com/hoy0verse/n/n043bb3308a0d#5e54f119-c5eb-45a0-bc8f-00c03c283214
- https://misskey.io/notes/a5pvn728kcix0312

## Ref

https://note.com/hoy0verse/n/n043bb3308a0d#5e54f119-c5eb-45a0-bc8f-00c03c283214

https://misskey.io/notes/a5pvn728kcix0312

## 手順

上記したRefを見れば大体わかると思います。

### 1. Sideloadyをインストール

まずは [Sideloady](https://sideloady.io/) をダウンロードしてインストールします。

### 2. 学マスのIPAファイルをダウンロード

### 3. Sideloadする

### 4. Launch!

ここで問題発生。ログイン画面は正常ですが、ダウンロードが始まると画面が真っ黒になってしまいました。（おそらく横向き表示になるのが原因）

## 解決策

これをipaに注入する。

```xml
<key>UISupportedInterfaceOrientations</key>
<array>
  <string>UIInterfaceOrientationPortrait</string>
  <string>UIInterfaceOrientationPortraitUpsideDown</string>
  <string>UIInterfaceOrientationLandscapeLeft</string>
  <string>UIInterfaceOrientationLandscapeRight</string>
</array>
```

再度Sideloadします。

また画面が黒くなった時、左上のメニューの`表示`->`横向き`/`縦向き`を切り替えれば直るはず。

![](https://imgur.com/lAah548.jpg)

## 課題

- 表示解像度は iPad 向け仕様 のまま
- Mac 用に最適化されていないため UI がやや不自然
