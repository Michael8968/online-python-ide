#!/usr/bin/env python3
#! -*-conding:utf-8 -*-

#!@Time   :2018/4/11 17:14
#!@Author :@liuweqia
#!@File   :main.py

import pygame, random
from pygame.locals import *
from L8_myClass import *
from pygame import Rect

pygame.init()
pygame.display.set_caption('game')

screen = pygame.display.set_mode((1000,630))
#背景1和背景1的底部
bg0 = pygame.image.load('lesson8/img/bg0.png').convert_alpha()
bg0 = pygame.transform.smoothscale(bg0, (2000,630))
bg0s = pygame.image.load('lesson8/img/bg0s.png').convert_alpha()
bg0s = pygame.transform.smoothscale(bg0s, (2000,630))

#背景2和背景2的底部
bg1 = pygame.image.load('lesson8/img/bg1.png').convert_alpha()
bg1 = pygame.transform.smoothscale(bg1, (1000,630))
bg1s = pygame.image.load('lesson8/img/bg1s.png').convert_alpha()
bg1s = pygame.transform.smoothscale(bg1s, (1000,630))

#祭坛跟光跟屏幕跟箭袋
tang = pygame.image.load('lesson8/img/tang.png').convert_alpha()
tang = pygame.transform.smoothscale(tang, (2000,630))
tang2 = pygame.image.load('lesson8/img/tang2.png').convert_alpha()
tang2 = pygame.transform.smoothscale(tang2, (2000, 630))
guang = pygame.image.load('lesson8/img/guang.png').convert_alpha()
guang = pygame.transform.smoothscale(guang, (2000, 630))
scrn1 = pygame.image.load('lesson8/img/scrn1.png').convert_alpha()
scrn1 = pygame.transform.smoothscale(scrn1, (2000, 630))
scrn2 = pygame.image.load('lesson8/img/scrn2.png').convert_alpha()
scrn2 = pygame.transform.smoothscale(scrn2, (2000, 630))
#red_dorlach = pygame.image.load('lesson8/img/reddorlach.png').convert_alpha()
#red_dorlach = pygame.transform.smoothscale(red_dorlach, (300,300))
#blue_dorlach = pygame.image.load('lesson8/img/bluedorlach.png').convert_alpha()
#blue_dorlach = pygame.transform.smoothscale(blue_dorlach, (300,300))
dorlach = pygame.image.load('lesson8/img/dorlach.png').convert_alpha()
dorlach = pygame.transform.smoothscale(dorlach, (2000,630))

#踏板
step = pygame.image.load('lesson8/img/step.png').convert_alpha()
step = pygame.transform.smoothscale(step, (250,50))
step2 = pygame.transform.smoothscale(step, (300,50))

bei = pygame.image.load('lesson8/img/bei.png').convert_alpha()
bei = pygame.transform.smoothscale(bei, (72,90))

rentou = pygame.image.load('lesson8/img/rentou.png').convert_alpha()
rentou = pygame.transform.smoothscale(rentou, (50,50))

longtou = pygame.image.load('lesson8/img/longtou.png').convert_alpha()
longtou = pygame.transform.smoothscale(longtou, (50,50))

collide_type = ''
collideRock = None

def collideType(hero, collideRock):
    collide_type = ''
    if not collideRock == None:
        if hero.rect.bottom-8 < collideRock.rect.top and hero.rect.left < collideRock.rect.right and hero.rect.right > collideRock.rect.left:
            collide_type = 'down'
        elif hero.rect.right-8 < collideRock.rect.left and hero.rect.top < collideRock.rect.bottom and hero.rect.bottom > collideRock.rect.top:
            collide_type = 'right'
        elif hero.rect.left+8 > collideRock.rect.right and hero.rect.top < collideRock.rect.bottom and hero.rect.bottom > collideRock.rect.top:
            collide_type = 'left'
        elif hero.rect.centery > collideRock.rect.bottom and hero.rect.left < collideRock.rect.right and hero.rect.right > collideRock.rect.left:
            collide_type = 'up'
    return collide_type

mainClock = pygame.time.Clock()

group = pygame.sprite.Group()
rocGroup = pygame.sprite.Group()
hero = Hero(20,400)
#hero.add(group)

roc0 = Rock(0,578, 1000, 20)

