def jump( nums) -> int:
    farthest = 0
    end = 0
    jump =0
    for i in range(len(nums)-1):
        farthest = max(farthest,(nums[i]+1))
        if end == i :
            jump +=1
            end = farthest
    return jump

nums = [2,3,1,1,4]

print(jump(nums))