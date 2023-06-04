---
title: LeetCode 筆記 - LinkedList
date: 2022-10-28 18:07:03
categories:
- LeetCode
tags:
- remove-linked-list-elements
- design-linked-list
- reverse-linked-list
updated:
top_img: /image/kCZGwrU.png
cover: /image/kCZGwrU.png
keywords:
description:
comments:
---
# 題目
- 203: Remove Linked List Elements
- 707: Design Linked List
- 206: Reverse Linked List

# 知識點
1. linkedlist 每一個節點包含兩個部分，一個屬性存放資料，一個指針負責指向下一個節點位置(若無則 null)。

    自己手寫的話，最基本的 ListNode 會像這樣
    ```csharp
    public class ListNode
    {
        public int val;
        public ListNode next;
        public ListNode() { }
        public ListNode(int val, ListNode next = null)
        {
            this.val = val;
            this.next = next;
        }
    }
    ```

2. linkdlist 不像 array 在記憶體中是連續的位址，而是分散的存在各位址，再透過指針把整個 list 串起來，所以其長度也不需要在一開始就固定。

3. 新增節點(curr)時，需要把 curr 的 next 指向 pre 的 next，然後把 pre 的 next 指向 curr。
    舉例: [a, b, d, e]，想要在 b 後面插入 c 時，
    ```csharp
    c.next = b.next;
    b.next = c;
    ```

4. 刪除節點(curr)時，需要把 curr 的前一個節點 pre 指向 curr.next。
    舉例: [a, b, c, d, e]，想要刪除 c 時，
    ```csharp
    b.next = c.next;
    ```