#group.add(roc0)
group.add(hero)
rocGroup.add(roc0)
LEFT = 1
RIGHT = 0
UP = 2
STOP = 3
jump_vel = 0
player_jumping = False
gravity = 5
bgx = 0

while True:
    screen.blit(bg0, (bgx, 0)) 
    ticks = pygame.time.get_ticks()

    if pygame.sprite.spritecollideany(hero, rocGroup):
        collideRock = pygame.sprite.spritecollideany(hero, rocGroup)
        #print(collideRock)
    else:
        collideRock = None
        collide_type = ''

    collide_type = collideType(hero, collideRock)

    if collide_type == 'down':
        player_jumping = False
        jump_vel = 0
        hero.rect.bottom = collideRock.rect.top + 2
        gravity = 0
        hero.air = False
    else:
        gravity = 5
        hero.air = True

    keys = pygame.key.get_pressed()
    for event in pygame.event.get():
        if event.type == QUIT:
            pygame.quit()

        if event.type == KEYDOWN and event.key == K_UP:
            # hero.direction = UP
            player_jumping = True
            jump_vel = -20
 
    hero.rect.top += gravity

    if keys[K_LEFT]:
        if hero.rect.centerx <= 500:
            if hero.rect.left > 0:
                hero.rect.left -= 5
            else:
                hero.rect.left = 0
        else:
            if bgx <= 0:
                bgx += 5
            else:
                hero.rect.left -= 5
        hero.direction = LEFT
        hero.moving = True
    else:
        hero.moving = False

    if keys[K_RIGHT]:
        if hero.rect.centerx <= 500:
            hero.rect.right += 5
        else:
            bgx -= 5
        hero.direction = RIGHT
        hero.moving = True
    elif not keys[K_LEFT]:
        hero.moving = False
 
    if keys[K_ESCAPE]:
        pygame.quit()

    if player_jumping:
        hero.rect.top += jump_vel
        jump_vel += 1
        if jump_vel >= 0:
            jump_vel = 0

    group.update(ticks)
    group.draw(screen)
    screen.blit(bg0s, (bgx,0))
    #print(bgx)
    #print(hero.rect)
    if bgx <= -870:
        roc0.kill()
        break
    
    mainClock.tick(60)
    pygame.display.update()
'''
'''
tangy = 60
for i in range(65):
    if tangy > 0:
        tangy -= 1
    screen.blit(bg0, (-870, 0))

    screen.blit(tang, (-870, tangy))
    screen.blit(hero.stop, (480, 490))
    screen.blit(bg0s, (-870,0))
    keys = pygame.key.get_pressed()
    for event in pygame.event.get():
        if event.type == QUIT:
            pygame.quit()
    if keys[K_ESCAPE]:
        pygame.quit()
        
    mainClock.tick(50)    
    pygame.display.update()

beixn = 0
for i in range(65):
    beix = [0,-5,5,-5,5,0]
    screen.blit(bg0, (-870, 0))

    screen.blit(tang, (-870, 0))
    screen.blit(bei, (480 + beix[beixn], 490))
    if i%10 == 0:
        if beixn <4:
            beixn += 1
    screen.blit(bg0s, (-870,0))
    keys = pygame.key.get_pressed()
    for event in pygame.event.get():
        if event.type == QUIT:
            pygame.quit()
    if keys[K_ESCAPE]:
        pygame.quit()
        
    mainClock.tick(50)    
    pygame.display.update()

scrny = -300
for i in range(170):
    if scrny < 0:
        scrny += 2
    screen.blit(bg0, (-870, 0))

    screen.blit(tang2, (-870, 0))
    screen.blit(bei, (480, 490))
    screen.blit(scrn1, (-880, scrny))
    screen.blit(bg0s, (-870,0))
    #print(bei.get_rect())

    keys = pygame.key.get_pressed()
    for event in pygame.event.get():
        if event.type == QUIT:
            pygame.quit()
    if keys[K_ESCAPE]:
        pygame.quit()
        
    mainClock.tick(50)        
    pygame.display.update()

