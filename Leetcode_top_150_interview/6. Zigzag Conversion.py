class Solution:
    def convert(self, s: str, numRows: int) -> str:
        down = False
        currrow = 0
        ans = ['']*numRows
        
        if numRows == 1 or numRows >= len(s):
            return s

        for char in s:
            ans[currrow] += char
            if currrow ==0 or currrow == numRows-1:
                down = not down
            currrow += 1 if down else -1
        return "".join(ans)
        