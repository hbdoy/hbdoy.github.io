---
title: ASP.NET Core Model Binding 死活綁不上 - 1
date: 2021-05-12 23:21:08
categories:
- ASP.NET Core
tags:
- Model Binding
updated:
top_img: https://i.imgur.com/4mGvj6p.png
cover: https://i.imgur.com/4mGvj6p.png
keywords:
description:
comments:
---

# 前言
ASP.NET Core 的 Model Binding 基本上和 ASP.NET Framework 差不多，但實際接觸後，一開始用起來卻卡卡的XD

本文將紀錄一些當初以為理所當然，結果卻不是這麼一回事的狀況。

## Model Binding
先來科普一下~

最基本的有三個傳入來源
1. Form
2. Route
3. Query

![Image](https://i.imgur.com/CRzLCcT.png)

<img style="max-width: 350px; width: 100%" src="https://i.imgur.com/3vEzlK2.png">

可以三個都傳入，但是有其優先序
Form > Route > Query

![Image](https://i.imgur.com/jtdbZzi.png)

可以看到結果：

透過 Form 傳入 ``MyId1 = 1``
透過 Query 參數傳入 ``MyId1 = 3``, ``MyId2 = 4``

因為優先序的關係，MyId1 為 Form 傳入的 **1**，而 MyId2 因為 Form 沒有傳入，所以是吃到 Query 的 **4**。

## Binding Attributes
除了預設的三個來源，其餘皆需設定 Attribute 來指定接收來源。

但要注意，**一經指定，資料就只能透過指定的方式傳入**。也就是說，如果指定的 Attribute 本來就屬於預設的來源，那傳入 Attribute 指定的來源以外，也無法自動 Binding 上去。 

- ``[FromHeader]``
從 HTTP Header 取值。

- ``[FromForm]``
從 HTTP 的 Form 取值。

- ``[FromRoute]``
從 MVC Route URL 取值。

- ``[FromQuery]``
從 URL Query 參數取值。

- ``[FromBody]``
從 HTTP Body 取值，通常用於取 JSON、XML。

加入的方式可以
1. 直接在 Action 的參數前面指定
2. 複雜型別可以到 Model 中的成員加上

![Image](https://i.imgur.com/80gy0XZ.png)

<img style="max-width: 350px; width: 100%" src="https://i.imgur.com/WIS0mNw.png">

以上面的例子來說，在 MyId2 指定了 ``[FromQuery]``，那就算在優先序高的 Form 中傳入 ``MyId2 = 2``，也不會被影響到，而是吃 Query 傳入的 ``MyId2 = 4``。

![Image](https://i.imgur.com/c5MHWtF.png)

Q: 但如果 Query 沒有傳入 MyId2，而是只有 Form 傳入呢?

A: 如果在沒有指定 Attribute 的情況下，會吃到 Form 傳入的，但如果指定了 ``[FromQuery]``，就算 Form 有傳入，也吃不到。

下圖可以看到 MyId2 沒吃到，所以回傳 int 預設的 0。

![Image](https://i.imgur.com/3mcptNJ.png)

# 本文開始
實際開發時，最頭痛的資料來源就屬 Json 了。

為什麼頭痛，先來看看下面這個例子...

### 複雜型別
若有兩個 Model A、B

```csharp
public class A {
    public string NameA { get; set; }
}

public class B {
    public string NameB { get; set; }
}
```

以 ASP.NET Framework 來說，不管 Ajax ContentType 是 Form 還是 Json，都能夠這樣直接收

```csharp
public IActionResult GetSomething(A a, B b)
```

但如果是 ASP.NET Core，要接收 Json 需要指定 ``[FromBody]``，否則收不進來

![Image](https://i.imgur.com/xfqZH3L.png)

```csharp
public IActionResult GetSomething([FromBody] A a)
```

而且 ``[FromBody]`` 只能指定到一個參數上面，所以就算這樣寫，也只會把 Value 都嘗試 Bind 到 A 上

```csharp
public IActionResult GetSomething([FromBody] A a, [FromBody] B b)
```

![Image](https://i.imgur.com/Hpnzwvq.png)

### 簡單型別
簡單型別透過 JSON 也只能帶一個上來

```csharp
public IActionResult GetSomething([FromBody] string strA, [FromBody] string strB)
```

這樣寫一樣綁不上去

```javascript
$.ajax({
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({
        strA: "Bob",
        strB: "Alice"
    })
})
```

![Image](https://i.imgur.com/4mGvj6p.png)

你以為這樣就綁得上去了嗎?

```javascript
$.ajax({
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify{
        strA: "Bob"
    }
})
```

因為不符合直接傳 string，所以名字一樣也收不了

![Image](https://i.imgur.com/OcVu3gP.png)


要直接傳一個 string 才收的到

```javascript
$.ajax({
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify("Bob")
})
```

![Image](https://i.imgur.com/xmsrSJG.png)

夠難受吧，如果是多個簡單型別，別用 Json 了，直接發 Form 上來。

## 問題 1，接收多個參數
那如果前端指定 Json，要傳多個參數上來，該怎麼辦呢?

```javascript
{
    str: "HiHi",
    a: {
        NameA: "Bob"
    },
    b: {
        NameB: "Alice"
    }
}
```

### 解法一
把 Action 的 Model 整理成與 Request Data 一致。

維持使用 ``[FromBody]`` 收 JSON 的話，就要把接收的 model 調整成與 Ajax 送上來的格式一致。

```csharp
public class C {
    public string str { get; set; }
    public A a { get; set; }
    public B b { get; set; }
}

public IActionResult GetSomething([FromBody] C c)
```

### 解法二
接收 Json 只能有一個 ``[FromBody]`` 的限制，但 Form 沒有，所以在前端可以改 ContentType、而且你真的懶得再抽一個 Model 時，可以選擇不玩了，直接收 Form 就好XD

改用 ``x-www-form-urlencoded`` 可收多個參數（可以不用加 ``[FromForm]``）。

```csharp
public IActionResult GetSomething(string str, A a, B b)
```

```javascript
$.ajax({
    contentType: "application/x-www-form-urlencoded; charset=utf-8",
    dataType: "json",
    data: {
        str: "HiHi",
        NameA: "Bob",
        NameB: "Alice"
    }
})
```

> Data 的 Key 會自動去 Mapping 可能的 Model 欄位。
像是傳入 NameA，則會自動綁到 Model A 的 NameA。

## 問題 2，x-www-form-urlencoded 同名欄位 or 複雜型別
``接收多個參數``的問題，如果透過``解法二``處理，直接改接收 Form，那麼馬上隨之而來會有一個問題。

「平常印象中 Form 就是簡單的 key-value，沒有辦法帶 Object 格式」

### 同名欄位
先來看看這個，如果兩個 Model 的 Name 一樣...

```csharp
public IActionResult GetSomething(A a, B b)
```

```csharp
public class A {
    public string Name { get; set; }
}

public class B {
    public string Name { get; set; }
}
```

如果是傳 Json，可能就會很自然的直接寫

```javascript
data: {
    "a": {
        "Name": "AAA"
    },
    "b": {
        "Name": "BBB"
    }
}
```

但 Form 該怎麼帶成上面那樣有階層式的阿...

如果直接傳兩個 Name 上去，結果會將第一個抓到的 Name 綁到 A 和 B 的 Name 上。

![Image](https://i.imgur.com/VawRThK.png)

Q: Form 表單的資料格式看起來都是 key = value，該怎麼帶多個同名 key 呢?

A: 答案是可以這樣寫：

```javascript
$.ajax({
    contentType: "application/x-www-form-urlencoded; charset=utf-8",
    dataType: "json",
    data: {
        a[Name]: "AAA",
        b[Name]: "BBB"
  }
})
```

![Image](https://i.imgur.com/Wk4FQMS.png)

### 多個複雜型別
甚至資料是這樣子呢?

```javascript
{
    str: "myStr",
    a: {
        NameA: "Bob",
        AModel: {
            Address: "AAAAdress"
        }
    },
    b: {
        NameB: "Alice",
        BModel: {
            Address: "BBBAdress"
        }
    }
}
```

Q: Form 表單的資料格式看起來都是 key = value，該怎麼帶 value 是 object 的資料呢?

A: 答案是可以這樣寫：

```javascript
$.ajax({
    contentType: "application/x-www-form-urlencoded; charset=utf-8",
    dataType: "json",
    data: {
        a[NameA]: "Bob",
        a[AModel][Address]: "AAAAddress",
        b[NameB]: "Alice",
        b[BModel][Address]: "BBBAddress",
        str: "myStr"
  }
})
```

或是這樣寫（能夠自動匹配的直接傳，同名不能的就指定參數）

```javascript
$.ajax({
    contentType: "application/x-www-form-urlencoded; charset=utf-8",
    dataType: "json",
    data: {
        NameA: "Bob",
        AModel[Address]: "AAAAddress",
        NameB: "Alice",
        BModel[Address]: "BBBAddress",
        str: "myStr"
  }
})
```

### 快速使用
其實 jQuery 在發 Ajax（``x-www-form-urlencoded``） 的時候，就會自動把參數組合成上面那樣，你什麼都不用做。

```javascript
var myData = {
    str: "myStr",
    a: {
        NameA: "Bob",
        AModel: {
            Address: "AAAAdress"
        }
    },
    b: {
        NameB: "Alice",
        BModel: {
            Address: "BBBAdress"
        }
    }
}

$.ajax({
    contentType: "application/x-www-form-urlencoded; charset=utf-8",
    dataType: "json",
    data: myData
})
```

送上去的 Form Data 也會是上面範例中的型式

<img style="max-width: 350px; width: 100%" src="https://i.imgur.com/Du5DHSY.png">

後端也能正確解析

<img style="max-width: 350px; width: 100%" src="https://i.imgur.com/Fxcz1hP.png">

補充：如果在送出前就想要拿到這種格式，可以呼叫 ``param`` 函數，效果是一樣的。

```javascript
$.param(myData)
```

# 結論
使用了無數次 Ajax，卻不曾停下來看他一眼，趁這次也更清楚 Form 與 Json 的用法差別。

再來是 ASP.Net Core Model Binding 的資料來源

### ASP.NET Core 接收 Json
1. 一個 Action 只能有一個參數掛 ``[FromBody]``
2. 簡單型別盡量不要用 Json
3. 多個複雜型別，要再向外抽一個 Model，讓他的格式完全符合前端送上來的 Json 格式

### ASP.NET Core 接收 Form
1. 不會受限於只能有一個參數接收 Form 來源
2. 多個複雜型別懶得再抽一個 Model，可以考慮用一下


以上資訊如有錯誤歡迎交流補充~

下一篇會再提到 ASP.NET Core 接收 Json 還有一些討厭的狀況會讓 Model 綁不上去。


# 參考連結
[Model Binding in ASP.NET Core
](https://docs.microsoft.com/en-us/aspnet/core/mvc/models/model-binding)