out = False
num = 0
jiantong = 0
while True:
    screen.blit(bg0, (-870, 0))
    screen.blit(tang2, (-870, 0))
    screen.blit(bei, (480, 490))
    screen.blit(scrn2, (-880, 0))
    screen.blit(bg0s, (-870, 0))
    keys = pygame.key.get_pressed()
    for event in pygame.event.get():
        if event.type == QUIT:
            pygame.quit()
        if event.type == KEYDOWN and event.key == K_1:
            num = 1
            print(num)
        if event.type == KEYDOWN and event.key == K_2:
            num = 2
            print(num)
        if event.type == KEYDOWN and event.key == K_3:
            num = 3
            #print(num)
        if event.type == KEYDOWN and event.key == K_4:
            num = 4
            #print(num)
        if event.type == KEYDOWN and event.key == K_5:
            num = 5
            #print(num)
        if event.type == KEYDOWN and event.key == K_6:
            num = 6
            #print(num)
        if event.type == KEYDOWN and event.key == K_7:
            num = 7
            #print(num)
        if event.type == KEYDOWN and event.key == K_8:
            num = 8
            #print(num)
        if event.type == KEYDOWN and event.key == K_9:
            num = 9
            #print(num)

        if event.type == KEYDOWN and event.key == K_RETURN:
            if num > 5:
                jiantong += 1
            if num > 7 and num/2==4.0:     #修改为if
                jiantong += 1

            #if 得到两个箭筒
            #
    if jiantong == 2:
        out = True
    else:
        jiantong = 0

    if not num == 0:
        font = pygame.font.Font(None, 60)
        img = font.render(str(num),1,(0,0,0))
        screen.blit(img, (505, 360))
    if keys[K_ESCAPE]:
        pygame.quit()
    if out:
        break
    
    mainClock.tick(60)
    pygame.display.update()

scrny = 0
for i in range(230):
    scrny -= 2
    screen.blit(bg0, (-870, 0))

    screen.blit(tang2, (-870, 0))
    screen.blit(bei, (480, 490))
    screen.blit(scrn1, (-880, scrny))
    screen.blit(bg0s, (-870,0))
    #print(bei.get_rect())

    keys = pygame.key.get_pressed()
    for event in pygame.event.get():
        if event.type == QUIT:
            pygame.quit()
    if keys[K_ESCAPE]:
        pygame.quit()
    
    mainClock.tick(50)     
    pygame.display.update()

dorlachy = -300
for i in range(230):
    if dorlachy < 0:
        dorlachy += 2
    screen.blit(bg0, (-870, 0))

    screen.blit(tang2, (-870, 0))

    screen.blit(dorlach, (-870, dorlachy))
    screen.blit(guang, (-1020, 0))
    screen.blit(bei, (480, 490))
    screen.blit(bg0s, (-870,0))
    #print(bei.get_rect())

    keys = pygame.key.get_pressed()
    for event in pygame.event.get():
        if event.type == QUIT:
            pygame.quit()
    if keys[K_ESCAPE]:
        pygame.quit()
    
    mainClock.tick(50)     
    pygame.display.update()


go = []
for i in range(4):
    aa = pygame.image.load('lesson8/img/' + str(4 - i) * 2 + '.png').convert_alpha()
    go.append(aa)
