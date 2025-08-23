class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        strs.sort()
        a = strs[0]
        b = strs[-1]
        res =''

        for i in range(min(len(a),len(b))):
            if a[i]==b[i]:
                res+=a[i]
            else:
                break

        return res
        