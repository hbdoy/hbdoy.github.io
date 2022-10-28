---
title: LeetCode 筆記 - Array(2)
date: 2022-10-27 23:35:44
categories:
- LeetCode
tags:
- squares-of-a-sorted-array
- minimum-size-subarray-sum
updated:
top_img: https://i.imgur.com/kCZGwrU.png
cover: https://i.imgur.com/kCZGwrU.png
keywords:
description:
comments:
---
# 題目
- 977: Squares of a Sorted Array
- 209: Minimum Size Subarray Sum

## 977. Squares of a Sorted Array
https://leetcode.com/problems/squares-of-a-sorted-array

```
Given an integer array nums sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.
```

Example 1:
```
Input: nums = [-4,-1,0,3,10]
Output: [0,1,9,16,100]
Explanation: After squaring, the array becomes [16,1,0,9,100].
After sorting, it becomes [0,1,9,16,100].
```

Example 2:
```
Input: nums = [-7,-3,2,3,11]
Output: [4,9,9,49,121]
```

Constraints:
```
1 <= nums.length <= 104
-104 <= nums[i] <= 104
nums is sorted in non-decreasing order.
```

```
Follow up: Squaring each element and sorting the new array is very trivial, could you find an O(n) solution using a different approach?
```

## 解法
### 暴力法
時間複雜度: ``O(nlogn)``

沒什麼懸念，for loop 把每個元素平方，然後再排序。

```csharp
public int[] SortedSquares(int[] nums)
{
    for (int i = 0; i < nums.Count(); i++)
    {
        nums[i] = nums[i] * nums[i];
    }

    Array.Sort(nums);

    return nums;
}
```

### 雙指針法
時間複雜度: ``O(n)``

因為題目給定 Array **包含正負數且已經排序過，所以平方後的最大值一定在陣列的最左邊或最右邊**。
透過雙指針，每次迭代同時比較左、右邊哪個平方後較大，將其放入新陣列，並將該指針往中間前進一格。

```csharp
public int[] SortedSquares(int[] nums)
{
    // 新陣列
    int[] result = new int[nums.Count()];
    // 雙指針從左、右邊開始，所以會由大到小取值，故從最後開始寫入
    int resultIndexFromEnd = nums.Count() - 1;

    // 結束條件為小於等於，可以理解為左閉右閉，如果只有小於會漏掉最後的元素
    for (int left = 0, right = nums.Count() - 1; left <= right;)
    {
        if (Math.Pow(nums[left], 2) < Math.Pow(nums[right], 2))
        {
            // 將較大的平方值寫入 result
            result[resultIndexFromEnd] = (int)Math.Pow(nums[right], 2);
            resultIndexFromEnd--;
            // 右指針往中間推
            right--;
        }
        else
        {
            // 進入 else 條件為 rightValue <= leftValue，若相等時放入左、右都可以，所以就一起在 else block 處理
            result[resultIndexFromEnd] = (int)Math.Pow(nums[left], 2);
            resultIndexFromEnd--;
            // 左指針往中間推
            left++;
        }
    }

    return result;
}
```

## 209. Minimum Size Subarray Sum
https://leetcode.com/problems/minimum-size-subarray-sum/

```
Given an array of positive integers nums and a positive integer target, return the minimal length of a contiguous subarray [numsl, numsl+1, ..., numsr-1, numsr] of which the sum is greater than or equal to target. If there is no such subarray, return 0 instead.
```

Example 1:
```
Input: target = 7, nums = [2,3,1,2,4,3]
Output: 2
Explanation: The subarray [4,3] has the minimal length under the problem constraint.
```

Example 2:
```
Input: target = 4, nums = [1,4,4]
Output: 1
```

Example 3:
```
Input: target = 11, nums = [1,1,1,1,1,1,1,1]
Output: 0
```

Constraints:
```
1 <= target <= 109
1 <= nums.length <= 105
1 <= nums[i] <= 104
```

```
Follow up: If you have figured out the O(n) solution, try coding another solution of which the time complexity is O(n log(n)).
```

## 解法
### 暴力法
時間複雜度: ``O(n^2)``

