def maxProfit( prices) -> int:
    result = 0
    for i in range(1,len(prices)):
        result += max(0,(prices[i]-prices[i-1]))
    return result

prices = [7,1,7,3,6,4]
print(maxProfit(prices))
        
    