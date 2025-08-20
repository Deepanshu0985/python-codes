def maxProfit(prices )-> int:

    maxprofit=0
    low=float('inf')
    for num in prices:
        if num<low:
            low = num
        else:
            maxprofit = max(maxprofit,(num-low))

    return maxprofit
prices = [7,1,5,3,6,4]
print(maxProfit(prices))
