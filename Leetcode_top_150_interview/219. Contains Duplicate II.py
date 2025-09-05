class Solution:
    def containsNearbyDuplicate(self, nums: list[int], k: int) -> bool:
        mp = {}

        for i, num in enumerate(nums):
            if num in mp and i - mp[num] <= k:
                return True
            mp[num] = i 
        return False
