class Solution:
    def isSubsequence(self, s: str, t: str) -> bool:
        if not s:
            return True

        temp = 0
        for i in range(len(t)):
            if t[i] == s[temp]:
                temp += 1
                if temp == len(s):  # early exit
                    return True
        return False
