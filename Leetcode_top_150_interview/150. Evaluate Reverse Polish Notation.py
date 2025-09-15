from typing import List

class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        stack: List[int] = []
        ops = {"+", "-", "*", "/"}

        for t in tokens:
            if t not in ops:
                stack.append(int(t))
            else:
                b = stack.pop()  
                a = stack.pop()   

                if t == "+":
                    stack.append(a + b)
                elif t == "-":
                    stack.append(a - b)
                elif t == "*":
                    stack.append(a * b)
                else: 
                    if a * b < 0:
                        stack.append(- (abs(a) // abs(b)))
                    else:
                        stack.append(abs(a) // abs(b))

        return stack[-1]