> 節點的刪除不是真的把該節點刪除，而是讓 linkedlist 中沒有任何節點再指向該節點。
> 可以想像成一個人如果被全世界所有人遺忘、不再被需要，那他在人類社會中就如同不存在一樣(?
> ps. 依照各語言特性，該節點可能會被自動回收，不用自己手動清除。

## 時間複雜度比較
查詢:
Array: O(1)
LinkedList: O(n)

新增/刪除:
Array: O(n)
LinkedList: O(1)

# 203. Remove Linked List Elements
https://leetcode.com/problems/remove-linked-list-elements/

```
Given the head of a linked list and an integer val, remove all the nodes of the linked list that has Node.val == val, and return the new head.
```

Example 1:
```
Input: head = [1,2,6,3,4,5,6], val = 6
Output: [1,2,3,4,5]
```

Example 2:
```
Input: head = [], val = 1
Output: []
```

Example 3:
```
Input: head = [7,7,7,7], val = 7
Output: []
```

Constraints:
```
The number of nodes in the list is in the range [0, 104].
1 <= Node.val <= 50
0 <= val <= 50
```

## 解法
### 設置虛擬 head 節點
時間複雜度: ``O(n)``

刪除的流程是找到欲刪除節點的前一個節點，然後將前一個節點的 next 指向欲刪除節點的 next。

但如果欲刪除的節點就是 linkelist 的第一個節點也就是 head 時，還得特別處理這種情境。

可以透過設定一個虛擬的 head，讓刪除的邏輯統一。 

```csharp
public ListNode RemoveElements(ListNode head, int val)
{
    if (head == null)
    {
        return head;
    }

    // 設定虛擬節點，避免刪除 head 的情況要特別處理
    ListNode dummy = new ListNode(-1, head);
    // 前一個節點
    ListNode pre = dummy;
    // 當前節點
    ListNode cur = head;

    while (cur != null)
    {
        // 發現要刪除的節點
        if (cur.val == val)
        {
            // 將前一個節點的 next 指向當前節點的 next
            pre.next = cur.next;
        }
        // 不需刪除則將 pre 和 cur 都往後移動，以便檢查下一個節點
        else
        {
            pre = cur;
        }
        cur = cur.next;
    }
    return dummy.next;
}
```

因為習慣在 ide 上寫完再貼到 leetcode 提交，這邊附上寫得很醜的 GenerateListNodes 方法XD
```csharp
public ListNode GenerateListNodes(List<int> vals)
{
    ListNode head = null;
    ListNode curr = null;

    if (!vals.Any())
    {
        return null;
    }
    else
    {
        head = new ListNode(vals.First());
        curr = head;
    }

    if (vals.Count == 1)
    {
        return head;
    }

    for (int i = 1; i < vals.Count; i++)
    {
        curr.next = new ListNode(vals.ElementAt(i));
        curr = curr.next;
    }

    return head;
}

var input = GenerateListNodes(new List<int> { 1, 2, 6, 3, 4, 5, 6 });

var result = RemoveElements(input, 6);
```

# 707. Design Linked List
https://leetcode.com/problems/design-linked-list/

```
Design your implementation of the linked list. You can choose to use a singly or doubly linked list.
A node in a singly linked list should have two attributes: val and next. val is the value of the current node, and next is a pointer/reference to the next node.
If you want to use the doubly linked list, you will need one more attribute prev to indicate the previous node in the linked list. Assume all nodes in the linked list are 0-indexed.

Implement the MyLinkedList class:
- MyLinkedList() Initializes the MyLinkedList object.
- int get(int index) Get the value of the indexth node in the linked list. If the index is invalid, return -1.
- void addAtHead(int val) Add a node of value val before the first element of the linked list. After the insertion, the new node will be the first node of the linked list.
- void addAtTail(int val) Append a node of value val as the last element of the linked list.
- void addAtIndex(int index, int val) Add a node of value val before the indexth node in the linked list. If index equals the length of the linked list, the node will be appended to the end of the linked list. If index is greater than the length, the node will not be inserted.
- void deleteAtIndex(int index) Delete the indexth node in the linked list, if the index is valid.
```

Example 1:
```
Input
["MyLinkedList", "addAtHead", "addAtTail", "addAtIndex", "get", "deleteAtIndex", "get"]
[[], [1], [3], [1, 2], [1], [1], [1]]
Output
[null, null, null, null, 2, null, 3]

Explanation
MyLinkedList myLinkedList = new MyLinkedList();
myLinkedList.addAtHead(1);
myLinkedList.addAtTail(3);
myLinkedList.addAtIndex(1, 2);    // linked list becomes 1->2->3
myLinkedList.get(1);              // return 2
myLinkedList.deleteAtIndex(1);    // now the linked list is 1->3
myLinkedList.get(1);              // return 3
```

Constraints:
```
0 <= index, val <= 1000
Please do not use the built-in LinkedList library.
At most 2000 calls will be made to get, addAtHead, addAtTail, addAtIndex and deleteAtIndex.
```

## 解法
```csharp
// leetcode 上可以不用寫
public class ListNode
{
    public int val;
    public ListNode next;
    public ListNode() { }
    public ListNode(int val, ListNode next = null)
    {
        this.val = val;
        this.next = next;
    }
}

public class MyLinkedList
{
    int size;
    // 虛擬 head
    ListNode head;

    public MyLinkedList()
    {
        size = 0;
        head = new ListNode();
    }

    // 取得指定 index 之 value
    public int Get(int index)
    {
        if (index < 0 || index >= size)
        {
            return -1;
        }

        ListNode currentNode = head;

        // 執行 index + 1 次(因為包含虛擬 head)
        for (int i = 0; i <= index; i++)
        {
            currentNode = currentNode.next;
        }

        return currentNode.val;
    }

    public void AddAtHead(int val)
    {
        AddAtIndex(0, val);
    }

    public void AddAtTail(int val)
    {
        AddAtIndex(size, val);
    }

    // 在第 index 個節點前面新增一個節點
    // 如果 index <= 0，那麼新增的節點就是新的 head
    // 如果 index == List 長度，那麼新增的節點就是新的 tail
    // 如果 index > List 長度，則直接 return
    public void AddAtIndex(int index, int val)
    {
        if (index > size)
        {
            return;
        }
        if (index < 0)
        {
            index = 0;
        }

        ListNode pre = head;
        // 執行 index 次(因為包含虛擬 head)，找到欲新增 index 的前一個節點
        for (int i = 0; i < index; i++)
        {
            pre = pre.next;
        }

        // Add
        // 新節點 next 指向 pre.next
        ListNode needAdd = new ListNode(val, pre.next);
        // pre 指向新節點
        pre.next = needAdd;

        // 更新 list 長度
        size++;
    }

    // 刪除第 index 個節點
    public void DeleteAtIndex(int index)
    {
        if (index < 0 || index >= size)
        {
            return;
        }

        ListNode pre = head;
        // 執行 index 次(因為包含虛擬 head)，找到欲刪除 index 的前一個節點
        for (int i = 0; i < index; i++)
        {
            pre = pre.next;
        }
        pre.next = pre.next.next;

        // 更新 list 長度
        size--;
    }

    public void PrintList()
    {
        ListNode curr = head;
        for (int i = 0; i < size; i++)
        {
            curr = curr.next;
            Console.WriteLine(curr.val);
        }
    }
}
```

用法範例:
```csharp
var t = new MyLinkedList();
t.PrintList(); // nothing
t.AddAtHead(1);
t.AddAtTail(3);
t.AddAtIndex(1, 2);
t.PrintList(); // 1, 2, 3
t.DeleteAtIndex(0);
t.PrintList(); // 2, 3
```

# 206. Reverse Linked List
https://leetcode.com/problems/reverse-linked-list/

```
Given the head of a singly linked list, reverse the list, and return the reversed list.
```

Example 1:
```
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]
```

Example 2:
```
Input: head = [1,2]
Output: [2,1]
```

Example 3:
```
Input: head = []
Output: []
```

## 解法
要反轉 linkedlist，基本上就是把每一次迭代的節點指針往回指，但要注意往回指之前要先暫存下一個節點。

```csharp
public ListNode ReverseList(ListNode head)
{
    if (head == null)
    {
        return head;
    }

    ListNode pre = null;
    ListNode curr = head;
    while (curr != null)
    {
        // 暫存下一個節點
        ListNode next = curr.next;

        // 往回指
        curr.next = pre;

        // 準備處理下一個節點
        pre = curr;
        curr = next;
    }

    // curr 最後會是舊 tail.next 也就是 null，所以 tail 要取 pre 
    return pre;
}
```