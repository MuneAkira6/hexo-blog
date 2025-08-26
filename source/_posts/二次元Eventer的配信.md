---
title: Eventer向配信教程
date: 2024-7-5 01:23:56
tags:
  - Pseudo-tech
categories:
  - Tech
---

## 序

二次元Eventer，姑且这么称呼。似乎还没有形成一个稳定庞大的社区，多数人喜欢沉浮在各大Q群中，情报内部流转。那么对于不加群的人，想找到相关信息就非常困难了。

这里分享一些个人掌握的信息。

现地看这里：http://muneakira6.github.io/japan_anime_travel.html

## 一、配信抓源

一般我的习惯是：

- 先用`yt-dlp`试试，能不能直接下载
- abema、niconico这两个网站，个人习惯用`minyami`(https://github.com/Last-Order/Minyami)
- 除`yt-dlp`之外，还可以使用`猫抓`(https://github.com/xifangczy/cat-catch)

个人目前使用的所有配信网站，使用上述三个工具都可以成功下载。

其他常用工具：

- ffmpeg
- N_m3u8DL-RE(https://github.com/nilaoda/N_m3u8DL-RE)
- shaka-packger(https://github.com/shakacode/shakapacker)

## 二、widevine DRM破解

抓源是非常简单的操作了。但是有的网站开了widevine加密，即使抓到了源，也会发现信息被加密，播放时候一堆乱码。

### 2-0 背景知识

日本各大配信平台目前的主流加密方式是widevine L3。是软件层的加密。像美国的网飞、Disney+使用的是widevine L1，硬件级别的加密，破解起来十分困难。相比之下，widevine L3的破解已经非常成熟和无脑了。

破解widevine L3需要一个叫CDM的文件，可以理解为解密的钥匙。CDM来自于已Root的安卓手机或者各安卓模拟器。

### 2-1 最简单的方式

使用这个伟大的扩展：https://github.com/DevLARLEY/WidevineProxy2

这个扩展安装以后，需要自己指定CDM的路径。项目仓库的readme给出了一些公开的CDM，也可以直接指定remote.json，相当于0配置。

勾选use shaka packager，可执行文件路径填 N_m3u8DL-RE 即可。

### 2-2 获取你自己的CDM

如果不想用网上公开的CDM，希望有自己的CDM，可以看这里：

https://forum.videohelp.com/threads/408031-Dumping-Your-own-L3-CDM-with-Android-Studio

如果像我一样使用macOS，可以再多看一眼这个文章：

https://muneakira6.github.io/DRM.html

成功操作的话，会获得`client_id.bin` 和 `private_key.pem` 这两个文件。可以执行以下脚本获取更常用的`device.wvd`文件。需要先安装`pywidevine`。

```python
from from pywidevine.device import Device, DeviceTypes
from pathlib import Path

# e.g., for an Android L3:
device = Device(
    type_=DeviceTypes.ANDROID,
    security_level=3,
    flags=None,
    private_key=Path(r"./private_key.pem").read_bytes(),
    client_id=Path(r"./client_id.bin").read_bytes()
)
# save it to a .wvd file for easier loading next time
device.dump(r"./device.wvd").device import Device, DeviceTypes
from pathlib import Path

# e.g., for an Android L3:
device = Device(
    type_=DeviceTypes.ANDROID,
    security_level=3,
    flags=None,
    private_key=Path(r"./private_key.pem").read_bytes(),
    client_id=Path(r"./client_id.bin").read_bytes()
)
# save it to a .wvd file for easier loading next time
device.dump(r"./device.wvd")
```

提取出自己的wvd文件以后，可以继续使用WidevineProxy2加载这个文件使用。也可以自己写脚本抓源破解。

### 2-3 写脚本

与其讲解，不如直接放代码。下面是用来获取lemino上某视频的代码。需要自己准备 PSSH 和 challenge URL。

```python
from pywidevine.cdm import Cdm
from pywidevine.device import Device
from pywidevine.pssh import PSSH

import requests

# prepare pssh
pssh = PSSH("AAAAWXBzc2gAAAAA7e+LqXnWSs6jyCfc1R0h7QAAADkSEOYdj2TadksnpIvFVywqce0aDXdpZGV2aW5lX3Rlc3QiEPR0I5eZdEKvsvQ4vdFlEsJI49yVmwY=")

# load device
device = Device.load("./device.wvd")

# load cdm
cdm = Cdm.from_device(device)

# open cdm session
session_id = cdm.open()

# get license challenge
challenge = cdm.get_license_challenge(session_id, pssh)

headers = {
    "accept": "*/*",
    "accept-language": "ja,en-US;q=0.9,en;q=0.8",
    "acquirelicenseassertion": "XXX",
    "cache-control": "no-cache",
    "origin": "https://lemino.docomo.ne.jp",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "referer": "https://lemino.docomo.ne.jp/",
    "sec-ch-ua": '"Chromium";v="134", "Not:A-Brand";v="24", "Microsoft Edge";v="134"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0",
}

licence = requests.post("https://drm.lemino.docomo.ne.jp/widevine_license", data=challenge, headers=headers)
licence.raise_for_status()

# parse license challenge
cdm.parse_license(session_id, licence.content)

# print keys
for key in cdm.get_keys(session_id):
    print(f"[{key.type}] {key.kid.hex}:{key.key.hex()}")

# close session, disposes of session data
cdm.close(session_id)
```

执行成功的话，控制台会出现：

```
[CONTENT]aaa:bbb
```

aaa:bbb就是我们所需要的key了。

手持这个key，就可以使用 N_m3u8DL-RE 下载了。需要找到在线mpd文件的url，有时需要请求头里带cookie。

```bash
./N_m3u8DL-RE -M format=mp4 "https://vod-cdn0.lemino.docomo.ne.jp/video/l0m8/8a/l0m88aj8wi/20250326232640/manifest.mpd?resolution=1080&fixed=0" --key "aaa:bbb" --use-shaka-packager -sv best -sa best
```
