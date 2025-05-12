---
title: 学マスをMacで遊ぶ方法
date: 2025-5-12 01:23:56
tags:
  - Pseudo-tech
categories:
  - Tech
---

## Ref

https://note.com/hoy0verse/n/n043bb3308a0d#5e54f119-c5eb-45a0-bc8f-00c03c283214

https://misskey.io/notes/a5pvn728kcix0312

## 手順

上記したRefを見れば大体わかると思います。

### 1. Sideloadyをインストール

### 2. 学マスのIPAファイルをダウンロード

### 3. Sideloadする

### 4. Launch!

ここで問題発生。ログイン画面は正常ですが、ダウンロードが始まると画面が真っ黒になってしまいました。（おそらく横向き表示になるのが原因）

## 解決策

(https://misskey.io/notes/a5pvn728kcix0312)

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

でもやはり解像度はiPad仕様のまま。
