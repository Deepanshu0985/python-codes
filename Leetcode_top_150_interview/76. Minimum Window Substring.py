from collections import Counter
def minWindow(s: str, t: str) -> str:
    if len(t) > len(s):
        return ""
    
    l = 0 
    r = 0
    ind = 0
    maxlen = float('inf')
    cnt = 0
    
    need = Counter(t)      
    window = Counter()           
    have, need_count = 0, len(need)

    while r < len(s):
        window[s[r]] += 1
        if s[r] in need and window[s[r]] == need[s[r]]:
            have += 1

        while have == need_count:
            if r - l + 1 < maxlen:
                maxlen = r - l + 1
                ind = l

            window[s[l]] -= 1
            if s[l] in need and window[s[l]] < need[s[l]]:
                have -= 1
            l += 1

        r += 1

    return s[ind:ind+maxlen] if maxlen != float('inf') else ""


s = "ADOBECODEBANC" 
t = "ABC"    
print(minWindow(s,t))