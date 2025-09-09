class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        intervals.sort()
        res = []
        arr = []
        for i in range(len(intervals)):
            interval = intervals[i]
            if not arr or arr[-1][1] < interval[0]:
                arr.append(interval)
            else:
                arr[-1][1] = max(arr[-1][1],interval[1])

        return arr



        