class Solution(object):
    def twoSum(self, nums, target):
        """
        :type nums: List[int]
        :type target: int
        :rtype: List[int]
        """
        n = len(nums)
        mp = {}
        for i,num in enumerate(nums):
            temp = target - num
            if temp in mp:
                return [mp[temp],i]
            mp[num] = i
        