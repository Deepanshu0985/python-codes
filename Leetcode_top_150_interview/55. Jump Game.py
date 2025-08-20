def canJump(nums) -> bool:
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + jump)
    return True
nums = [2,3,1,1,4]
print(canJump(nums))
