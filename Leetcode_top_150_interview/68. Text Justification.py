def fullJustify( words, maxw: int):
    res =[]
    line = []
    length =0
    i =0
    while i<len(words):
        if length + len(line) + len(words[i]) >maxw:
            extraspace = maxw - len(line)
            spaces = extraspace // max(1,len(line)-1)
            rem = extraspace//max(1,len(line)-1)
            for j in range(max(1,len(line)-1)):
                line[j]+=" "*spaces
                if rem:
                    line[j]+=" "
                    rem-=1
            res.append("".join(line))
            line = []
            length =0
        line.append(words[i])
        length+=len(words[i])
        i+=1
    
    lastline = " ".join(line)
    lastspace = maxw - len(lastline)
    res.append(lastline+" "*lastspace)
    return res
words = ["This", "is", "an", "example", "of", "text", "justification."] 
maxWidth = 16

print(fullJustify(words,maxWidth))

            
    