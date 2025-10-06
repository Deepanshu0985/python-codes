#abstract binary search or binary search on answer
class Solution:
    def splitArray(self, nums: List[int], k: int) -> int:
        s = max(nums)
        e = sum(nums)
        def helper(nums,m,k):
            division = 1 
            prefix = 0
            for ele in nums:
                if prefix+ele >m:
                    division+=1
                    prefix = 0
                prefix +=ele
            print(division)
            
            return division<=k

            
        while s<e:
            m = (s+e)//2
            print("m = ",m)
            valid = helper(nums,m,k)
            if valid:
                e = m
            else:
                s = m+1
        return s