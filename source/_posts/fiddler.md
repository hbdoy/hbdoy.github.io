---
title: 玩轉 Fiddler－HTTP(s) 抓包能手 & 常見「特殊」用途
date: 2021-08-23 20:51:22
categories:
- DevTools
tags:
- Http Proxy
- Fiddler
updated:
top_img: /image/XWC627z.png
cover: /image/XWC627z.png
keywords:
description:
comments:
---
# 前言
你是否曾經有這些困擾呢?
1. 戳 API 想要修改前端 Request 送出去的 JSON，但 JS 被 uglify 很難追、或是開 Postman 但要處理認證、授權、和整包 JSON 很麻煩。
2. 承上，想看的是 UI 與 JS 後續行為，Postman 愛莫能助。
3. 想測試後端驗證，但前端已經有驗證，想測試還要先拔掉前端驗證的 code。
4. 在 Local 調整完檔案（HTML、CSS、JS、Image...etc），想上到**正式環境**測試一下效果，但又不想真的改到正式環境的檔案?
5. 修改 Response 回傳的資料（EX: 修改**後端 API** 回傳的使用者權限、查詢結果、新增成功與否...etc，導致前端畫面上的變化）。
6. IDE 都可以下中斷點，不管啦，我的每個 HTTP Request & Response 也要可以下中斷點，即時查看、修改、決定要不要 drop 掉封包。

如果有任一個需求符合，用 Fiddler 就對了!

> PS. 以下文長慎入，可以選擇自己需要的內容閱讀就好。

## 本文內容：
1. 什麼是 Fiddler，和 Postman、Wireshark 的差異?
2. 實際抓包操作 & 過濾不需要的內容
3. 設定 AutoResponder 自訂（修改）回傳內容
4. 中斷每個 Request 或 Response 的方法
5. 實戰演練，Fiddler 抓不到特定應用程式的封包？
6. 介紹一些「特殊」的用途（未經許可下，不要做出侵害他人權利之行為）