這個解法 leetcode 不給過，顯示 ``Time Limit Exceeded``。

```csharp
public int MinSubArrayLen(int target, int[] nums)
{
    int result = int.MaxValue;
    int sum = 0;
    for (int i = 0; i < nums.Count(); i++)
    {
        sum = 0;
        for (int j = i; j < nums.Count(); j++)
        {
            sum += nums[j];
            if (sum >= target)
            {
                int subLength = j - i + 1;
                result = Math.Min(subLength, result);
                break;
            }
        }
    }

    return result == int.MaxValue ? 0 : result;
}
```

雖然暴力法無法通過，但還是可以藉由它的思路進行優化。

透過兩個 for loop 找尋所有的可能性，何謂所有的可能性，以 Example1 為例

```
Input: target = 7, nums = [2,3,1,2,4,3]
Output: 2
Explanation: The subarray [4,3] has the minimal length under the problem constraint.
```

暴力法所有可能性組合就是
2 + 3 + 1 + 2 => 長度為 4
3 + 1 + 2 + 4 => 長度為 4
1 + 2 + 4 => 長度為 3
2 + 4 + 3 => 長度為 3
**4 + 3 => 長度為 2**
3 => 未大於等於 7，不符合條件

最後會 return ``2``

在這過程中，可以理解為外層的 for 代表每一輪搜尋的``起始位置``，內層的 for 代表搜尋的``停止位置``。

### 雙指針法
如果要優化勢必得拿掉一個 for，讓它只迭代一次，也就是時間複雜度為 ``O(n)``。

透過雙指針，讓外層的 for 變成搜尋的``停止位置``，而``起始位置``則透過每一輪的動態檢查調整。

解法如下
```
public int MinSubArrayLen(int target, int[] nums)
{
    int result = int.MaxValue;
    int sum = 0;
    int left = 0;
    for (int right = 0; right < nums.Count(); right++)
    {
        sum += nums[right];
        // 動態檢查符合條件的組合
        while (sum >= target)
        {
            int subLength = right - left + 1;
            result = Math.Min(subLength, result);
            // 找到之後就變更起始位置，搜尋其他可能的組合
            sum -= nums[left];
            left++;
        }
    }

    return result == int.MaxValue ? 0 : result;
}
```

一樣以 [2,3,1,2,4,3] 為例，尋找的方式攤開來看就是
right = 0，sum(2) => 不符合

right = 1，sum(2, 3) => 不符合

right = 2，sum(2, 3, 1) => 不符合

right = 3，sum(2, 3, 1, 2) => 長度為 4
　　並且透過 while 嘗試在``固定停止位置``(2)的情況下，變更``起始位置``來檢查其他組合是否符合條件。
　　left = 1，sum(3, 1, 2) => 長度為 3
　　left = 2，sum(1, 2) => 不符合，停止 while 繼續下一輪 for

> 此處補充一下，在 while 條件不符合後，之所以不用再調整 left 確認其與當前 right 之間是否還存在 >= 7 的組合，是因為條件限制 Array 僅包含正整數，也就是說如果 sum 的結果已經小於 target，那再減掉一個正整數也不可能會大於 target。

right = 4，sum(1, 2, 4) => 長度為 3
　　並且透過 while 嘗試在``固定停止位置``(4)的情況下，變更``起始位置``來檢查其他組合是否符合條件。
　　left = 3，sum(2, 4) => 不符合，停止 while 繼續下一輪 for

right = 5，sum(2, 4, 3) => 長度為 3
　　並且透過 while 嘗試在``固定停止位置``(3)的情況下，變更``起始位置``來檢查其他組合是否符合條件。
　　**left = 4，sum(4, 3) => 長度為 2**
　　left = 5，sum(3) => 不符合，停止 while，並且 for 也結束了

最後會 return ``2``

此解法包含了一個 while，乍看之下時間複雜度也很像 ``O(n^2)``，但其實每個元素除了最外層的 for 操作到一次後，剩下就是變更``起始位置``時會再操作到一次，所以時間複雜度為 2 * n，也就是 ``O(n)``。