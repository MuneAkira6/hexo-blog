---
title: How to Play Gakumas (Gakuen Idol Master) on Mac: Sideloady Guide
date: 2025-05-12 01:23:56
description: A complete guide on how to play Gakumas (Gakuen Idol Master) on Mac using Sideloady. Learn how to fix the black screen issue and run the iOS app on your Mac.
keywords: Gakumas, Gakuen Idol Master, Mac, Sideloady, iOS app, Gaming, Tutorial, M1 Mac, M2 Mac
tags:
  - Gakumas
  - Gakuen Idol Master
  - Mac
  - Sideloady
  - Gaming
categories:
  - Tech
---

## Introduction

Gakumas（Gakuen Idol Master） is originally an app for iOS / Android, but there is a way to run it on a Mac.
Here, I will summarize the steps to install the IPA file on a Mac using **Sideloady** and actually run it, as well as the problems encountered and their solutions.

Japanese refs:

- https://note.com/hoy0verse/n/n043bb3308a0d#5e54f119-c5eb-45a0-bc8f-00c03c283214
- https://misskey.io/notes/a5pvn728kcix0312

## Steps

You can mostly understand it by looking at the refs mentioned above.

### 1. Install Sideloady

First, download and install [Sideloady](https://sideloady.io/).

### 2. Download Gakumas IPA file

### 3. Sideload

### 4. Launch!

A problem occurred here. The login screen is normal, but when the download starts, the screen turns black. (This happens probably because it switches to landscape display)

## Solution

Inject this into the IPA.

```xml
<key>UISupportedInterfaceOrientations</key>
<array>
  <string>UIInterfaceOrientationPortrait</string>
  <string>UIInterfaceOrientationPortraitUpsideDown</string>
  <string>UIInterfaceOrientationLandscapeLeft</string>
  <string>UIInterfaceOrientationLandscapeRight</string>
</array>
```

Sideload again.

If the screen turns black again, switching `View` -> `Landscape`/`Portrait` from the top left menu should fix it.

![Gakumas running on Mac via Sideloady](https://imgur.com/lAah548.jpg)

## Issues

- Display resolution remains at iPad specifications
- UI is slightly unnatural as it is not optimized for Mac
