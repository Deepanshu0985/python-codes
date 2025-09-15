class MinStack:

    def __init__(self):
        self.stk = []
        self.min_val = float('inf')
        
    def push(self, val: int) -> None:
        self.min_val = min(self.min_val,val)
        self.stk.append([val,self.min_val])
        

    def pop(self) -> None:
        self.stk.pop()
        if self.stk:
            self.min_val = self.stk[-1][1]
        else:
            self.min_val = float('inf')
        

    def top(self) -> int:
        return self.stk[-1][0]
        

    def getMin(self) -> int:
        return self.stk[-1][1]
        


# Your MinStack object will be instantiated and called as such:
# obj = MinStack()
# obj.push(val)
# obj.pop()
# para_3 = obj.top()
# para_4 = obj.getMin()