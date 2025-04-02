---
title: Dumping My own L3 CDM with Android Studio
date: 2025-04-02 00:23:56
tags:
  - Pseudo-tech
categories:
  - Tech
---

## Ref
https://forum.videohelp.com/threads/408031-Dumping-Your-own-L3-CDM-with-Android-Studio

https://github.com/wvdumper/dumper/issues/31#issuecomment-1745622411


## Step

### 1. Android Studio
Pixel 4 XL API 29 No Google Play

### 2. download frida-server

`frida-server-16.0.2-android-arm64`

### 3. 
```shell
adb devices
adb push frida-server-16.0.2-android-arm64 /sdcard
adb shell

su
mv /sdcard/frida-server-16.0.2-android-arm64 /data/local/tmp
chmod +x /data/local/tmp/frida-server-16.0.2-android-arm64
/data/local/tmp/frida-server-16.0.2-android-arm64
```

keep this window open!

### 4. dumper
https://github.com/wvdumper/dumper

```shell
Package      Version
------------ -------
frida        16.7.4
pip          25.0
protobuf     3.20.3
pycryptodome 3.22.0
```

`python dump_keys.py`

### 5. edit dumper

```shell
adb pull /vendor/lib64/libwvhidl.so
nm -gD libwvhidl.so
```

the output will be like:
```shell
000000000023fe14 T v2i_ASN1_BIT_STRING
000000000023dfac T v2i_GENERAL_NAME
000000000023ded0 T v2i_GENERAL_NAMES
000000000023dfc4 T v2i_GENERAL_NAME_ex
000000000026eb00 T vehbyocv
00000000002710f8 T ygjiljer
0000000000270098 T yhwxewib
000000000026ed48 T ywbqglwf
000000000026e518 T zlhgtlbc
0000000000270b90 T znyuaxnv
000000000026ecd0 T zqajgkxr
```

Add all the 8-digit function names to `dumper/Helpers/script.js`.

```js
const KNOWN_DYNAMIC_FUNC = ['ulns', 'cwkfcplc', 'dnvffnze', 'vehbyocv', 'ygjiljer', 'yhwxewib', 'ywbqglwf', 'zlhgtlbc', 'znyuaxnv', 'zqajgkxr']; 
```

### 6. 

Now, there are two windows opening.
Then launch the emulator and go to `https://bitmovin.com/demos/drm`.

the magic will happen!

