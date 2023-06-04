---
title: ASP.NET 專案設定多個目標框架 
date: 2022-07-22 14:02:30
categories:
- ASP.NET Core
tags:
- targetframeworks
updated:
keywords:
description:
comments:
top_img: /image/J1exQWd.png
cover: /image/J1exQWd.png
---

# 前言
遇到一個需求是要建立兩個不同版本的 Web API 進行測試，他們會參考到某個類別庫 A。

但為了嚴謹性，希望 NET 6 參考到的類別庫也是使用 NET 6，而不是較低的版本如 NET 3.1 或 NET Standard；反之 NET 3.1 的 Web API 也是希望使用框架目標為 NET 3.1 的類別庫 A。

# 本文開始
簡單紀錄一下調整的過程。

## 調整 csproj
打開類別庫 A 的 csproj

> Tips: 在 VS 中可以直接在方案總管中對專案點兩下打開 csproj 設定檔。

將 TargetFramework 加上「s」，然後就可以在「;」後面加上想要支援的版本。

> 引用該類別庫的專案，會自動選擇能夠兼容的最高版本。
> 
> 例如: NET 6 API 專案引用類別庫時，雖然可以用 NET 3.1 也可以用 NET 6，但會自動選擇 NET 6。

```=
<PropertyGroup>
    <TargetFrameworks>netcoreapp3.1;net6.0</TargetFrameworks>
</PropertyGroup>
```

具體可用的版本號可參考 [supported-target-frameworks](https://docs.microsoft.com/en-us/dotnet/standard/frameworks#supported-target-frameworks)

調整後 build 出的兩個版本

![Image](/image/XutLuQk.png)

### Condition
如果不同的 .NET 版本想引用不同的套件，或者是某些套件只能在特定的 .NET 版本上運行時，也可以在 csporj 裡面設定 PackageReference。

例如:

```=
<ItemGroup Condition="'$(TargetFramework)' == 'net6.0'">
    <PackageReference Include="Data.Common.Context" Version="6.0.0" />
    <PackageReference Include="Data.Common.Values" Version="6.0.0" />
    <PackageReference Include="Data.AccessLog.EFCore" Version="6.0.0" />
</ItemGroup>

<ItemGroup Condition="'$(TargetFramework)' == 'netcoreapp3.1'">
    <PackageReference Include="Data.Common.Context" Version="1.5.0" />
    <PackageReference Include="Data.Common.Values" Version="1.6.0" />
    <PackageReference Include="Data.AccessLog.EFCore" Version="1.7.0" />
</ItemGroup>
```

## Conditional compilation
如果某些 Code 只想在某個版本上的 NET 上跑，可以使用預處理器指示詞來控制[條件式編譯](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/preprocessor-directives#conditional-compilation)。

例如:

```=
public string Platform {
   get {
#if NET6_0
      return ".NET 6"
#elif NETCOREAPP3_1
      return ".NET 3"
#else
#error This code block does not match csproj TargetFrameworks list
#endif
   }
}
```

更多前置處理器符號可參考 [Preprocessor Symbols](https://docs.microsoft.com/en-us/dotnet/core/tutorials/libraries#preprocessor-symbols)。