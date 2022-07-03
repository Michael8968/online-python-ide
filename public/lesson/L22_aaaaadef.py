import pygame,random,sys

from pygame.locals import *

def showScore(screen, score):
    SFont = pygame.font.Font(None, 32)
    Ssurf = SFont.render("Score  :  {0}".format(score), True, (0,0,0))  
    screen.blit(Ssurf, (350,10))
def showEnd(screen):
    font = pygame.font.Font(None, 88)
    fontimg = font.render('game over', True, (255,0,0))  
    screen.blit(fontimg, (250,250))  
    fontimg2 = font.render('press return to restart', True, (255,0,0))
    screen.blit(fontimg2, (100,350))

def reset():       #设置初始值跟重置初始值的函数
    jump = 0
    high = 0
    can_jump = True
    rect_list = []
    random_time = 0 
    return jump, high, can_jump, rect_list, random_time

def judge(screen, rect_list, man_rect, gameover, score):    #判断是否游戏结束跟加分的函数
    for r in rect_list: 
        if man_rect.colliderect(pygame.Rect(r[0],r[1],r[2],r[3])): 
            gameover = True
        
        print('ok3')
            
        if r[0] <= -30:
            score += 1
            rect_list.pop(0)  
            
        print('ok4')
            
    return gameover, score

def create(screen,random_time, rect_list, place):        # 随机时间生成随机大小障碍物的函数，并使其向左移动
    pygame.draw.rect(screen, (0,0,0), (0, place, 800, 5))
    if random_time == 0:
        random_time = random.randint(110,150)
        rectx = random.randint(10,25)
        recty = random.randint(30,45)
        rect_l = [800, place-recty, rectx, recty]
        rect_list.append(rect_l)
    else:
        random_time -= 1  
    
    for r in rect_list:
        r[0] -= 6       
    return random_time

def jumping(jump, high, can_jump):
    high = high + jump
    jump -= 3

    if high <= 0:
        high = 0
        jump = 0
        can_jump = True
          
    return jump, high, can_jump

