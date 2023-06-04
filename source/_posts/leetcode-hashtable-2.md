---
title: LeetCode 筆記 - HashTable(2)
date: 2022-11-01 23:00:38
categories:
- LeetCode
tags:
- 4sum-ii
- ransom-note
- 3sum
- 4sum
updated:
top_img: /image/kCZGwrU.png
cover: /image/kCZGwrU.png
keywords:
description:
comments:
---

# 題目
- 454: 4Sum II
- 383: Ransom Note
- 15: 3Sum
- 18: 4Sum

# 454. 4Sum II
https://leetcode.com/problems/4sum-ii/

```
Given four integer arrays nums1, nums2, nums3, and nums4 all of length n, return the number of tuples (i, j, k, l) such that:
    - 0 <= i, j, k, l < n
    - nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0
```

Example 1:
```
Input: nums1 = [1,2], nums2 = [-2,-1], nums3 = [-1,2], nums4 = [0,2]
Output: 2

Explanation:
The two tuples are:
1. (0, 0, 0, 1) -> nums1[0] + nums2[0] + nums3[0] + nums4[1] = 1 + (-2) + (-1) + 2 = 0
2. (1, 1, 0, 0) -> nums1[1] + nums2[1] + nums3[0] + nums4[0] = 2 + (-1) + (-1) + 0 = 0
```

Example 2:
```
Input: nums1 = [0], nums2 = [0], nums3 = [0], nums4 = [0]
Output: 1
```

Constraints:
```
n == nums1.length
n == nums2.length
n == nums3.length
n == nums4.length
1 <= n <= 200
-228 <= nums1[i], nums2[i], nums3[i], nums4[i] <= 228
```

## 思路
可以用暴力法疊 4 層迴圈，但時間複雜度為 ``O(n^4)``。

這題和 ``1. Two Sum`` 一樣，題解題思路變化為: ``每次迭代時，都嘗試去找 Map 中是否存在與其相加為 target 的值``。

只是這邊有 4 個 Array，所以拆成兩兩一組
1. 先用兩層迴圈處理前兩組 Array，並將各元素之合存入 Map，並記錄出現次數。
2. 接著再用兩層迴圈處理後兩組 Array，並將相加之合拿進 Map 查詢是否存在與其相加為 0 的值，若有則紀錄該值的出現次數。

## 解法
時間複雜度: ``O(n^2)``

```csharp
public int FourSumCount(int[] nums1, int[] nums2, int[] nums3, int[] nums4)
{
    Hashtable map = new Hashtable();
    int tmp;
    int res = 0;

    // 前兩組 Array 各元素之和 (num1 + nums2)，存入 map (key: 兩數之合、value: 重複出現的次數)
    for (int i = 0; i < nums1.Count(); i++)
    {
        for (int j = 0; j < nums2.Count(); j++)
        {
            tmp = nums1[i] + nums2[j];
            if (map.ContainsKey(tmp))
            {
                map[tmp] = (int)map[tmp] + 1;
            }
            else
            {
                map.Add(tmp, 1);
            }
        }
    }

    // 後兩組 Array 各元素之合 (num3 + num4)，並在 map 中查詢是否有與其相加為 0 的 key
    for (int i = 0; i < nums3.Count(); i++)
    {
        for (int j = 0; j < nums4.Count(); j++)
        {
            tmp = nums3[i] + nums4[j];
            // 找到相加為 0，紀錄次數
            if (map.ContainsKey(0 - tmp))
            {
                res += (int)map[0 - tmp];
            }
        }
    }

    return res;
}
```


# 383. Ransom Note
https://leetcode.com/problems/ransom-note/

```
Given two strings ransomNote and magazine, return true if ransomNote can be constructed by using the letters from magazine and false otherwise.

Each letter in magazine can only be used once in ransomNote.
```

Example 1:
```
Input: ransomNote = "a", magazine = "b"
Output: false
```

Example 2:
```
Input: ransomNote = "aa", magazine = "ab"
Output: false
```

