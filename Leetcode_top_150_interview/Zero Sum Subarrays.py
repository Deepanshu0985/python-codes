from collections import defaultdict
class Solution:
    def findSubarray(self, arr):
        k =2 
        freq = defaultdict(int)
        res = 0
        prefix = 0
        freq[0] =1
        for x in arr:
            prefix +=x
            res+=freq[prefix-k]
            freq[prefix]+=1
            

        return res

obj = Solution()
print(obj.findSubarray([6, 3, -1, -3, 4, -2, 2, 4, 6, -12, -7]))