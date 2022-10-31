---
title: LeetCode 筆記 - LinkedList(2)
date: 2022-10-29 20:07:03
categories:
- LeetCode
tags:
- swap-nodes-in-pairs
- remove-nth-node-from-end-of-list
- intersection-of-two-linked-lists
- linked-list-cycle-ii
updated:
top_img: https://i.imgur.com/kCZGwrU.png
cover: https://i.imgur.com/kCZGwrU.png
keywords:
description:
comments:
---
# 題目
- 24: Swap Nodes in Pairs
- 19: Remove Nth Node From End of List
- 160: Intersection of Two Linked Lists
- 142: Linked List Cycle II

# 24. Swap Nodes in Pairs
https://leetcode.com/problems/swap-nodes-in-pairs/

```
Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list's nodes (i.e., only nodes themselves may be changed.)
```

Example 1:
```
Input: head = [1,2,3,4]
Output: [2,1,4,3]
```

Example 2:
```
Input: head = []
Output: []
```

Example 3:
```
Input: head = [1]
Output: [1]
```

Constraints:
```
The number of nodes in the list is in the range [0, 100].
0 <= Node.val <= 100
```

# 19. Remove Nth Node From End of List
https://leetcode.com/problems/remove-nth-node-from-end-of-list/

```
Given the head of a linked list, remove the nth node from the end of the list and return its head.
```

Example 1:
```
Input: head = [1,2,3,4,5], n = 2
Output: [1,2,3,5]
```

Example 2:
```
Input: head = [1], n = 1
Output: []
```

Example 3:
```
Input: head = [1,2], n = 1
Output: [1]
```

Constraints:
```
The number of nodes in the list is sz.
1 <= sz <= 30
0 <= Node.val <= 100
1 <= n <= sz
```


# 160. Intersection of Two Linked Lists
https://leetcode.com/problems/intersection-of-two-linked-lists/

```
Given the heads of two singly linked-lists headA and headB, return the node at which the two lists intersect. If the two linked lists have no intersection at all, return null.
```

Example 1:
```
Input: intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3
Output: Intersected at '8'
Explanation: The intersected node's value is 8 (note that this must not be 0 if the two lists intersect).
From the head of A, it reads as [4,1,8,4,5]. From the head of B, it reads as [5,6,1,8,4,5]. There are 2 nodes before the intersected node in A; There are 3 nodes before the intersected node in B.
- Note that the intersected node's value is not 1 because the nodes with value 1 in A and B (2nd node in A and 3rd node in B) are different node references. In other words, they point to two different locations in memory, while the nodes with value 8 in A and B (3rd node in A and 4th node in B) point to the same location in memory.
```

Example 2:
```
Input: intersectVal = 2, listA = [1,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1
Output: Intersected at '2'
Explanation: The intersected node's value is 2 (note that this must not be 0 if the two lists intersect).
From the head of A, it reads as [1,9,1,2,4]. From the head of B, it reads as [3,2,4]. There are 3 nodes before the intersected node in A; There are 1 node before the intersected node in B.
```

Example 3:
```
Input: intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
Output: No intersection
Explanation: From the head of A, it reads as [2,6,4]. From the head of B, it reads as [1,5]. Since the two lists do not intersect, intersectVal must be 0, while skipA and skipB can be arbitrary values.
Explanation: The two lists do not intersect, so return null.
```

Constraints:
```
The number of nodes of listA is in the m.
The number of nodes of listB is in the n.
1 <= m, n <= 3 * 104
1 <= Node.val <= 105
0 <= skipA < m
0 <= skipB < n
intersectVal is 0 if listA and listB do not intersect.
intersectVal == listA[skipA] == listB[skipB] if listA and listB intersect.
```


# 142. Linked List Cycle II
https://leetcode.com/problems/linked-list-cycle-ii/

```
Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return null.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail's next pointer is connected to (0-indexed). It is -1 if there is no cycle. Note that pos is not passed as a parameter.

Do not modify the linked list.
```

Example 1:
```
Input: head = [3,2,0,-4], pos = 1
Output: tail connects to node index 1
Explanation: There is a cycle in the linked list, where tail connects to the second node.
```

Example 2:
```
Input: head = [1,2], pos = 0
Output: tail connects to node index 0
Explanation: There is a cycle in the linked list, where tail connects to the first node.
```

Example 3:
```
Input: head = [1], pos = -1
Output: no cycle
Explanation: There is no cycle in the linked list.
```

Constraints:
```
The number of the nodes in the list is in the range [0, 104].
-105 <= Node.val <= 105
pos is -1 or a valid index in the linked-list.
```