Example 3:
```
Input: ransomNote = "aa", magazine = "aab"
Output: true
```

Constraints:
```
1 <= ransomNote.length, magazine.length <= 105
ransomNote and magazine consist of lowercase English letters.
```

## 思路
判斷``字串 ransomNote`` 是否都在``字串 magazine`` 中存在，且 ``magazine`` 每個 char 不能重複給 ``ransomNote`` 使用。

可以暴力法用兩層 for 解決，也可以使用 ``242: Valid Anagram`` 的解法。

## 解法
### 暴力法
時間複雜度: ``O(n^2)``

shadow code:
```csharp
foreach magazine
    foreach ransomNote
        if magazine[i] == ransomNote[j]
            removeCharInString(ransomNote, j)
            break;
        
if ransomNote.length == 0
    return true

return false
```

### HashTable
時間複雜度: ``O(n)``

```csharp
public bool CanConstruct(string ransomNote, string magazine)
{
    int[] record = new int[26];

    for (int i = 0; i < magazine.Length; i++)
    {
        record[magazine[i] - 'a'] += 1;
    }

    for (int i = 0; i < ransomNote.Length; i++)
    {
        record[ransomNote[i] - 'a'] -= 1;
    }

    // 如果有負數，代表 ransomNote 有 magazine 沒有的 char 
    // 或者是有一樣的 char，但其重複的數量大於 magazine 擁有的
    for (int i = 0; i < 26; i++)
    {
        if (record[i] < 0)
        {
            return false;
        }
    }

    return true;
}
```

# 15. 3Sum
https://leetcode.com/problems/3sum/

```
Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.
```

Example 1:
```
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]

Explanation: 
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.
The distinct triplets are [-1,0,1] and [-1,-1,2].
Notice that the order of the output and the order of the triplets does not matter.
```

Example 2:
```
Input: nums = [0,1,1]
Output: []

Explanation: The only possible triplet does not sum up to 0.
```

Example 3:
```
Input: nums = [0,0,0]
Output: [[0,0,0]]

Explanation: The only possible triplet sums up to 0.
```

Constraints:
```
3 <= nums.length <= 3000
-105 <= nums[i] <= 105
```

## 思路
這題乍看之下也是參考前面用 ``HashTable`` 解決，但題目要求結果不能重複，所以得到所有組合後還得去重。

這樣解雖然也可以，但直接使用雙指針會相對簡單一些。

ps. 暴力法可以直接套三層迴圈，時間複雜度為 ``O(n^3)``。

解題重點:
1. 因為題目只要求返回 ``value`` 而不是 ``index``，所以可以對 ``array`` 排序。
2. 最外層 for 迭代 ``nums[i]``，然後搭配 while 不斷調整 ``left`` 與 ``right`` 指針往中央收斂，嘗試找到目標組合 ``nums[i] + nums[left] + nums[right] = 0``。
3. 記得分別對 ``nums[i]``、``nums[left]``、``nums[right]`` 去重。

## 解法
時間複雜度: ``O(n^2)``。
```csharp
public IList<IList<int>> ThreeSum(int[] nums)
{
    IList<IList<int>> result = new List<IList<int>>();
    // 由小到大排序
    Array.Sort(nums);

    // 嘗試用雙指針找到 nums[i] + nums[left] + nums[right] = 0，以下簡稱 a、b、c
    // 結果要求不能有重複的組合，故需針對 a、b、c 分別去重
    for (int i = 0; i < nums.Count(); i++)
    {
        // 若最小值已大於 0，則不可能找到其他組合
        if (nums[i] > 0)
        {
            return result;
        }

        // 針對 a 去重
        // 不能寫成 if (nums[i] == nums[i + 1])，因為會漏掉當前的組合，EX: [-1, -1, 2]
        if (i > 0 && nums[i] == nums[i - 1])
        {
            continue;
        }

        int left = i + 1;
        int right = nums.Count() - 1;
        // 透過不斷讓 left & right 往中央收斂，嘗試找到目標組合
        while (right > left)
        {
            int sum = nums[i] + nums[left] + nums[right];
            // 總和太大，right 往中間移動，讓總和小一點
            if (sum > 0)
            {
                right--;
            }
            // 總和太小，left 往中間移動，讓總和大一點
            else if (sum < 0)
            {
                left++;
            }
            // 找到目標組合
            else
            {
                result.Add(new List<int> { nums[i], nums[left], nums[right] });

                // 針對 b 去重
                while (right > left && nums[left] == nums[left + 1])
                {
                    left++;
                }

                // 針對 c 去重
                while (right > left && nums[right] == nums[right - 1])
                {
                    right--;
                }

                // 往中間移動，進行下一輪查詢
                right--;
                left++;
            }
        }
    }

    return result;
}
```

