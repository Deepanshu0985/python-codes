def majorityElement( nums) -> int:
    n = len(nums)
    mpp = {}

    for num in nums:
        if num in mpp:
            mpp[num] = mpp.get(num,0) + 1
        else:
            mpp[num] =1

    for key, val in mpp.items():
        if val > n // 2:
            return key
    
    return 0
nums = [3,2,3]
print(majorityElement(nums))