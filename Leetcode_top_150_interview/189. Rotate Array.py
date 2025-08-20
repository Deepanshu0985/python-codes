def rotate( nums, k: int) -> None:
    n = len(nums)
    if k > n:
        k=k%n
    def reverse(l,r):
        while l <r:
            nums[l],nums[r] = nums[r],nums[l]
            l,r = l+1,r-1
    reverse(0,n-1)
    reverse(0,k-1)
    reverse(k,n-1)
    

nums = [1,2,3,4,5,6,7]
k = 3

rotate(nums,k)
for ele in nums:
    print(ele,end=" ")