# 18. 4Sum
https://leetcode.com/problems/4sum/

```
Given an array nums of n integers, return an array of all the unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that:
    - 0 <= a, b, c, d < n
    - a, b, c, and d are distinct.
    - nums[a] + nums[b] + nums[c] + nums[d] == target
You may return the answer in any order.
```

Example 1:
```
Input: nums = [1,0,-1,0,-2,2], target = 0
Output: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
```

Example 2:
```
Input: nums = [2,2,2,2,2], target = 8
Output: [[2,2,2,2]]
```

Constraints:
```
1 <= nums.length <= 200
-109 <= nums[i] <= 109
-109 <= target <= 109
```

## 思路
一樣可以用暴力法，時間複雜度為 ``O(n^4)``，但可以透過雙指針法讓時間複雜度變為 ``O(n^3)``。

和前一題一樣，只是多了一層迴圈同時固定兩個值 ``nums[i]``、``nums[j]``。

## 解法
時間複雜度: ``O(n^3)``。
```csharp
public IList<IList<int>> FourSum(int[] nums, int target)
{
    IList<IList<int>> result = new List<IList<int>>();
    // 由小到大排序
    Array.Sort(nums);

    // 嘗試用雙指針找到 nums[i] + nums[j] + nums[left] + nums[right] = target，以下簡稱 a、b、c、d
    // 結果要求不能有重複的組合，故需針對 a、b、c、d 分別去重
    for (int i = 0; i < nums.Count(); i++)
    {
        // 在 nums[i] 已大於 0，當其大於 target 代表已找不到目標組合
        // 多加一個大於 0 的判斷是因為 target 可能是負數，EX: [-5, -4, -3, -2]，target = -14
        if (nums[i] >= 0 && nums[i] > target)
        {
            return result;
        }

        // 針對 a 去重
        if (i > 0 && nums[i] == nums[i - 1])
        {
            continue;
        }

        for (int j = i + 1; j < nums.Count(); j++)
        {
            // 針對 b 去重
            if (j > i + 1 && nums[j] == nums[j - 1])
            {
                continue;
            }

            int left = j + 1;
            int right = nums.Count() - 1;
            // 透過不斷讓 left & right 往中央收斂，嘗試找到目標組合
            while (right > left)
            {
                int sum = nums[i] + nums[j] + nums[left] + nums[right];
                // 總和太大，right 往中間移動，讓總和小一點
                if (sum > target)
                {
                    right--;
                }
                // 總和太小，left 往中間移動，讓總和大一點
                else if (sum < target)
                {
                    left++;
                }
                // 找到目標組合
                else
                {
                    result.Add(new List<int> { nums[i], nums[j], nums[left], nums[right] });

                    // 針對 c 去重
                    while (right > left && nums[left] == nums[left + 1])
                    {
                        left++;
                    }

                    // 針對 d 去重
                    while (right > left && nums[right] == nums[right - 1])
                    {
                        right--;
                    }

                    // 往中間移動，進行下一輪查詢
                    right--;
                    left++;
                }
            }
        }
    }

    return result;
}
```