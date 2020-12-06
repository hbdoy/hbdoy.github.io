---
title: Hexo 建站心得
date: 2020-11-30 23:02:30
categories:
- Blog
- Hexo
tags:
- Hexo
- Butterfly
- Facebook Comment
updated:
keywords:
description:
comments:
---

# 前言
原本以為用 Hexo、挑個 Theme，之後把 Blog 建起來應該不會遇到什麼問題，也不用特別記錄下來，但...事與願違XD

# 本文開始
我用的主題是 [butterfly](https://github.com/jerryc127/hexo-theme-butterfly)，理論上只要把裡面文檔都看過就能解決 90% 的問題，也不太需要看[官方文檔](https://hexo.io/zh-tw/docs/)，弄好之後放在 Github Page，然後前面掛個 Cloudflare。


Hexo 大致設定
- Disqus / Facebook Comments
- PWA
- Custom Pagination、Footer
- Edit Scaffolds


Cloudflare 大致設定
- SSL、Always Use HTTPS、Automatic HTTPS Rewrites
- Auto Minify、Cache、Always Online

SEO 大致處理
- Sitemap、Robots.txt
- Nofollow
- Submit to Google Search Console


科普知識就不提了，網路上已經很多詳細的文章
- What 's Hexo and Why
- What's Markdown
- How to deploy to Github Page
- How to use your custom domain and How to buy
- What's SSL
- etc...


以下會列出當時有遇到的一些問題。

## Pagination 預設 Style 以圖片為背景

![](https://imgur.com/ZciUF7y.png)
[圖片來源](https://jerryc.me/posts/21cfbf15/)

主題預設每個 Post 都會有一個封面圖片，如果不想要可以去設定檔拿掉，但拿掉圖片，上/下一頁連結就變成高度很高，但背景是白的連結了。

只想要單純的文字，像這樣的話

![](https://imgur.com/PfZNzxO.png)

要直接改 ``themes\butterfly\layout\includes\pagination.pug``

以下節錄我調整後的程式碼，以可以調整成自己喜歡的
```=
if(page.prev)
    - var hasPageNext = page.next ? 'pull-left' : 'pull-full'
    .prev-post(class=hasPageNext)
        a(href=url_for(page.prev.path))
            .pagination-info
                .i.fa.fa-chevron-circle-left
                .prev_info=page.prev.title
          
if(page.next)
    - var hasPagePrev = page.prev ? 'pull-right' : 'pull-full'
    .next-post(class=hasPagePrev)
        a(href=url_for(page.next.path))
            .pagination-info
                .i.fa.fa-chevron-circle-right
                .next_info=page.next.title 
```


## Facebook Comments
### 超級無敵大雷1

我網站主題是深色(Dark)，但 FaceBook Comments Dark Theme 目前壞掉，只能透過 CSS 把評論區塊背景設為白色，不然會完全看不到字 (Disqus 沒這個問題)。

![](https://imgur.com/zGv7BAv.png)

看起來和 Hexo 無關，是 Facebook 的問題、也有人 2020/08/12 回報了，雖然進度上寫處理完畢，但我 2020/11/30 測試起來問題仍在。

https://developers.facebook.com/support/bugs/1759174414250782/

![](https://i.imgur.com/6QZkv1C.png)

不想放棄 Facebook Comments + 深色主題的話，我的解法是把 Facebook 的 Comment 區塊直接背景變白色XD

``themes\butterfly\source\css\_layout\comments.styl``

```
.comment-wrap
    > div:nth-child(2)
        background-color: white !important;
        border-radius: 5px !important;
```

![](https://i.imgur.com/STYzbcG.png)

而 Disqus 則維持原本正常的深色主題

![](https://i.imgur.com/tfiVAJ1.png)


### 超級無敵大雷2
原本以為這樣就高枕無憂，但 2020/11/30 的 IOS 不管是 Chrome 還是 Safari 都無法透過 Facebook Comments 留言，但桌面版、Android 的可以正常留言...

狀況有2

1. 明明已經有登入 Facebook，但留言區抓不到，一樣要登入，可是點了登入之後就瘋狂無限白畫面跳轉。
2. 留言框自己不斷重整，無法選取打字。

以上問題測試了 3 台 iPhone 都是這樣QQ，一開始以為是我哪裡沒處理好，但到幾個新聞網站 (水果、聯X) 的留言區測試，發現一樣有這些問題...，這個狀況目前無解。
