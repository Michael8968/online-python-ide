#import pygame,random,math,sys
from pygame.locals import *
from pygame import Rect


# 打开方块               这部分涉及到函数递归调用， 如果学生很厉害可以讲，
def open_block(map_list, cover, open_list, f, s):
    if map_list[f][s] == -1:
        cover[f][s] = 0
        return True
    if map_list[f][s] != 0:
        cover[f][s] = 0
        open_list.append([f,s])
    elif map_list[f][s] == 0:
        cover[f][s] = 0
        open_list.append([f,s])
        for i in [-1,0,1]:
            for j in [-1,0,1]:
                if f + i >=0 and f +i <= 8 and s +j >=0 and s +j <= 8 and not (i == 0 and j == 0):
                    cover[f+i][s+j] = 0
                    if map_list[f+i][s+j] == 0 and [f+i, s+j] not in open_list:
                        open_block(map_list, cover, open_list,f+i, s+j)





def get(pos):
    for i in range(9):
        for j in range(9):
            if Rect(42+ 30*j, 142+ i*30, 30, 30).collidepoint(pos):
                #print(str(i) + '   ' +   str(j))
                return i,j

    return -1, -1
