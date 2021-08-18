---
title: Fiddler：HTTP 抓包能手 & 常見「特殊」用途
date: 2021-08-08 20:51:22
categories:
- DevTools
tags:
- Http Proxy
- Fiddler
updated:
top_img:
cover:
keywords:
description:
comments:
---
## 前言
你是否曾經有這些困擾呢?
1. 戳 API 想要修改前端 Request 送出去的 json，但 JS 被 uglify 很難追、或是開 Postman 但要處理認證、授權、和整包 json 很麻煩。
2. 承上，想看的是 UI 與 JS 後續行為，Postman 愛莫能助。
3. 在 local 調整完檔案（HTML、CSS、JS、Image...etc），想上到**正式環境**測試一下效果，但又不想真的改到正式環境的檔案?
4. 修改 Response 回傳的資料（EX: 修改**後端 API** 回傳的使用者權限、查詢結果、新增成功與否...etc，導致前端畫面上的變化）。
5. IDE 都可以下中斷點，不管啦，我的每個 HTTP Request & Response 也要可以下中斷點，即時查看、修改、決定要不要 drop 掉封包。

如果有任一個需求符合，用 Fiddler 就對了!

### 本文內容：
1. 什麼是 Fiddler，和 Postman、Wireshark 的差異?
2. 實際抓包操作 & 過濾不需要的內容
3. 設定 AutoResponder 自訂（修改）回傳內容
4. 中斷每個 Request 或 Response 的方法
5. 介紹一些「特殊」的用途（請守法，未經許可下，不要試圖做出損害他人權利之行為）

