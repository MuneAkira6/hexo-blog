---
title: Dumping My own L3 CDM with Android Studio
date: 2025-04-02 00:23:56
tags:
  - Pseudo-tech
categories:
  - Tech
---

## Introduction

While exploring Widevine DRM and its L3 implementation, I experimented with extracting my own Content Decryption Module (CDM) keys using **Android Studio** and **Frida**.
This post documents my environment, the exact steps I followed, and a few notes that might save time for anyone attempting the same process.

## Environment

- **Machine**: Mac Mini (M2 Chip)
- **OS**: macOS 15.2
- **Emulator**: Pixel 4 XL, API 29 (without Google Play)

## Step 1 — Android Studio Setup

Create and launch an emulator.
For my setup, I used a Pixel 4 XL image running API 29 without Google Play services.

## Step 2 — Download Frida Server

Obtain the matching Frida server binary for the emulator’s architecture:

```
frida-server-16.0.2-android-arm64
```

## Step 3 — Push Frida to the Emulator

```
adb devices
adb push frida-server-16.0.2-android-arm64 /sdcard
adb shell

su
mv /sdcard/frida-server-16.0.2-android-arm64 /data/local/tmp
chmod +x /data/local/tmp/frida-server-16.0.2-android-arm64
/data/local/tmp/frida-server-16.0.2-android-arm64
```

Leave this shell running — Frida must stay active in the background.

## Step 4 — Dumper Setup

Clone and configure wvdumper.
My Python environment looked like this:

```
Package      Version
------------ -------
frida        16.7.4
pip          25.0
protobuf     3.20.3
pycryptodome 3.22.0
```

Then simply run:

```
python dump_keys.py
```

## Step 5 — Identifying Functions in libwvhidl.so

Pull the library from the emulator:

```
adb pull /vendor/lib64/libwvhidl.so
nm -gD libwvhidl.so
```

The output includes multiple function names, such as:

```
000000000026eb00 T vehbyocv
00000000002710f8 T ygjiljer
0000000000270098 T yhwxewib
...
```

Add all suspicious-looking 8-character function names to dumper/Helpers/script.js. For example:

```js
const KNOWN_DYNAMIC_FUNC = ["vehbyocv", "ygjiljer", "yhwxewib", "ywbqglwf", "zlhgtlbc", "znyuaxnv", "zqajgkxr"];
```

## Step 6 — Running the Demo

At this point, you should have two terminal windows:

- one with the Frida server running,
- one executing dump_keys.py.

Now launch the emulator and visit https://bitmovin.com/demos/drm

If everything is configured correctly, the **magic happens**: the dumper intercepts and reveals the keys.

## Closing Thoughts

This walkthrough is less of a polished tool release and more of a record of my own exploration. Still, it shows how approachable Widevine L3 research can be with the right setup.

By combining Android Studio, Frida, and a bit of reverse-engineering curiosity, you can peek into how DRM operates at a lower level — and that’s an exciting learning experience for any developer.

## Ref

https://forum.videohelp.com/threads/408031-Dumping-Your-own-L3-CDM-with-Android-Studio

https://github.com/wvdumper/dumper/issues/31#issuecomment-1745622411