#print(go)
gox = 0
for i in range(100):
    gox += 5
    screen.blit(bg0, (-870, 0))

    screen.blit(tang2, (-870, 0))
    screen.blit(guang, (-1020, 0))
    screen.blit(go[i//3%4], (480 + gox,490))
    screen.blit(bg0s, (-870,0))

    keys = pygame.key.get_pressed()
    for event in pygame.event.get():
        if event.type == QUIT:
            pygame.quit()
    if keys[K_ESCAPE]:
        pygame.quit()
    
    mainClock.tick(50)    
    pygame.display.update()

shuxing = 0

long = Long(800, 200, group)
long.add(group)

roc1 = Rock(350, 220, 280, 20)
roc2 = Rock(0, 300, 280, 20)
roc3 = Rock(350, 380, 280, 20)
roc4 = Rock(0, 140, 280, 20)
rocg = Rock(0, 500, 700, 20)

#group.add(rocg,roc2,roc3,roc4)
rocGroup.add(rocg)
rocGroup.add(roc1)
rocGroup.add(roc2)
rocGroup.add(roc3)
rocGroup.add(roc4)

arrowGroup = []

global fireGroup
fireGroup = []
weapen = True
moveLeft = True
moveRight = True
hero.rect.left = 10
hero.rect.top = 400

aa = hero.rect.left
bb = hero.rect.left

while True: 
    screen.blit(bg1, (0,0)) 
    ticks = pygame.time.get_ticks()

    #if pygame.sprite.spritecollideany(hero, rocGroup):
    #    print('peng')
    #    cosprite = pygame.sprite.spritecollideany(hero, rocGroup)
    #    if hero.rect.bottom <= cosprite.rect.top and hero.rect.left < cosprite.rect.right and hero.rect.right > cosprite.rect.left:
    if pygame.sprite.spritecollideany(hero, rocGroup):
        collideRock = pygame.sprite.spritecollideany(hero, rocGroup)
        #print(collideRock)
    else:
        collideRock = None
        collide_type = ''
     
    collide_type = collideType(hero, collideRock)

    if collide_type == 'down':
        player_jumping = False
        jump_vel = 0
        hero.rect.bottom = collideRock.rect.top + 2 
        gravity = 0
        hero.air = False
    else:
        gravity = 5
        hero.air = True

    keys = pygame.key.get_pressed()
    for event in pygame.event.get():
        if event.type == QUIT:
            pygame.quit()

        if event.type == KEYDOWN and event.key == K_UP and hero.hp > 0:
            #hero.direction = UP
            player_jumping = True
            jump_vel = -20

        if event.type == KEYDOWN and event.key == K_c:
            if shuxing == 0:
                shuxing = 1
            else:
                shuxing = 0

        if event.type == KEYDOWN and event.key == K_SPACE and hero.hp > 0:
            if weapen == True:
                arrow = Arrow(hero.rect.left+20,hero.rect.top+45,shuxing)
                arrow.add(group)
                arrowGroup.append(arrow)
                hero.shoot = True

    
    hero.rect.top += gravity

    if collide_type == 'left':
        moveLeft = False
    else:
        moveLeft = True
    if collide_type == 'right':
        moveRight = False
    else:
        moveRight = True

    if collide_type == 'up':
        hero.rect.top = collideRock.rect.bottom +10

    if keys[K_LEFT] and moveLeft and hero.hp > 0:
        if hero.rect.left > 0:
            hero.rect.left -= 5
        hero.direction = LEFT
        hero.moving = True
    else:
        hero.moving = False
        #hero.direction = STOP
    if keys[K_RIGHT] and moveRight and hero.hp > 0:
        hero.direction = RIGHT
        hero.rect.right += 5
        hero.moving = True
    elif not keys[K_LEFT]:
        hero.moving = False


    if keys[K_ESCAPE]:
        pygame.quit()

    if player_jumping:
        hero.rect.top += jump_vel
        jump_vel += 1
        if jump_vel >= 0:
            jump_vel = 0
    if len(arrowGroup) != 0:
        #print(arrowGroup)
        for ar in arrowGroup:
            if pygame.sprite.collide_mask(ar, long):
                ar.kill()
                arrowGroup.remove(ar)
                if ar.property == long.property:
                    long.hp -= 10

    if len(long.fireGroup) != 0:
        #print('hahahaha')
        for ff in long.fireGroup:
            if pygame.sprite.collide_mask(hero, ff):
                ff.kill()
                long.fireGroup.remove(ff)
                hero.hp -= 40
    #print('龙的血量：' + str(long.hp)  + '小明的血量:' + str(hero.hp))

    screen.blit(step, (340, 210))
    screen.blit(step, (-10, 290))
    screen.blit(step, (-10, 130))
    screen.blit(step2, (340, 370))
    group.update(ticks)
    group.draw(screen)

    if hero.rect.top > 630:
        hero.hp = 0
    screen.blit(rentou, (0,20))
    screen.blit(longtou, (550,20))
    
    if hero.hp > 0:
        pygame.draw.line(screen, (255,0,0), (50, 50), (50 + 3*hero.hp, 50), 20)
    if long.hp > 0:
        pygame.draw.line(screen, (255, 0, 0), (600, 50), (600 + 3 * long.hp, 50), 20)
    if hero.hp <= 0:
        font2 = pygame.font.Font(None, 160)
        img2 = font2.render('YOU  LOSE!', 1, (255, 0, 0))
        screen.blit(img2, (230, 270))
    if long.hp <= 0:
        font3 = pygame.font.Font(None, 160)
        img3 = font3.render('YOU  WIN!', 1, (255, 0, 0))
        screen.blit(img3, (250, 270))
        long.kill()
    
    '''
    for sprite in rocGroup.sprites(): 
        pygame.draw.rect(screen,(255,0,0),sprite.rect,1)
    '''

    mainClock.tick(60)
    pygame.display.update()
