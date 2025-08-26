---
title: console.log の代わりに Logpoints を使う話
date: 2025-05-03 00:23:56
tags:
  - Pseudo-tech
categories:
  - Tech
---

## デバッグの定番「console.log()」

フロントエンド開発では、処理の流れを確認するために console.log() を使う場面が多いと思います。
ただしこの方法は、ログを消し忘れてコミットしてしまったり、再ビルドを待つ必要があるなど、意外と手間がかかります。

## Logpoints という選択肢

実は Chrome や Edge には Logpoints という仕組みが用意されていて、これを使えばコードを一切編集せずにコンソールにログを出せます。
console.log() を書かずに同じことができるわけです。

## 使い方

1. DevTools を開き、Sources タブで対象ファイルを表示（Cmd + P）
2. 行番号を右クリックして Add logpoint… を選択
   ![](https://imgur.com/gWjWhbf.jpg)
3. 出力したい内容や変数を入力
   ![](https://imgur.com/wj3Vtmu.jpg)

これで準備が完了です。Logpoints が設定された箇所のコードが実行されると、コンソールにメッセージが出力されます。

![](https://imgur.com/effmpxz.jpg)

## まとめ

普段のデバッグでは console.log() に頼りがちですが、Logpoints を覚えておくと 「コードを汚さずにログを確認できる」 という大きな利点があります。
日常的に使うツールだからこそ、こうした小技を知っておくと開発効率がぐっと上がります。
