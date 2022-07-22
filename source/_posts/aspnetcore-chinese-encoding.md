---
title: Net Core Razor View 中文被自動編碼!?
date: 2021-04-05 20:43:56
categories:
- ASP.NET Core
tags:
- cshtml
- encoding
updated:
top_img: https://i.imgur.com/OXRInZY.jpg
cover: https://i.imgur.com/OXRInZY.jpg
keywords:
description:
comments:
---
# 前言
## View Engine
使用 ASP NET Core MVC 開發時，遇到 HTML 裡的中文被進行編碼，無法正常顯示。

在找問題成因的時候，出於好奇研究了一下 ASP NET 歷史版本的更新與 View HtmlEncode 的淵源，讓我們把時間倒回 2010 年吧XD

在 ASP.NET 3.5（MVC 2） 以前，WebForm View Engine 若想要編碼 HTML 中的內容以避免 XSS 問題，需要自己呼叫編碼的方法，但是每個內容都要呼叫實在很麻煩，而且開發者也常常會忘記。

![Image](https://i.imgur.com/RgIcvAq.png)

所幸 2011 年，ASP.NET 4（MVC 3）發佈以後，新增 ``<%: %>`` 語法來自動對內容進行 HTML 編碼，減輕了開發者的負擔與降低系統安全風險。

![Image](https://i.imgur.com/EwN1ni6.png)

ASP.NET 4（MVC 3）版本中，也 Release 了 Razor View Engine，因為容易學習、寫法更為簡潔方便的特性，使得它逐漸成為開發 ASP.NET MVC 網站的主流（兩者具體比較可以[參考](https://www.c-sharpcorner.com/UploadFile/ff2f08/aspx-view-engine-vs-razor-view-engine/)）。

# 本文開始
## Net Framework
使用 Razor 在渲染畫面時，會自動進行編碼，防止 XSS。

> 開發者記得不要在 View 裡面又呼叫 HtmlEncode 進行二次編碼。

簡單來說 cshtml 裡面用到任何後端帶過來的變數，為避免造成 XSS 安全問題，Net Fx 和 Net Core 都會自動對特定符號轉碼。

EX: ``< > ' "``

![Image](https://i.imgur.com/OXm9IqG.png)

以下可以看到測試的結果，特定的字元都被進行轉碼。

![Image](https://i.imgur.com/MmhP191.png)

## Net Core
以上都沒什麼問題，但相同的測試到了 Net Core，好像有些事情不太對勁喔

![Image](https://i.imgur.com/M4miOHk.png)

輸出的結果

![Image](https://i.imgur.com/KULvD7j.png)

可以發現到，除了特定的字元以外，連中文都被編碼了，僅剩  abc123 正常顯示。

## 解決方法
翻了一下[官方文件](https://docs.microsoft.com/en-us/aspnet/core/security/cross-site-scripting#customizing-the-encoders)真相大白

![Image](https://i.imgur.com/qQH76xd.png)

原來 ASP.NET Core 的 Razor TagHelper 及 HtmlHelper 預設會將所有非拉丁字元都當成特殊符號進行編碼，理由是為了防範未知或未來瀏覽器針對這些字元渲染時發生的錯誤...

解決方式也很簡單，放寬預設安全字元的限制就好。

在 ``Startup`` 中的 ``ConfigureServices`` 自訂 HtmlEncoder 安全清單，加上 ``CJK Unified Ideographs``。

```C#
services.AddSingleton<HtmlEncoder>(
     HtmlEncoder.Create(allowedRanges: new[] { UnicodeRanges.BasicLatin,
                                               UnicodeRanges.CjkUnifiedIdeographs }));
```

> 中日韓統一表意文字（英語：CJK Unified Ideographs），也稱統一漢字、統漢碼（英語：Unihan），目的是要把分別來自中文、日文、韓文、越南文、壯文、琉球文中，起源相同、本義相同、形狀一樣或稍異的表意文字，在ISO 10646及萬國碼標準賦予相同編碼。 [from wiki](https://zh.wikipedia.org/wiki/%E4%B8%AD%E6%97%A5%E9%9F%93%E7%B5%B1%E4%B8%80%E8%A1%A8%E6%84%8F%E6%96%87%E5%AD%97)

# 參考連結
[Prevent Cross-Site Scripting (XSS) in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/security/cross-site-scripting#customizing-the-encoders)

[HTML Encoding in MVC](https://www.c-sharpcorner.com/UploadFile/abhikumarvatsa/html-encoding-in-mvc/)

[ASPX View Engine VS Razor View Engine](https://www.c-sharpcorner.com/UploadFile/ff2f08/aspx-view-engine-vs-razor-view-engine/)

[HTML Encoding Output in ASP.NET 4](https://weblogs.asp.net/scottgu/new-lt-gt-syntax-for-html-encoding-output-in-asp-net-4-and-asp-net-mvc-2)

[ASP.NET MVC 演進歷史](https://nwpie.blogspot.com/2017/04/3-aspnet-mvc.html)

[ASP.NET MVC Version History](https://www.tutorialsteacher.com/mvc/asp.net-mvc-version-history)
