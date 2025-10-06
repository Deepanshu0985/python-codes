class Solution:
    def minTime (self, arr, k):
        # code here
        s = max(arr)
        e = sum(arr)
        def helper(arr,k,m):
            division = 1
            prefix = 0
            for ele in arr:
                if prefix+ele >m:
                    division+=1
                    prefix = 0
                prefix+=ele
            return division<=k
            
        while s<e:
            m = (s+e)//2
            
            if helper(arr,k,m):
                e = m
            else:
                s = m+1
        return s