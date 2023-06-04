---
title: LeetCode 筆記 - Array
date: 2022-10-26 11:30:25
categories:
- LeetCode
tags:
- binary-search
- remove-element
updated:
top_img: /image/kCZGwrU.png
cover: /image/kCZGwrU.png
keywords:
description:
comments:
---
# 題目
- 704: Binary Search
- 27: Remove Element

# 704. Binary Search
https://leetcode.com/problems/binary-search

```
Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.

You must write an algorithm with O(log n) runtime complexity.
```

Example1:
```
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4
```

Example2:
```
Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1
Explanation: 2 does not exist in nums so return -1
```

Constraints:
```
- 1 <= nums.length <= 104
- -104 < nums[i], target < 104
- All the integers in nums are unique.
- nums is sorted in ascending order.
```

## 知識點
雖然題目直接寫明了 binary search，但在使用時還是得注意

1. array 是否已經排序?
2. array 是否有重複元素?

再來要思考的就是邊界條件到底要怎麼寫?

1. left index 與 right index 要用``小於``還是``小於等於``?
2. middle value > target 時，right index 要改為 ``middle`` 還是 ``middle - 1``?
3. middle value < target 時，right index 要改為 ``middle`` 還是 ``middle + 1``?

簡單來說，如果 index 區間是 ``[left, right]``，則
- middleValue > targetValue 時，``rightIndex = middle - 1``，因為當下之 middleValue 已經不會是 targetValue 了，所以下一輪的 right 邊界不用在包含它。
- middleValue < targetValue 時，``leftIndex = middle + 1``，因為當下之 middleValue 已經不會是 targetValue 了，所以下一輪的 left 邊界不用在包含它。

反之若 index 區間是 ``[left, right)``，則
- middleValue > targetValue 時，因為右邊界不包含，``rightIndex = middle``。
- middleValue < targetValue 時，``leftIndex = middle + 1``。

## 解法
### First
個人比較習慣 ``[left, right]`` 的寫法。

```csharp
public int Search(int[] nums, int target)
{
    int left = 0;
    int right = nums.Count() - 1;

    while (left <= right)
    {
        int middle = (left + right) / 2;
        if (nums[middle] > target)
        {
            right = middle - 1;
        }
        else if (nums[middle] < target)
        {
            left = middle + 1;
        }
        else
        {
            return middle;
        }
    }

    return -1;
}
```

### Second
另外一個是 ``[left, right)`` 的版本

```csharp
public int Search(int[] nums, int target)
{
    int left = 0;
    int right = nums.Count();

    while (left < right)
    {
        int middle = (left + right) / 2;
        if (nums[middle] > target)
        {
            right = middle;
        }
        else if (nums[middle] < target)
        {
            left = middle + 1;
        }
        else
        {
            return middle;
        }
    }

    return -1;
}
```

# 27: Remove Element
https://leetcode.com/problems/remove-element/

```
Given an integer array nums and an integer val, remove all occurrences of val in nums in-place. The relative order of the elements may be changed.

Since it is impossible to change the length of the array in some languages, you must instead have the result be placed in the first part of the array nums. More formally, if there are k elements after removing the duplicates, then the first k elements of nums should hold the final result. It does not matter what you leave beyond the first k elements.

Return k after placing the final result in the first k slots of nums.

Do not allocate extra space for another array. You must do this by modifying the input array in-place with O(1) extra memory.
```

Example 1:
```
Input: nums = [3,2,2,3], val = 3
Output: 2, nums = [2,2,_,_]
Explanation: Your function should return k = 2, with the first two elements of nums being 2.
It does not matter what you leave beyond the returned k (hence they are underscores).
```

Example 2:
```
Input: nums = [0,1,2,2,3,0,4,2], val = 2
Output: 5, nums = [0,1,4,0,3,_,_,_]
Explanation: Your function should return k = 5, with the first five elements of nums containing 0, 0, 1, 3, and 4.
Note that the five elements can be returned in any order.
It does not matter what you leave beyond the returned k (hence they are underscores).
```

Constraints:
```
0 <= nums.length <= 100
0 <= nums[i] <= 50
0 <= val <= 100
```

> ps. 不需要考慮陣列中超出新長度後面的元素。

## 知識點
要記得 array 在記憶體中的位址是連續的，不能單獨刪除陣列中的某個元素，只能覆寫。

## 解法
### 暴力法
時間複雜度: ``O(n^2)``
空間複雜度: ``O(1)``

```csharp
public int RemoveElement(int[] nums, int val)
{
    int count = nums.Count();

    for (int i = 0; i < count; i++)
    {
        if (nums[i] == val)
        {
            // 找到需要移除的元素，將其餘元素往前移動一位
            for (int j = i; j < count - 1; j++)
            {
                // j < count - 1: 當最後一個元素往前移，則原本意義上的最後一個元素就不處理了
                nums[j] = nums[j + 1];
            }
            // 因為元素往前一位，所以 i 也往前一位
            i--;
            // 陣列數量 - 1
            count--;
        }
    }

    return count;
}
```

### 雙指針法
時間複雜度: ``O(n)``
空間複雜度: ``O(1)``

可以理解為，建立一個新陣列(實際使用同一個)，並且在迭代過程中將 ``val`` 以外的元素都依序放入這個新陣列。
``新陣列``(實際使用同一個)使用的 index 為 ``slowIndex``，從 0 開始，並且只有在寫入元素後才會 + 1。
``舊陣列``(實際使用同一個)使用的 index 為 ``fastIndex``，如果當前值不等於 ``val``，則會將該值(``nums[fastIndex]``)放入新陣列。

```csharp
public int RemoveElement(int[] nums, int val)
{
    int slowIndex = 0;
    for (int fastIndex = 0; fastIndex < nums.Count(); fastIndex++)
    {
        if (nums[fastIndex] != val)
        {
            nums[slowIndex] = nums[fastIndex];
            // 只有在寫入新值時才會 + 1
            slowIndex++;
        }
    }
    return slowIndex;
}
```