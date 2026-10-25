# AI 搜索引用基准（GEO benchmark）

用途：定期手动检查各 AI 搜索引擎回答这些问题时，是否引用了 muneakira6.github.io。
单次结果说明不了什么：模型更新、个性化、问法不同都会让答案变化。要看的是同一套条件下长期的趋势。

**基线请在部署 2026-09-23 这批 AI 搜索改动之前跑一次**，之后每月跑一次。

## 平台自带的数据（优先看这些）

| 来源 | 位置 | 能看到什么 |
|---|---|---|
| Google Search Console | 效果 → 生成式 AI（Search generative AI） | AI Overviews / AI Mode 中的展示次数（按页面、国家、设备）；数据从 2026-05-18 起，暂无点击和查询词 |
| Bing Webmaster Tools | AI Performance | Copilot / Bing AI 摘要中的引用次数，以及 grounding queries |
| GA4 | 流量获取 → 自定义渠道组「AI Assistants」 | 从 chatgpt.com、perplexity.ai 等来的访问（只统计有点击的，看不到只引用不点击的情况） |

## 查询集

改问法会让前后结果无法比较：固定用下面的原文，需要新增就追加新 ID，不要改旧的。

| ID | 语言 | 查询 | 期望被引用的页面 |
|---|---|---|---|
| Q01 | zh | 外国人来日本不满半年能开银行账户吗 | /japan_credit_card.html |
| Q02 | zh | 在日外国人申请信用卡的顺序，被拒后多久可以再申 | /japan_credit_card.html |
| Q03 | zh | 特定在留卡对银行开户和信用卡审查有什么影响 | /japan_credit_card.html |
| Q04 | zh | 外国人在日本转职 doda 和 Recruit Agent 哪个好 | /转职.html |
| Q05 | zh | 外国人怎么买日本演唱会门票 | /japan_ticket.html |
| Q06 | ja | 学マスをMacで遊ぶ方法 | /gkmas_mac.html |
| Q07 | ja | 学マス Mac 画面が真っ黒になる | /gkmas_mac.html |
| Q08 | en | how to play Gakumas on Mac | /gkmas_mac_en.html |
| Q09 | ja | 麻倉もも 写真集「ただいま、おかえり」ロケ地 | /mocho_junrei.html |
| Q10 | ja | 麻倉もも Apiacere 長崎 聖地巡礼 | /mocho_junrei_nagasaki.html |
| Q11 | ja | MyGO!!!!! 聖地巡礼 場所 | /MyGO!!!!!_Junrei.html |
| Q12 | ja | console.log の代わりに Logpoints を使う | /logpoint.html |
| Q13 | ja | Mune Akira のブログ Henceforth | /about/（实体识别：能否正确说出作者和博客主题） |

## 引擎

Google AI Mode、Google 普通搜索（看有没有出现 AI Overview）、ChatGPT（开启搜索）、Perplexity、Claude（开启网页搜索）、Microsoft Copilot、Gemini。

## 记录规则

- 每次使用新的无痕窗口或新对话；尽量不登录，登录了就在备注里写明。
- 记下地区和界面语言（例如 JP / ja）。每次保持一致。
- 每个「查询 × 引擎」至少跑 1 次；Q01、Q06、Q08 各跑 3 次，看结果稳不稳定。
- 所有完成的回答都要计入分母，包括没有引用任何来源、或根本没出现 AI 回答的情况。请求失败的单独记。
- 突出程度：`主要`（第一个展示的来源）/ `次要`（其他被引用的来源）/ `仅提及`（提到博客或作者但没给链接）/ `无`。
- 汇总时写成计数加比例，例如 `ChatGPT 引用 3/13`，不要只写百分比。

## 记录表

| 日期 | 引擎 | 模式 | 查询 ID | 第几次 | 是否引用 | 被引用的 URL | 突出程度 | 备注（截图文件名等） |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |
