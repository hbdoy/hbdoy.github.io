---
title: 一次滲透測試的紀錄
date: 2023-06-04 18:21:26
categories:
- Security
tags:
- penetration test
- red team
updated:
top_img: /image/penetration-test/bg.jpg
cover: /image/penetration-test/bg.jpg
keywords:
description:
comments:
---

# 前言
> 被可(ㄑ一ˊ)愛(ㄍㄨㄞˋ)的同事監視，慢慢把一些手邊的筆記整理成文章。

在某間公司任職時，同事間如果有通話需求，會使用 SIP 電話來進行溝通。

但該 SIP 系統已經運行多年，公司預計要汰換掉它，當時的主管之一想說下架之前可以對它做一些安全性的檢測，所以就有了這篇文章。

> ps. 因為當時主管對團隊規劃其中一個方向是希望 team 內除了開發能力之外，也可以具備一些紅隊的能力，自己的系統安全性自己要顧。

# 本文開始
## 重要
``以下行為皆在取得相關人員的授權後進行``，本文僅作為 Writeup，請讀者閱讀後不要自行嘗試，產生的任何後果接與本站無關。

> 別人家裡門沒鎖，不代表你可以走進去，就算是嘗試也不行。

![Image](/image/penetration-test/0.jpg)

## 訊息蒐集

先掃掃 server 開了哪些 port

![Image](/image/penetration-test/1.jpg)

再爆破路徑

![Image](/image/penetration-test/2.jpg)

![Image](/image/penetration-test/3.jpg)

大致知道 SIP 系統相關的服務以及後台入口

![Image](/image/penetration-test/4.jpg)

![Image](/image/penetration-test/5.jpg)

![Image](/image/penetration-test/6.jpg)

## 漏洞查找
查了一下 Elastix 有 ``LFI`` 的問題

![Image](/image/penetration-test/7.jpg)

![Image](/image/penetration-test/8.jpg)

> LFI (Local File Inclusion)
> LFI 最大的漏洞成因在於後端程式語言使用 include 引入其他檔案的時候，沒有去驗證輸入的值或是惡意攻擊者繞過驗證，導致敏感資料外洩，而敏感資料外洩的資料是在伺服器 local 端，所以這個漏洞叫做 local file inclusion。
> 常見的敏感路徑如 ``/etc/passwd``、``/etc/shadow``、...

直接讀取 ``/etc/asterisk/sip_additional.conf`` 取得所有分機明文密碼

![Image](/image/penetration-test/9.jpg)

## 敏感路徑
外人打進公司的電話似乎會自動錄音，但此路徑沒有特別設權限，可能會讓有心人士得以冒充身分

![Image](/image/penetration-test/10.jpg)

## 爆破後台密碼
繼續用 ``LFI`` 讀取到 ``/var/www/db/acl.db``，裡面存放管理員帳號與密碼，但密碼是 MD5 Hash 過的

![Image](/image/penetration-test/11.jpg)

碰碰運氣，結果管理員使用弱密碼，系統也沒加鹽，直接碰撞出密碼

![Image](/image/penetration-test/12.jpg)

這裡也可以反思一下，只要加鹽了就一定安全嗎?

![Image](/image/penetration-test/36.jpg)

## 後台登入
![Image](/image/penetration-test/13.jpg)

![Image](/image/penetration-test/14.jpg)

> 目前危害: 有後台 & Asterisk Call Manager & FreePBX 帳密
> 1. 可以監聽通話或通話轉接?
> 2. 冒充身分進行社交工程?
> 3. 若有員工到處都使用同一組密碼...?

## Next
繼續翻一下還有沒有可以利用的地方

發現了模組存放的路徑，看起來透過 FreePBX 安裝的模組都會出現在這裡

![Image](/image/penetration-test/15.jpg)

看到這個直覺想到或許有機會上傳 ``WebShell``

## WebShell
寫了個簡單的 shell 打包後上傳

![Image](/image/penetration-test/16.jpg)

![Image](/image/penetration-test/17.jpg)

![Image](/image/penetration-test/18.jpg)

盡量取了個不引人耳目的名字 ``checkforupdate.php``

![Image](/image/penetration-test/19.jpg)

執行成功!

![Image](/image/penetration-test/20.jpg)

> 補充一下 ``WebShell`` 原理

