---
title: Net Core 多站台共用驗證 Cookie
date: 2021-03-10 20:40:57
categories:
- ASP.NET Core
tags:
- Data Protection
- Cookie
- SSO
updated:
keywords:
description:
comments:
top_img: https://i.imgur.com/77MuXJH.jpg
cover: https://i.imgur.com/77MuXJH.jpg
---
# 前言
當你需要一個安全的機制來保護你的資料時，不妨可以使用 Net Core 的資料保護（Data Protection）。

他有以下特點：
1. 容易使用、擴展性高
2. 基於非對稱的加密機制
3. 正常情況下，不需要去設定與管理任何密鑰的儲存位置與生命週期

簡單來說你想加解密資料時，可以直接使用 Data Protection 的 API：
- Protect
- Unprotect

傻瓜式(?)的使用方式，也避免開發者：
1. 搞不清楚「對稱、非對稱加密、Hash、編碼」的差異下，選擇了錯誤的方式來保護敏感資料。
2. 自己造輪子實作加解密...

> 了解更多 [ASP.NET Core 資料保護](https://docs.microsoft.com/en-us/aspnet/core/security/data-protection/introduction)、[ASP.NET Core 中的資料保護 Api 入門](https://docs.microsoft.com/en-us/aspnet/core/security/data-protection/using-data-protection)

# 本文開始
在 Net Framework 時代，透過 MachineKey 來處理 Forms Authentication 的 Cookie 加解密（當然正常情況下也不會去動到 MachineKey，都交由系統處理）。

而 Net Core 雖沒有 Forms Authentication，但卻有差不多的 Cookie-based Authentication，他的 Cookie 加解密則是由上方提到的 Data Protection 機制來處理。

## 問題: 多個站台之間無法解密彼此的驗證 Cookie?

「希望在網站過版時不用停機」

前陣子碰到這個需求，所以同事多建了一個站台，設定好主站台關閉後網址如何對應到備援的站台（同個網址），然後 Cookie 的 Domain 和有效期限也都有設定好，看起來需求就解決了，但實際測試時，卻有以下問題：

1. User 在主站台已經登入的情況下使用系統
2. 把新程式過版到備援站台
3. 關閉主站台，讓後續流量都交由備援站台處理
4. User 繼續使用系統，卻是沒有登入的狀態，被導到登入畫面

當下直覺是備援站台無法讀取主站台的 Cookie，後來確認了一下，一半對一半錯XD

Cookie 是可以讀取的，畢竟是同一個網址，退一步來說就算是相同 Domain 下也會讀取的到，無法讀取的是 Cookie Authentication 的驗證 Cookie。

顯然地，備援站台因為 Key 不對，無法解開主站台留下的 Cookie，所以問題收斂成需要搞懂：
1. Data Protection 的金鑰保存在哪?
2. 金鑰多久會過期?
3. 我要怎麼讓不同站台共用金鑰?

# Data Protection 金鑰管理與生命週期
該來的還是得來，啃了官方~~又香又長~~的文件。

## 金鑰儲存位置
會依照應用程式的操作環境而有所不同：
1. （這裡不討論）在 Azure 上會存在 ``%HOME%\ASP.NET\DataProtection-Keys`` 資料夾中
2. 其餘則是除非有特別設定，否則存放在記憶體

所以有個滿嚴重的問題，如果 Net Core 專案部屬在 IIS 上，應用程式集區預設的：
1. 29 小時定期回收
2. 閒置 20 分自動終止（Terminate）

或是集區手動回收，都會導致驗證的 Cookie 無法讀取。

除了驗證 Cookie 以外，只要是該機制加密的東西也會無法讀取，像是 CSRF Token。

> 補充一下實驗結果，如果集區回收可以接受金鑰遺失，而閒置不想要因為後續行為遺失的話，動作由 Terminate 改為 Suspend（凍結）、或是閒置時間直接改為 0 分鐘（不終止也不凍結），則不會導致記憶體中的金鑰遺失。

所以如果在 IIS 下想要保存金鑰，有[多種](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/iis/advanced#data-protection)設定方式，以下列兩種較方便的設定方式：
1. 建立 Data Protection Registry keys，將金鑰放在 HKLM 機碼中，並限定該集區的帳戶才能存取。
2. (推薦)
設定 IIS 應用程式集區載入使用者設定檔，金鑰會存在 ``%LOCALAPPDATA%\ASP.NET\DataProtection-Keys`` 資料夾中。

### IIS 應用程式集區載入使用者設定檔
設定為 True 後，會將金鑰保存到上述的資料夾路徑中，也就是圖中的 xml 檔案。

![Image](https://i.imgur.com/GcX1MKD.png)

![Image](https://i.imgur.com/C7qDfxV.png)

裡面的內容有：
1. 建立、啟用、逾期時間（除非特別設定，否則金鑰預設的存活時間是三個月）
2. 金鑰（在 Windows 平台下會透過 DPAPI 加密）

![Image](https://i.imgur.com/DrhGPLX.png)

**提醒一下，此金鑰和 MachineKey 一樣重要，千萬不能外洩!**

# 接下來
了解 Data Protection 的金鑰管理機制後，回頭看我們的問題，還差了那麼一點，因為上面講的是單個集區保存金鑰，但多個集區（正式、備援）依舊是讀取各自保存的金鑰，只是集區回收後金鑰不會遺失而已。

所以如果要讓多個集區、或是分散式部屬的應用程式能透過 Cookie 達到 SSO 的效果，勢必得把金鑰存到這些應用都能共用的地方。

# 自訂金鑰儲存位置
我們可以指定金鑰存到以下位置：
1. Azure Key Vault
2. File System
3. DB

請依照專案環境選擇[合適的方式](https://docs.microsoft.com/en-us/aspnet/core/security/data-protection/configuration/overview)，像是兩個站台都建在同一台 Server 上，可以考慮存到 File System；反之可以存到 DB 比較方便。

## File System
存到系統上非常簡單，如下配置後，就能夠將上述提到的 xml 存到指定路徑。
```C#
public void ConfigureServices(IServiceCollection services)
{
    services.AddDataProtection()
        .PersistKeysToFileSystem(new DirectoryInfo(Configuration["YourFilePath"]))
        .SetApplicationName("YourApplicationName");
        // 請把所有想要共用同個金鑰的應用程式都指定相同的 Application Name，
        // 不然就算吃到相同的金鑰，也會因為 Net Core 應用程式隔離的特性無法成功加解密
}
```

> 了解更多 [SetApplicationName 應用程式隔離](https://docs.microsoft.com/en-us/aspnet/core/security/data-protection/configuration/overview#per-application-isolation)

## Database
Key Storage Providers 也有[常見的解決方案](https://docs.microsoft.com/en-us/aspnet/core/security/data-protection/implementation/key-storage-providers)可以選擇
1. Entity Framework Core
2. Redis

這邊選擇透過 EF Core 存到 DB 

寫法如下：
1. NuGet 下載 ``Microsoft.AspNetCore.DataProtection.EntityFrameworkCore``

2. 新增一個 DbContext
```C#
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class MyKeysContext : DbContext, IDataProtectionKeyContext
{
    // A recommended constructor overload when using EF Core 
    // with dependency injection.
    public MyKeysContext(DbContextOptions<MyKeysContext> options) 
        : base(options) { }

    // This maps to the table that stores keys.
    public DbSet<DataProtectionKey> DataProtectionKeys { get; set; }
}
```

3. 配置連線資訊與指定 PersistKeysToDbContext
```C#
public void ConfigureServices(IServiceCollection services)
{
    services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(
            Configuration.GetConnectionString("DefaultConnection")));

    // Add a DbContext to store your Database Keys
    services.AddDbContext<MyKeysContext>(options =>
        options.UseSqlServer(
            Configuration.GetConnectionString("MyKeysConnection")));

    // using Microsoft.AspNetCore.DataProtection;
    services.AddDataProtection()
        .PersistKeysToDbContext<MyKeysContext>()
        .SetApplicationName("YourApplicationName");
        // 請把所有想要共用同個金鑰的應用程式都指定相同的 Application Name，不然就算吃到相同的金鑰，也會因為 Net Core 應用程式隔離的特性無法成功加解密
}
```

4. migration 然後 update database 產生 DataProtectionKeys 的 Table
```
dotnet ef migrations add AddDataProtectionKeys --context MyKeysContext
dotnet ef database update --context MyKeysContext
```

存到 DB 其實只是把 xml 內容存進去而已，沒有做特別改動

![Image](https://i.imgur.com/twJWzAv.png)

## DB First 解決方法
基本上就是這樣，如果有問題的話大概就是第四步，因為我們專案 EF Core 是採 DB First 形式，還是可以解決，只是會有兩種方法：
1. 可以的話直接 migration 然後 update database，長出 DataProtectionKeys 的 Table 之後，把所有 migration 相關的資料夾、檔案、Table 都刪除。
2. 如果不能用程式動 Table 的話，可以把 DataProtectionKeys 的 Table 寫成 SQL Script 來給相關人員 Create。

![Image](https://i.imgur.com/48rFEDp.png)

這邊附上 SQL Server + SSMS 直接產生的 Script，使用前請先確認你使用的 DB 語法有沒有正確。
```SQL
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DataProtectionKeys]') AND type in (N'U'))
DROP TABLE [dbo].[DataProtectionKeys]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[DataProtectionKeys](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FriendlyName] [nvarchar](max) NULL,
	[Xml] [nvarchar](max) NULL,
 CONSTRAINT [PK_DataProtectionKeys] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
```

## !!金鑰加密!!
只要指定金鑰的儲存位置，不管是存到 File System 還是 DB，Net Core 都不會把金鑰加密，因為他不知道 DPAPI 是否為適當的加密機制，所以如果有改變儲存位置，記得選擇適當的加密方式。

1. DPAPI（Windows Only）
2. X.509 憑證
3. 自訂

若以保存到 File System 為例，XML 打開會看到警示: ``Warning: the key below is in an unencrypted form.``。

![Image](https://i.imgur.com/eMJxVp0.png)

> 了解更多 [NET Core 的待用金鑰加密](https://docs.microsoft.com/en-us/aspnet/core/security/data-protection/implementation/key-encryption-at-rest)

# 結語
我最後選擇透過 EF Core 將金鑰存到 DB，設定共用的金鑰後，也成功讓正式與備援站台讀取彼此的驗證 Cookie 達到不停機過版的效果，當然未來如果 I/O 遇到效能瓶頸，可能會考慮存到 Redis。

礙於篇幅與實用性，沒有講到全部的細節，故在文中都有穿插連結，不管是有興趣的人還是想要自己處理金鑰的人，都建議閱讀。

文中內容若有錯誤的地方，請不吝告知。

# 參考連結
[設定 ASP.NET Core 資料保護](https://docs.microsoft.com/en-us/aspnet/core/security/data-protection/configuration/overview)

[Windows 和 Azure 中使用 ASP.NET Core 的待用金鑰加密](https://docs.microsoft.com/en-us/aspnet/core/security/data-protection/implementation/key-encryption-at-rest)

[ASP.NET Core 中的金鑰儲存提供者](https://docs.microsoft.com/en-us/aspnet/core/security/data-protection/implementation/key-storage-providers)

[ASP.NET Core 中的資料保護金鑰管理和存留期](https://docs.microsoft.com/en-us/aspnet/core/security/data-protection/configuration/default-settings)

[ASP.NET Core 模組和 IIS 的 Advanced configuration](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/iis/advanced?view=aspnetcore-5.0#data-protection)

[cookie在 ASP.NET apps 之間共用驗證](https://docs.microsoft.com/en-us/aspnet/core/security/cookie-sharing)

[How to distribute Data Protection keys with an ASP.NET Core web app](https://medium.com/swlh/how-to-distribute-data-protection-keys-with-an-asp-net-core-web-app-8b2b5d52851b)

[ASP.NET MachineKey自動產生原理剖析](https://blog.darkthread.net/blog/inside-aspnet-autogenkeys/)

[ASP.NET Core 数据保护（Data Protection）【上】](https://www.cnblogs.com/savorboard/p/5778616.html)

[ASP.NET Core Authentication系列（四）基于Cookie实现多应用间单点登录（SSO）](https://www.cnblogs.com/liang24/p/13925057.html)