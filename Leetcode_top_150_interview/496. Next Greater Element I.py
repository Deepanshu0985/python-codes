class Solution:
    def nextGreaterElement(self, nums1: List[int], nums2: List[int]) -> List[int]:
        nums1idx = {n:i for i,n in enumerate(nums1)}
        res = [-1] * len(nums1)
        st = []

        for i in range(len(nums2)):
            val = nums2[i]
            while st and val > st[-1]:
                temp = st.pop()
                idx = nums1idx[temp]
                res[idx] = val
            if val in nums1idx :
                st.append(val)
        return res

        # for i in range(len(nums2)):
        #     if nums2[i] not in nums1idx:
        #         continue
        #     for j in range(i+1,len(nums2)):
        #         if nums2[j]>nums2[i]:
        #             idx = nums1idx[nums2[i]]
        #             res[idx] = nums2[j]
        #             break
        # return res

        