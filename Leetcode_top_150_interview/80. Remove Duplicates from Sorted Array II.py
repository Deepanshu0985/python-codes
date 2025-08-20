def removeDuplicates( nums) -> int:
        j = 2
        for i in range(2,len(nums)):
            if nums[i]!=nums[j-2]:
                nums[j] = nums[i]
                j+=1
        return j
    
nums = [1,1,1,2,2,3,3,3,4,4,5,5,5]
j = removeDuplicates(nums)
for i in range(j):
    print(nums[i],end=" ")