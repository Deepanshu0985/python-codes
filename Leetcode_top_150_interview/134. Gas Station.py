class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        total_gas = sum(gas)
        total_cost = sum(cost)
        if total_gas - total_cost <0:
            return -1
        
        startingpoint = 0
        tank =0

        for i in range (len(gas)):
            tank += gas[i] - cost[i]
            if tank<0:
                startingpoint = i+1
                tank =0
        return startingpoint

                

        