class Solution:
    def gameOfLife(self, board: List[List[int]]) -> None:
        """
        Do not return anything, modify board in-place instead.
        """
        # using -1 for the cell which was alive but will die 
        # using 2 for the cell which was dead but will alive 
        def lookneighbour(board , i , j):
            count0 = 0
            count1 = 0
            row = i - 1
            if row >= 0:
                for c in range(j-1, j+2):
                    if 0 <= c < len(board[0]):
                        if board[row][c]==0 or board[row][c] == 2:
                            count0+=1
                        else:
                            count1+=1
                
            row = i + 1
            if row < len(board):
                for c in range(j-1, j+2):
                    if 0 <= c < len(board[0]):
                        if board[row][c]==0 or board[row][c] == 2:
                            count0+=1
                        else:
                            count1+=1
            
            if j > 0:
                if board[i][j-1] == 0 or board[i][j-1]== 2:
                    count0 += 1
                else:
                    count1 += 1

            if j < len(board[0]) - 1:
                if board[i][j+1] == 0 or board[i][j+1]== 2:
                    count0 += 1
                else:
                    count1 += 1          

            return [count0,count1]
        n = len(board)
        m = len(board[0])

        for i in range(n):
            for j in range(m):
                count0,count1 = lookneighbour(board,i,j)
                if board[i][j] == 0 :
                    if count1 ==3:
                        board[i][j] = 2
                else:
                    if count1<2:
                        board[i][j] = -1
                    else:
                        if count1 >3:
                            board[i][j] = -1
        print(board)
        
        for i in range(n):
            for j in range(m):
                if board[i][j]==-1:
                    board[i][j] = 0
                elif board[i][j]==2:
                    board[i][j] = 1
                else:
                    continue


        