# 什麼是 Fiddler
老樣子，我們先看[維基百科](https://zh.wikipedia.org/wiki/Fiddler)的定義
> Fiddler 是一個用於 HTTP 調試的代理伺服器應用程式

也就是說，他能夠抓取並記錄 HTTP 流量，而 HTTPS 也可以利用自簽名證書實現 Man-in-the-middle attack 進行記錄。

## 運作流程
![Image](/image/eC9mrmw.png)

Client 與 Server 之間的 Request 和 Response 都將經過 Fiddler，由 Fiddler 進行轉發，此時他以代理伺服器的方式存在。

白話一點來講，可以把圖中的 Fiddler 當成送信的郵差，只要他願意，他可以偷看寄件者寫了什麼東西，甚至是串改信件內容，而收件者回信時，也可以偷看&串改。

## 常見工具比較
1. Wireshark：擷取各種網路封包，除了 HTTP，也可以看其他協議如 TCP、UDP、Socket...etc。
2. Postman：用於調試 API，能夠發送 HTTP 請求與接收回傳結果。
3. 瀏覽器開發者工具：單純只看 Network 的話，也可以擷取 HTTP Request & Response
4. Fiddler：能夠像 Postman 單純發送請求、也可以擷取 HTTP 流量、但是多了一個攔截修改封包的功能

該用何者工具主要還是要依照當下的需求，如果你只是想看 Request & Response 到底收發了什麼東西，直接 F12 開起來看，簡單快速。

如果是想要調試 API，雖然 Fiddler 也可以做到，但 UI/UX 與相關功能的完整性，還是 Postman 會好一些。

如果是要對封包進行截取、重發、編輯等等操作，或是要側錄手機上 APP 的封包，則使用 Fiddler。

## Fiddler 版本
這邊說的 Fiddler 以及接下來的示範，都會使用 Fiddler Classic 版本。

1. Fiddler Classic：只能在 Windows 執行，免費使用，功能齊全，但介面對新手比較不友善。
![Image](/image/UMDdyXQ.png)

2. Fiddler Everywhere：跨平台，介面友善，一樣能夠修改封包內容，但沒辦法中斷請求以便即時修改，只能設定好 AutoResponder 來修改內容，在 2021/06/29 [V2.0 發布後](https://www.telerik.com/support/whats-new/fiddler-everywhere/release-history)，沒有辦法再免費使用（V1.X 是可以免費使用，但也可以付費獲取更多功能）。
![Image](/image/UQZgIER.png)

順便提一下歷史背景，2003 年 Fiddler 誕生，在 2012 年被 Telerik 收購，原作者在 2015 年離開 Telerik 跑去 Google，所以 2015 年之後就是由 Telerik 繼續開發，然後 2018 年發布第一版的 Fiddler Everywhere。

與 Fiddler 相似的抓包工具，還有大名鼎鼎的 BurpSuite（抓包應該只能算他的其中一個功能，他是以測試網路應用程式安全性為主，有興趣的可以去載來玩玩看，有閹割過的免費社群版可以用，喜歡的話也可以購買專業版，只是價格很高就是了，一年 399 美金，而且沒辦法買斷），如果是 Mac 或 Linux 的話可以考慮 Charles（功能和 Fiddler 差不多，只有試用版，期限到了要購買，價格約 50 美金，沒有大版本更新都可以一直使用）

此處提到軟體的金額以及是否有免費的社群版，以撰文當下時間為主，未來若更新，請以各軟體公告為主。

若是軟體有幫助到你，而價錢也可以接受的話，與其花時間找其他免費的替代方案，不妨可以直接付費支持，讓作者未來繼續開發新功能。

# 實際操作
講了那麼多，來看一下怎麼使用吧。

## 安裝信任憑證(Trust root certificate)以擷取 HTTPS 流量
想要抓取 HTTPS 流量的話，要先進行以下設定

![Image](/image/LpuHmfC.png)

![Image](/image/tB5aLDi.png)

接著一路確定，到最後安裝完成就會看到成功的訊息

![Image](/image/bvu41t9.png)


其餘設定則維持預設即可

比較可能會調整到的是預設監聽的 port，如果不想掛在 8866 上，可以自己修改。

![Image](/image/4sJrxYr.png)

## 開始抓包
可以按 F12，或是左上角的 File > Capture Traffic，或者是點一下左下角紅色框框處(沒有在抓的時候什麼圖案都不會有，但還是可以點一下空白處啟動)，啟動會顯示 Capturing。

![Image](/image/COFpcwG.png)

隨意開啟一個網頁，就會看到所有抓到的流量，左半邊是紀錄，點選 Request，可以在右半邊的 Inspectors 看到 Request & Response 細節，包括 Headers、Cookie、Data...etc，其實就和瀏覽器的開發者工具差不多，可以很快上手。

![Image](/image/hV4x1I7.png)

對 Request 按右鍵，也可以進行複製、儲存、重送、註解、highlight 等等操作。

![Image](/image/fy3fJMT.png)

最上方的選單也有常用功能可以操作，像是如果想清空擷取紀錄，可以點一下 Go 旁邊的那個「X」。

![Image](/image/UW1OwYH.png)

## 過濾
開始抓包後，應該很快就會有一個困擾，設備上所有 HTTP 流量都會被記錄在上面，雜亂到難以查找，有時候你只是想看一個單一的網站、或是任何 Client 端的程式軟體，如果是這樣的話，可以設定 Filter 規則。

最基本的設定就是指定 Hosts，多個 Hosts 可以用「;」隔開。

進階一點的話，可以研究一下 Hosts 區塊下方的選項，像是可以指定哪個 Process 的流量、只顯示符合設定規則的 Request 或 Response、也能夠偵測到特定的 Request 就自動進中斷點（中斷點後面會講）。

![Image](/image/p9YQNVV.png)

## 調試 API
如果想要像 Postman 那樣發請求，Fiddler 也是可以做到的。

切換頁籤到 Composer 即可，發送的請求也會出現在左邊區塊的紀錄裡面。

![Image](/image/IHyd7Eh.png)

# 修改封包
介紹的時候有提到，Fiddler 就像是郵差一樣，可以修改寄件者與收件者的信件內容。

修改的方式如同 IDE 中斷點一樣，可以決定是要卡住 Request 還是 Response，卡住後可以修改裡面的內容，改完再放行。

進中斷點（以 Response 為例），可以修改原先預期回傳的內容，不管是 HTML、CSS、JS、JSON 都可以（紅 1），也可以修改回傳的 HTTP Status Code（紅 2），確定後，就點 Run to Completion（紅 3）讓封包繼續傳給 Client 端（EX: Browser）。

![Image](/image/1p9juay.png)

除了修改內容或是 HTTP Status Code 以外，Choose Response 最下面有一個「Find a file」，點了之後可以選擇一個 Local 端的檔案，取代掉原本回傳的內容。

這個在開發測試滿好用的，像是你改了新的一版 JS，Local 簡單測試沒有問題後，想上到正式環境看一下效果，但又怕修改的 JS 有問題，那就可以考慮這種方法，連到正式機的網頁，然後攔截舊版 JS，替換成新的 JS。

![Image](/image/KWl5dbR.png)

## 補充
如果想要把所有卡住的請求都直接放行，可以點快速功能中的「Go」

![Image](/image/2HtjTOX.png)

## 範例情境
呼應一下**前言**提到的情境，都是下中斷點可以解決的。

**卡 Request**
- 戳 API 想要修改前端 Request 送出去的 JSON，但 JS 被 uglify 很難追、或是開 Postman 但要處理認證、授權、和整包 JSON 很麻煩。
- 承上，想看的是 UI 與 JS 後續行為，Postman 愛莫能助。
- 想測試後端驗證，但前端已經有驗證，想測試還要先拔掉前端驗證的 code。

**卡 Response**
- 在 Local 調整完檔案（HTML、CSS、JS、Image...etc），想上到**正式環境**測試一下效果，但又不想真的改到正式環境的檔案?
- 修改 Response 回傳的資料（EX: 修改**後端 API** 回傳的使用者權限、查詢結果、新增成功與否...etc，導致前端畫面上的變化）。

## 中斷點設定方式
中斷點有以下幾種設定方式：
1. Global 層級下中斷點
2. 設定 AutoResponder
3. QuickExec 打指令
4. Filter 簡單規則自動進中斷點

### Global 直接開啟 Automatic breakpoints
顧名思義，開啟後所有的 Request 或 Response 都會進入中斷點，在設定好 Filter 不會有太多不相干流量的情況下，也是滿好用的，不用在特別設定什麼規則。

開啟的方式可以選單點，或是 F11 快捷鍵。

![Image](/image/n7Z8S2O.png)

![Image](/image/1s5M74Z.png)

以 Before Request 為例，勾選後最下面的狀態欄是一個向上的箭頭，代表作用中。

![Image](/image/gu1BzvL.png)

也可以點一下，變成 After Response，是一個向下的箭頭（很不明顯XD）。

![Image](/image/22sLdkA.png)

### 設定 AutoResponder
如果有這些情況，就可以用 AutoResponder。
1. 不想要無差別卡中斷點，只需要特定的 Request。
2. 或是自動套用 Response 的修改設定。

像是上面有提到的替換 JS，總不可能同一個 JS 檔案，每次重新整理網頁後，都要手動再選擇一次。

所以 AutoResponder 可以理解為，針對某個符合條件的網址，就按照寫好的規則自動修改它的 Response。

![Image](/image/CJk6e2Q.png)

設定步驟
1. 切換到【紅 1】頁籤
2. 勾選【紅 2】 啟用自訂規則
3. 勾選【紅 3】很重要！它的意思是沒有符合條件的網址，會直接略過，否則那些不符合條件的請求都會無法送出。

![Image](/image/N4ti2xc.png)

4. 【紅 4】點選添加規則，會在【紅 5】出現，能夠設定的條件如下，可以寫正則式、指定 URL、指定 URL & HTTP Method...etc。

像是圖中範例，我直接寫一個網址也可以XD

![Image](/image/WFEDZF0.png)

5. 最後就是設定要自動調整的 Response 內容了，和上面提到的差不多，可以選擇回傳的狀態碼，或是是想要回傳自訂檔案的話，點最後的「Find a file」。

![Image](/image/d8BlxwE.png)

如果是想要調整 Response 內容的話，點倒數第二個「Create New Response」，然後在跳出的視窗中，編寫你自己需要的 Response Headers、Cookies、JSON...etc。

![Image](/image/bqh3Yka.png)

#### 補充
如果你在 AutoResponder 想要的是，讓特定的 Request or Response 進中斷點，這也是可以做到的，只要選擇「bpu」或「bpafter」，前者是卡 Request，後者是 Response。這樣只要符合條件的請求，就會如同上面提到的 Global 中斷點那樣，可以即時操作修改。

![Image](/image/fWb7GzK.png)

還有些有趣的選項也可以試試看，像是讓特定的請求 delay、drop、redirect。

### QuickExec 打指令
如果你當下只是要讓特定的 URL 進中斷點 Debug，除了上面提到的 Global 與 AutoResponder 以外，也可以考慮輸入指令的方式。

還記得上面提到的 ``bpu``、``bpafter`` 嗎?

其實可以把指令直接打在最下方的黑色框框中（QuickExec）

![Image](/image/U2Q0kb5.png)

像是我要卡住指定 URL 的 Request 就可以這樣打，打完按下 Enter

![Image](/image/RVoe1bB.png)

就會在右下角出現當前的指令 & URL，如果想要清除指令的話，就再打一次 ``bpu``，然後不要加任何 URL，這樣就能清空上一條指令了。 

![Image](/image/CbaYuJo.png)

#### 補充
其他支援的指令如下

![Image](/image/jCD6gvu.png)

# Fiddler 抓不到特定應用程式的封包?
到此為止，已經講述了如何配置 Fiddler 抓取 HTTP(s) 流量，並且搭配 Filters 與中斷點，讓開發更加方便。

預設抓取 ``All Processes`` 下，除了 Browser 以外，有些桌面應用程式的流量也有出現在 Fiddler，但有些卻沒有，這是怎麼回事呢?

![Image](/image/XJbEZbb.png)

![Image](/image/BAzIWMC.png)

這是因為除了 Browser 以外，其他能夠抓到的情況是
1. 程式使用 WinInet 函式庫發送 HTTP/HTTPS
2. 程式內嵌 WebBrowser

那如果你還是想要抓某個應用程式，只有兩個辦法
1. 看一下該應用程式有沒有提供代理伺服器設定
![Image](/image/2IHwCj5.png)
2. 沒有的話只能透過 Proxifier 之類的工具強制代理

## 實際演練
我有購買一個影片，但影片被加密過，要用對方提供的特殊播放器，並且輸入正確的帳號密碼才能夠觀看。

![Image](/image/gmomyBd.png)

![Image](/image/QQOn1Q7.png)

但我遇到一個問題，影片是在本地端，並非線上串流，理論上我應該可以離線（斷網）觀看，但實際把網路關掉後，輸入正確的帳號密碼，卻無法播放，然後打開網路又可以正常播放，除了不方便以外，有時候就算有網路，伺服器還常常連不上...

至此猜測
1. 輸入的帳號密碼不會在軟體 Local 端計算解密 Key。
2. 或者是 Key 是在本地端計算，但可能有其他功能，像是確認軟體版本號之類的，如果無法連上網，就沒辦法播放。

有了猜想後，來抓包觀察一下，不出所料，什麼都抓不到，而且播放軟體並沒有提供代理設置的功能。

![Image](/image/gI6WNFf.png)

那就只能用上面提到的 Proxifier 來強制幫他代理吧！

PS.
1. 礙於文章篇幅，不會再介紹 Proxifier 使用方式。
2. Proxifier 是要付費的，如果你不想付費，可以尋找其他同類型的工具。

開啟 Proxifier 設定好規則

![Image](/image/kGFQD2B.png)

選擇要代理的應用程式

![Image](/image/34SMiCa.png)

接著再重新播放一次影片，可以看到 Fiddler 成功抓到播放器的封包

![Image](/image/91vlvhY.png)

在 Response 的 JSON 裡，看到了 ``play_key``，卡了一下中斷點，把其他資料都亂修改，只留下 ``play_key`` 還是可以正常播放，因此確定了上面的假設：「軟體是每次播放的時候都拿帳號密碼去戳 Server 取回解密影片的 Key」，但有趣的是，戳了好幾次 Server，每次拿回來的 Key 都一樣XD

![Image](/image/ZzQ8dIK.png)

拿到 Key（只對我這部影片有效）之後，就來設定 AutoResponder 規則吧

![Image](/image/ry0xZCB.png)

可以直接複製剛剛正常的 Response 貼進來就好

![Image](/image/Y2rWxu3.png)

再來可以修改 hosts 讓播放器的網址隨便解析到一個 ip，反正只要連得上，都可以讓他的 Response 變成我們預先設定好的 JSON，如此一來，對方的 Server 不管有沒有啟用，對我們而言都不重要了。

# 一些「特殊」的用途
寫程式常常聽到一句話：「永遠不要相信使用者輸入的內容」，藉由這篇文章，應該更有體會了吧。

台灣某付費影視網站，曾經發生過只有前端 + API（丟影片 ID 去查） 驗證使用者有沒有權限觀看影片，影片 CDN 資源卻沒有再次驗證，導致修改掉 Request 送出去的影片 ID，就能夠訪問那些使用者無權觀看的影片。

不只影視網站，其他各式各樣你想的到的網站，可能後端都沒有好好驗，所以身為開發者的我們，請時刻保持警惕，不要心存僥倖。

說完了網站，那 APP 或桌面應用程式呢?

網站的每個 Request 很好查看，而 APP 和桌面應用程式乍看之下好像看不到他到底在做什麼，但使用 Fiddler 之類的工具也是原形畢露，有心人也常用來對 APP 進行
1. 去廣告（EX: 替換掉廣告 URL）
2. 拿 VIP（EX: ``{ IsVip: false => true }``）
3. 無限延長試用
4. 任何 Server 端沒有好好驗的資源...

除了這些主要功能（資源）放在 Server 端的還能夠阻擋，但如果主要功能（資源）是放在 Client 端的呢?
1. 某些 APP 的功能本來就在 Client 端實現（EX: 攝影 APP 付費後可以使用進階功能，但這個功能本來就在 APP 裡面，只要搞清楚他是怎麼判斷購買與否的，就無法阻擋。除非弄兩個版本，免費版裡面沒有付費功能，而進階功能要透過 App Stroe 購買才能下載專門的付費版本）
2. 某速食報報...就不講得太露骨了


你可能會想說，不會啦，要搞個 APP 還要開電腦抓包修改，太麻煩了。

但現在 Android、IOS 都有類似 Fiddler 的工具（不止單純抓包，也有 AutoResponder 的功能），連電腦都不用開了。

IOS 的話我自己是在用 ``Thor``，Android 的話不熟，還請有使用過的人補充。


# 結語
本文提供了一個 Web Debugging Proxy and Troubleshooting Solutions，日後開發遇到困難時，不妨也可以思考看看類似的工具能否幫助你更快排除障礙。

至於文末提到的那些情境，絕對不是倡導破解與非法存取，而是讓開發者們時刻警惕自己負責的專案有沒有類似問題，若不幸有人閱讀本文後去做出違反法律的事情，也與筆者無關，純屬讀者個人行為。