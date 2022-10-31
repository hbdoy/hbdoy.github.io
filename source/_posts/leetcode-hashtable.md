---
title: LeetCode 筆記 - HashTable
date: 2022-10-31 22:13:06
categories:
- LeetCode
tags:
- valid-anagram
- find-common-characters
- intersection-of-two-arrays
updated:
top_img: https://i.imgur.com/kCZGwrU.png
cover: https://i.imgur.com/kCZGwrU.png
keywords:
description:
comments:
---

# 題目
- 242: Valid Anagram
- 1002: Find Common Characters
- 349: Intersection of Two Arrays

# 知識點
通常 HashTable 用來快速判斷一個元素是否在集合中。

# 242. Valid Anagram
https://leetcode.com/problems/valid-anagram/

```
Given two strings s and t, return true if t is an anagram of s, and false otherwise.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.
```

Example 1:
```
Input: s = "anagram", t = "nagaram"
Output: true
```

Example 2:
```
Input: s = "rat", t = "car"
Output: false
```

Constraints:
```
1 <= s.length, t.length <= 5 * 104
s and t consist of lowercase English letters.
```

## 解法
直接把 string 中的 char 當 key，然後``第一個``字串在每次寫入 array 都 ``+1``，``第二個``字串則 ``-1``，如果最後 array 的每個元素都是 ``0`` 代表兩個字串為 Valid Anagram。

> 重要: 在取 string 中的 char 時，千萬不要用 ``s.ElementAt(i)``，這樣效能太慢 leetcode 會直接 Time Limit Exceeded，要寫 ``s[i]``。

```csharp
public bool IsAnagram(string s, string t)
{
    // 題目限制，s、t 只會是小寫字母
    int[] record = new int[26];

    // 用字母順序當 key
    for (int i = 0; i < s.Length; i++)
    {
        record[s[i] - 'a'] += 1;
    }

    for (int i = 0; i < t.Length; i++)
    {
        record[t[i] - 'a'] -= 1;
    }

    for (int i = 0; i < record.Length; i++)
    {
        if (record[i] != 0)
        {
            return false;
        }
    }

    return true;
}
```

# 1002. Find Common Characters
https://leetcode.com/problems/find-common-characters/

```
Given a string array words, return an array of all characters that show up in all strings within the words (including duplicates). You may return the answer in any order.
```

Example 1:
```
Input: words = ["bella","label","roller"]
Output: ["e","l","l"]
```

Example 2:
```
Input: words = ["cool","lock","cook"]
Output: ["c","o"]
```

Constraints:
```
1 <= words.length <= 100
1 <= words[i].length <= 100
words[i] consists of lowercase English letters.
```

## 思路
題目可以理解為每個字母在所有字串中都出現的話就列出來。

延續使用 HashTable，紀錄 string 每個 char 出現的次數後，把所有紀錄整合起來，每個 char 出現的次數取最小值，如果為 0 則代表該 char 在所有 string 中都沒有出現，反之大於 0 則是在所有 string 中都有出現。

EX:
```
"abc" => [1, 1, 1, 0, 0]
"dce" => [0, 0, 1, 1, 1]
```

每個 char 出現次數取最小後: ``[0, 0, 1, 0, 0]``，所以得知 ``c`` 同時出現在兩組字串中。

## 解法
```csharp
public IList<string> CommonChars(string[] words)
{
    List<string> result = new List<string>();
    if (words.Count() == 0)
    {
        return result;
    }

    // 整合 words 所有的 string，只紀錄 char 出現的最小次數
    int[] hash = new int[26];

    for (int i = 0; i < words.Count(); i++)
    {
        // 紀錄 string 中每個 char 出現的次數
        int[] tmpStr = new int[26];
        for (int j = 0; j < words[i].Count(); j++)
        {
            tmpStr[words[i][j] - 'a'] += 1;
        }

        // 首輪沒有前組可比較
        if (i == 0)
        {
            hash = tmpStr;
            continue;
        }

        // 每次更新 hash，讓其只紀錄 char 出現的最小次數
        for (int k = 0; k < 26; k++)
        {
            hash[k] = Math.Min(hash[k], tmpStr[k]);
        }
    }

    // 把數字轉回 char
    for (int i = 0; i < 26; i++)
    {
        // 1. 不等於 0 代表該 char 在 words 中的所有 string 都有出現
        // 2. 用 while 因為如果 char 重複出現，需要全部列出
        while (hash[i] != 0)
        {
            char c = (char)(i + 'a');
            result.Add(c.ToString());
            hash[i]--;
        }
    }

    return result;
}
```

# 349. Intersection of Two Arrays
https://leetcode.com/problems/intersection-of-two-arrays/

```
Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique and you may return the result in any order.
```

Example 1:
```
Input: nums1 = [1,2,2,1], nums2 = [2,2]
Output: [2]
```

Example 2:
```
Input: nums1 = [4,9,5], nums2 = [9,4,9,8,4]
Output: [9,4]
Explanation: [4,9] is also accepted.
```

Constraints:
```
1 <= nums1.length, nums2.length <= 1000
0 <= nums1[i], nums2[i] <= 1000
```

## 思路
前面兩題都是英文字母，會使用的空間就是 26 個而已，所以使用 Array[26] 來當 HashTable。

但這題變成數字，
1. 雖然有限定範圍在 1000 內，但資料有可能過於分散或太少而浪費空間
2. 題目限定 result 必須 unique

故此處改用 ``HashSet``。

其實也可以使用兩層 for 暴力法，但時間複雜度為 ``O(n^2)``。

而用 ``HashSet`` 查詢的時間複雜度為 ``O(1)``，所以整體時間複雜度就變為 ``O(n)``。

## 解法
```csharp
public int[] Intersection(int[] nums1, int[] nums2)
{
    if (!nums1.Any() || !nums2.Any())
    {
        return new int[0];
    }

    HashSet<int> set1 = new HashSet<int>();
    HashSet<int> uniqueResult = new HashSet<int>();

    for (int i = 0; i < nums1.Count(); i++)
    {
        set1.Add(nums1[i]);
    }

    for (int i = 0; i < nums2.Count(); i++)
    {
        // 此處查詢的複雜度為 O(1)
        if (set1.Contains(nums2[i]))
        {
            uniqueResult.Add(nums2[i]);
        }
    }

    return uniqueResult.ToArray();
}
```