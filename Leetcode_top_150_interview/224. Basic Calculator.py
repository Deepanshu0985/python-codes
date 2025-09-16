class Solution:
    def calculate(self, s: str) -> int:
        stack = []           
        n = len(s)
        ans = 0
        curr = 0
        sign = 1             
        i = 0

        while i < n:
            c = s[i]

            if c.isdigit():
                
                curr = int(c)
                while i + 1 < n and s[i + 1].isdigit():
                    curr = curr * 10 + int(s[i + 1])
                    i += 1
                curr = curr * sign
                ans += curr
                curr = 0
                sign = 1

            elif c == '+':
                sign = 1

            elif c == '-':
                sign = -1

            elif c == '(':
                stack.append(ans)
                stack.append(sign)
                ans = 0
                sign = 1

            elif c == ')':
                prev_sign = stack.pop()
                prev_ans = stack.pop()
                ans = prev_ans + prev_sign * ans

            i += 1

        return ans
