---
title: 学マスをMacで遊ぶ方法
date: 2025-05-12 01:23:56
description: 学園アイドルマスター（学マス）をMacで遊ぶための完全ガイド。Sideloadyを使ってIPAファイルをインストールし、横画面問題を解決する方法を解説します。
keywords: 学マス, 学園アイドルマスター, Mac, Sideloady, iOSアプリ, M1 Mac, M2 Mac, インストール方法
tags:
  - 学マス
  - Mac
  - Sideloady
  - ゲーム
categories:
  - Tech
---

## はじめに

学マスは本来 iOS / Android 向けのアプリですが、Mac 上でも動かす方法があります。  
ここでは、**Sideloady** を使って IPA ファイルを Mac にインストールし、実際に動作させるまでの手順と、遭遇した問題・解決策をまとめます。

Refはこちら：

- https://note.com/hoy0verse/n/n043bb3308a0d#5e54f119-c5eb-45a0-bc8f-00c03c283214
- https://misskey.io/notes/a5pvn728kcix0312

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

![Sideloadyで学マスをMacにインストールして起動した画面](https://imgur.com/lAah548.jpg)

## 課題

- 表示解像度は iPad 向け仕様 のまま
- Mac 用に最適化されていないため UI がやや不自然
