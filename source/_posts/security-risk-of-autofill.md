---
title: 愛用瀏覽器自動填入? 小心個資外洩!
date: 2021-06-20 14:18:15
categories:
- Security
tags:
- browser
- autofill
updated:
top_img: https://i.imgur.com/uQ3yfCx.png
cover: https://i.imgur.com/uQ3yfCx.png
keywords:
description:
comments:
---
# 前言
瀏覽器能夠儲存使用者經常填入的各種資訊，舉凡帳號、密碼、Email、姓名、電話、地址、信用卡資訊...等等。

帳號密碼可能不一定會儲存，但 Email、姓名、電話之類的個資，應該很多人會選擇讓瀏覽器記憶，避免每次填寫樸實又枯燥乏味的表單要一直重複輸入。

但是在理解瀏覽器 autocomplete 觸發機制後，你還敢直接填入你的資訊嗎?

以一個只有 Email 的表單為例，你以為只有填入 Email，實際上所有紀錄的個資，都可以被心懷不軌的網站拿到。

不囉嗦，直接弄個 Demo 網站看效果: https://ryanlee.tw/security-risk-of-autofill-demo

# 本文開始
瀏覽器儲存的資訊看起來很多，但其實就是三個種類，以 Chrome 為例

![Image](https://i.imgur.com/qYskUcE.png)

1. **密碼**: 會綁定網站 Domain，只能夠自動填入相同網址下紀錄的帳密，所以不會發生 A 網站登入，卻填入 B 網站的帳密。

![Image](https://i.imgur.com/TrngHLI.png)

2. **付款方式**: 儲存信用卡資訊(卡號、到期日、持卡人姓名)，要在 https 的網站下才會觸發自動填入。

![Image](https://i.imgur.com/ft7dDbQ.png)

3. (本文主要討論)**地址和其他資訊**: 國家、郵遞區號、地址、姓名、電話、Email。

![Image](https://i.imgur.com/i10XPqF.png)

## autocomplete
那站在開發者的角度，該如何讓瀏覽器知道 input 可以填入什麼資訊呢?

其實很簡單，就設定 input 的 ``name`` 或 ``autocomplete`` attribute 就好

![Image](https://i.imgur.com/fQ8YXDo.png)

常見的 attribute 如下([來源](https://developers.google.com/web/fundamentals/design-and-ux/input/forms)):


| Content type | name attribute                                             | autocomplete attribute                                                                                                                                                                      |
|--------------|------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Name         | name fname mname lname                                     | name (full name)、 given-name (first name)、 additional-name (middle name)、 family-name (last name)                                                                                        |
| Email        | email                                                      | email                                                                                                                                                                                       |
| Address      | address city region province state zip zip2 postal country | For one address input: street-address、 For two address inputs: address-line1 address-line2、 address-level1 (state or province)、 address-level2 (city)、 postal-code (zip code)、 country |
| Phone        | phone mobile country-code area-code exchange suffix ext    | tel                                                                                                                                                                                         |
| Credit Card  | ccname cardnumber cvc ccmonth ccyear exp-date card-type    | cc-name cc-number cc-csc cc-exp-month cc-exp-year cc-exp cc-type                                                                                                                            |
| Usernames    | username                                                   | username                                                                                                                                                                                    |
| Passwords    | password                                                   | current-password (for sign-in forms)、 new-password (for sign-up and password-change forms)                                                                                                 |

具體可看 WHATWG 制定的[規範](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill)

## 隱藏 input
文章一開始的 Demo 網站，其實也只是設定好這些屬性，然後把他們「隱藏」起來。

至於該怎麼隱藏呢?

如果你試著把 input 設為 ``display: none``、``visibility: hidden``、``input type="hidden"`` 這幾種，會發現瀏覽器不會自動填入他們。

但如果不要這種隱藏，而是調整成只有使用者看不到的那種隱藏，就可以了XD

把框線隱藏、長寬設為 0(還是會有一小點)、設定 margin 讓他直接超出螢幕。

![Image](https://i.imgur.com/TuwlhcI.png)

## 危害範圍
Chrome、Edge、Safari 當你自動填入個資時，會順便填入所有能夠對應的個人資訊。

好消息是帳號密碼、付款方式各自獨立，所以不會填入。

至於 Firefox 也能夠自動填入，但它需要使用者逐個控制項選擇填入，所以不會發生上述問題。

以 Chrome 為例，根本不知道實際填入了哪些資訊

![Image](https://i.imgur.com/GNmKUGi.png)

儘管有些瀏覽器可能會顯示實際填入的資訊，但使用者會認真停下來幾秒鐘檢查的又有多少呢?

又或者，如果有紀錄多個 Email 的情況下，跳出了詳細資訊，大多也會以為瀏覽器顯示詳細訊息，是為了讓你分辨兩筆資料的差別吧...

### 市佔率
以 [Net Applications 調查結果]((https://netmarketshare.com/browser-market-share.aspx))來看

在 Desktop 下，Chrome 的使用率接近 7 成

![Image](https://i.imgur.com/jP6eZ3O.png)

在 Mobile 下，Chrome 的使用率也穩居 6 成

![Image](https://i.imgur.com/RSFTsSA.png)

顯然這個問題影響著很大一部份的使用者。

## 防範措施
那到底該如何避免不想要的資訊被網站拿走呢?

1. 只在信任的網站自動填入
2. 乾脆不用自動填入，或是只記錄你覺得洩漏也無所謂的資訊
3. 使用能夠幫助你檢查表單填入資訊的瀏覽器
4. 送出表單前，檢查網頁原始碼

不過最重要的準則還是只有一個，就是「不管帳號密碼、付款方式、個資，都只儲存你覺得洩漏也無所謂的資訊，不要覺得存在瀏覽器裡面很安全，要抱持著它總有一天會洩漏的心態來使用它」。