![Image](/image/penetration-test/37.jpg)

## Shell GUI Tool
一直寫指令太麻煩了，找了個工具連上去，但不知道是不是系統過舊，有些傳輸協議有問題，比較熱門的幾個 tool 都連接失敗，最終用了經典的``菜刀``連上去。

![Image](/image/penetration-test/21.jpg)

![Image](/image/penetration-test/22.jpg)

## 提權
目前的帳號權限太低，開始嘗試提權

![Image](/image/penetration-test/23.jpg)

但馬上遇到幾個問題

1. 有防火牆，``Reverse Shell`` 一直彈不出來，拿不到交互式 Shell，也沒辦法進一步拿到 ``tty``。

![Image](/image/penetration-test/24.jpg)

2. ``ssh`` 也被防火牆擋住連不進去，就算有 ``root`` 帳密也沒辦法用。

> 補充 ``Bind Shell`` & ``Reverse Shell``

![Image](/image/penetration-test/38.jpg)

> ``Bind Shell``、``Reverse Shell``，因為無法提供完整交互式的互動，所以會再進一步嘗試取得交互式的 Shell。
> EX: 按上會顯示上一個輸入的指令、sudo(su)、添加帳號密碼。

## Next
更換了一下思路，提權後不能直接執行 su 或 ssh 就算了，只要有辦法使用得到的 root 帳戶執行命令也可以。

## 提權 Again
用 ``LFI`` 看了一下 OS 的版本

![Image](/image/penetration-test/25.jpg)

確定系統很舊，應該會有漏洞可以使用

![Image](/image/penetration-test/26.jpg)

掃了一下有出現幾個重大漏洞

![Image](/image/penetration-test/27.jpg)

其中一個是 ``Dirty Cow``

![Image](/image/penetration-test/28.jpg)

載了 ``exploit`` 編譯

![Image](/image/penetration-test/29.jpg)

![Image](/image/penetration-test/30.jpg)

成功執行，得到了一個 ``root`` 權限的帳號

![Image](/image/penetration-test/31.jpg)

## Get Root
用 ``root`` 權限執行命令，有嘗試 ``echo <pass> | sudo -S -u <root_user> command``

但沒辦法，最後使用 ``pty.spawn`` 執行 ``su -c command`` 可行

![Image](/image/penetration-test/32.jpg)

### Root Test
![Image](/image/penetration-test/33.jpg)

![Image](/image/penetration-test/34.jpg)

![Image](/image/penetration-test/35.jpg)

## Code audit
過程中也有翻一下 server 上的檔案，發現一隻 perl script 裡面有 ``LDAP`` 管理員的帳號密碼

看看 source code 有時候也會有意外收穫

![Image](/image/penetration-test/40.jpg)

# 總結
不是全職做這件事情，上班摸一點、下班摸一點，印象中前前後後大概花了快一個禮拜才結束。

## 問題
1. Elastix、FreePBX 版本過舊，且後台密碼太弱，透過 ``LFI`` 拿到密碼，可以``查看`` & ``修改`` SIP 密碼，或是``錄製通話``。
2. 後台上傳 ``WebShell`` 且 SIP Server OS 版本過舊，進一步被拿到 ``root 權限``執行命令。

## 修補建議
1. 將沒用到的舊系統拿掉，避免版本過舊造成的漏洞，EX: ``LFI``、``XSS``、``RCE`` … etc。
2. 更新 OS
3. 把 Server 所有服務的密碼都修改掉 & 檢查密碼強度，EX: ``DB``、``Asterisk Call Manager``、``LDAP`` … etc。

## 最後
1. 資安防禦的難點在於，往往不是一個致命的漏洞，而是好幾個小漏洞串聯起來，造成嚴重的後果。
2. 攻擊者的門檻在於，如何利用已知訊息，制定下一步的思路，所以擁有廣泛且扎實的基礎知識，會更有幫助。

分享這些，希望
1. 能夠讓大家提升資安意識
2. 時刻警惕著，可能會有人默默幫你的 server 備份(幫備份)

> ``Hacker`` 與 ``Cracker`` 往往只有一線之隔。
> 最後再次嚴肅地提醒，沒有得到對方授權許可的情況下，請不要執行任何可能會造成對方系統損害與權益損失之行為。