## 什麼是 Fiddler
老樣子，我們先看[維基百科](https://zh.wikipedia.org/wiki/Fiddler)的定義
> Fiddler 是一個用於 HTTP 調試的代理伺服器應用程式

也就是說，他能夠抓取並記錄 HTTP 流量，而 HTTPS 也可以利用自簽名證書實現 Man-in-the-middle attack 進行記錄。

### 運作流程
![Image](https://i.imgur.com/eC9mrmw.png)

Client 與 Server 之間的 Request 和 Response 都將經過 Fiddler，由 Fiddler 進行轉發，此時他以代理伺服器的方式存在。

白話一點來講，可以把圖中的 Fiddler 當成送信的郵差，只要他願意，他可以偷看寄件者寫了什麼東西，甚至是串改信件內容，而收件者回信時，也可以先偷看收件者回了什麼，當然也可以串改信件內容。

### 常見工具比較
1. Wireshark：擷取各種網路封包，除了 HTTP，也可以看其他協議如 TCP、UDP、Socket...etc。
2. Postman：用於調試 API，能夠發送 HTTP 請求與接收回傳結果。
3. 瀏覽器開發者工具：單純只看 Network 的話，也可以擷取 HTTP Request & Response
4. Fiddler：能夠像 Postman 單純發送請求、也可以擷取 HTTP 流量、但是多了一個攔截修改封包的功能

該用何者工具主要還是要依照當下的需求，如果你只是想看 Request & Response 到底收發了什麼東西，直接 F12 開起來看，簡單快速。

如果是想要調試 API，雖然 Fiddler 也可以做到，但 UI/UX 與相關功能的完整性，還是 Postman 會好一些。

如果是要對封包進行截取、重發、編輯等等操作，則使用 Fiddler。

### Fiddler 版本
這邊說的 Fiddler 以及接下來的示範，都會使用 Fiddler Classic 版本。

1. Fiddler Classic：只能在 Windows 執行，免費使用，功能齊全，但介面對新手比較不友善。
![Image](https://i.imgur.com/UMDdyXQ.png)

2. Fiddler Everywhere：跨平台，介面友善，一樣能夠修改封包內容，但沒辦法中斷請求以便即時修改，只能設定好 AutoResponder 來修改內容，在 2021/06/29 [V2.0 發布後](https://www.telerik.com/support/whats-new/fiddler-everywhere/release-history)，沒有辦法再免費使用（V1.X 是可以免費使用，但也可以付費獲取更多功能）。
![Image](https://i.imgur.com/UQZgIER.png)

順便提一下歷史背景，2003 年 Fiddler 誕生，在 2012 年被 Telerik 收購，原作者在 2015 年離開 Telerik 跑去 Google，所以 2015 年之後就是由 Telerik 繼續開發，然後 2018 年發布第一版的 Fiddler Everywhere。

與 Fiddler 相似的抓包工具，還有大名鼎鼎的 BurpSuite（抓包應該只能算他的其中一個功能，他是以測試網路應用程式安全性為主，有興趣的可以去載來玩玩看，有閹割過的免費社群版可以用，喜歡的話也可以購買專業版，只是價格很高就是了，一年 399 美金，而且沒辦法買斷），如果是 Mac 或 Linux 的話可以考慮 Charles（功能和 Fiddler 差不多，只有試用版，期限到了要購買，價格約 50 美金，沒有大版本更新都可以一直使用）

此處提到軟體的金額以及是否有免費的社群版，以撰文當下時間為主，未來若更新，請以各軟體公告為主。

若是軟體有幫助到你，而價錢也可以接受的話，與其花時間找其他免費的替代方案，不妨可以直接付費支持，讓作者未來繼續開發新功能。

## 實際操作
講了那麼多，來看一下怎麼使用吧。

### 安裝信任憑證(Trust root certificate)以擷取 HTTPS 流量
想要抓取 HTTPS 流量的話，要先進行以下設定

![Image](https://i.imgur.com/LpuHmfC.png)

![Image](https://i.imgur.com/tB5aLDi.png)

接著一路確定，到最後安裝完成就會看到成功的訊息

![Image](https://i.imgur.com/bvu41t9.png)


其餘設定則維持預設即可

比較可能會調整到的是預設監聽的 port，如果不想掛在 8866 上，可以自己修改。

![Image](https://i.imgur.com/4sJrxYr.png)

### 開始抓包
可以按 F12，或是左上角的 File > Capture Traffic，或者是點一下左下角紅色框框處(沒有在抓的時候什麼圖案都不會有，但還是可以點一下空白處啟動)。

![Image](https://i.imgur.com/COFpcwG.png)

隨意開啟一個網頁，就會看到所有抓到的流量，左半邊是紀錄，點選 Request，可以在右半邊的 Inspectors 看到 Request & Response 細節，包括 Headers、Cookie、Data...etc，其實就和瀏覽器的開發者工具差不多，可以很快上手。

![Image](https://i.imgur.com/hV4x1I7.png)

對 Request 按右鍵，也可以進行複製、儲存、重送、註解、highlight 等等操作。

![Image](https://i.imgur.com/fy3fJMT.png)

最上方的選單也有常用功能可以操作，像是如果想清空擷取紀錄，可以點一下 Go 旁邊的那個「X」。

![Image](https://i.imgur.com/UW1OwYH.png)

### 過濾
開始抓包後，應該很快就會有一個困擾，設備上所有 HTTP 流量都會被記錄在上面，雜亂到難以查找，有時候你只是想看一個單一的網站、或是任何 Client 端的程式軟體，如果是這樣的話，可以設定 Filter 規則。

最基本的設定就是指定 Hosts，多個 Hosts 可以用「;」隔開。

進階一點的話，可以研究一下 Hosts 區塊下方的選項，像是可以指定哪個 Process 的流量、只顯示符合設定規則的 Request 或 Response、也能夠偵測到特定的 Request 就自動進中斷點(中斷點後面會講)。

![Image](https://i.imgur.com/p9YQNVV.png)

### 調試 API
前面有提到了，如果想要像 Postman 那樣發請求也是可以的，切換頁籤到 Composer 即可，發送的請求也會出現在左邊區塊的紀錄裡面。

![Image](https://i.imgur.com/IHyd7Eh.png)

## 修改封包
