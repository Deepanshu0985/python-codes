class Solution:
    def trap(self, height: List[int]) -> int:
        n= len(height)
        maxleft =0
        maxright =0
        trapped =0
        l=0
        r=n-1

        while l<r:
            maxleft= max(maxleft,height[l])
            maxright= max(maxright,height[r])

            if maxleft<maxright:
                trapped+= maxleft-height[l]
                l+=1
            else:
                trapped+=maxright - height[r]
                r-=1
        return trapped


       
        return trapped


        