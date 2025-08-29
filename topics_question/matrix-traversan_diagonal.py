mat = [[1,7,3],[9,8,2],[4,5,6]]
def traverse_mat (mat):
    row = len(mat )
    col = len(mat[0])
    res = []
    for r in range(row-1,-1,-1):
        i = r
        j =0
        diag = []
        while i < row and j<col:
            diag.append(mat[i][j])
            i +=1
            j+=1
        diag.sort(reverse=True)
        res.append(diag)
    
    for c in range(1,col):
        i = 0 
        j = c
        diag = []
        while i<row and j <col:
            diag.append(mat[i][j])
            i +=1
            j+=1
        diag.sort(reverse=True)
        res.append(diag)
            
    return res
print(traverse_mat(mat))
            
        
        
    
    
    
