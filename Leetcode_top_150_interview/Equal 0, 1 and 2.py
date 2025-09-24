#User function Template for python3
from collections import defaultdict
class Solution:

    def getSubstringWithEqual012(self, s):
        freq = defaultdict(int)
        # code here
        ans = 0
        z=0
        o=0
        t =0
        n = len (s)
        freq[(0,0)] = 1
        for c in s:
            if c== '0' : z +=1
            if c=='1' : o+=1
            if c=='2' : t+=1
            
            diff = (o-z,o-t)
            ans += freq[diff]
            freq[diff] += 1
        
        return ans