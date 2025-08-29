from typing import List
from collections import defaultdict
def findSubstring( s: str, words: List[str]) -> List[int]:
    freq = defaultdict(int)
    n= len(words[0])
    total = n * len(words)
    for word in words:
        freq[word]+=1
    res = []

    for i in range(len(s)-total+1):
        temp = freq.copy()
        j = i 
        while j <i+total:
            word = s[j:j+n]
            if word in temp and temp[word]>=1:
                temp[word]-=1
                j = j+n
            else:
                break
        if j == i+total:
            res.append(i)
    return res

s = "wordgoodgoodgoodbestword"
words = ["word","good","best","word"]
print(findSubstring(s,words))