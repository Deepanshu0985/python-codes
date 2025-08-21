import random
class RandomizedSet:

    def __init__(self):
        self.st = set()
        

    def insert(self, val: int) -> bool:
        if val not in self.st:
            self.st.add(val)
            return True
        

    def remove(self, val: int) -> bool:
        if val in self.st:
            self.st.remove(val)
            return True
        return False
            
        

    def getRandom(self) -> int:
        return random.choice(list(self.st))
        


# Your RandomizedSet object will be instantiated and called as such:
obj = RandomizedSet()
param_1 = obj.insert(1)
param_1 = obj.insert(2)
param_1 = obj.insert(3)
param_1 = obj.insert(4)
param_2 = obj.remove(5)
param_3 = obj.getRandom()