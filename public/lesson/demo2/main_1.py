import pygame
import sys
import random
import datetime

from pygame.locals import *

import heroPlane
import ui
import enemyPlane
pygame.init()
SCREEN_SIZE = WIDTH,HEIGHT = (650,800)# 屏幕大小

screen = pygame.display.set_mode(SCREEN_SIZE)# 创建游戏名字


start_time= datetime.datetime.now()

# def end_screen(flag):
#     if flag :
#         end_pic = pygame.image.load('image/ui/GameOver.png')
#     else:
#         end_pic = pygame.image.load('image/ui/Win.png')
#
#     while True:
#
#         screen.blit(end_pic,(200,200))
#
#         for event in pygame.event.get():
#             if event.type == QUIT:
#                 pygame.quit()
#                 sys.exit()
#         pygame.display.update()
# 游戏主函数
def main(life,number,score,time):

    hero_Hp = life# 英雄血量
    score = score # 分数
    time = time# 倒计时
    numbers = number# 子弹个数
    #我方血条
    hero_hp = pygame.image.load('image/ui/hero_hp.png')
    #统计星星图标与数字
    prop_num = pygame.font.Font('image/font/Interstate Mono - Blk.ttf', 25)

    #prop_lcon = pygame.image.load('image/aircraft_image/prop_lcon.png')

    # 敌方所有精灵
    enemy_group = pygame.sprite.Group()

    # 爆炸精灵
    small_blast_images = []
    small_blast_images.extend([
        pygame.image.load('image/ui/small_bomb0.png').convert_alpha(),
        pygame.image.load('image/ui/small_bomb1.png').convert_alpha(),
        pygame.image.load('image/ui/small_bomb2.png').convert_alpha(),

        pygame.image.load('image/ui/small_bomb3.png').convert_alpha(),
        pygame.image.load('image/ui/small_bomb4.png').convert_alpha(),
    ])

    # 英雄飞机精灵
    hero_plane =  heroPlane.HeroPlane(SCREEN_SIZE)

    # 英雄子弹精灵组
    hero_bullet_groud = pygame.sprite.Group()


    # 小型敌机n1精灵组
    enemy_plane_small_n1_groud = pygame.sprite.Group()
    enemy_bullet_small_n1_list = []

    # 小型敌机n2精灵组
    enemy_plane_small_n2_groud = pygame.sprite.Group()
    enemy_bullet_small_n2_list = []
    # 中型敌机精灵组
    enemy_plane_mid = enemyPlane.EnemyPlaneMid((random.randint(100,500),-100))
    enemy_bullet_mid_group = pygame.sprite.Group()
    # 大型敌机精灵组
    enemy_plane_big = enemyPlane.EnemyPlaneBig((random.randint(100,200),-100))
    enemy_bullet_big_group = pygame.sprite.Group()

    # 背景精灵组
    #bg_goup = pygame.sprite.Group()
    bg_goup = []
    bg_pic = ui.BackGround((0,HEIGHT),SCREEN_SIZE)
    bg_goup.append(bg_pic)
    #bg_goup.add(bg_pic)
    #print(bg_goup)

    shoot_flag =False
    num = 0
    shoot_flag_lvs1 = False

    GamePlaying = True # 游戏是否字进行中

    con = pygame.time.Clock()

    distance = -100# 距离
    enemy_small_plane_n1 =  False# 小型敌方飞机n1开关
    enemy_small_plane_n2 =  False# 小型敌方飞机n2开关
    enemy_small_plane_n3 =  False# 小型敌方飞机n3开关
    enemy_mid_plane_n1 =  False# 中型敌方飞机n1开关
    enemy_big_plane_n1 =  False# 大型敌方飞机开关


    flag_hp = True# 英雄血槽

    mid_flag = False
    big_flag = False

    myplane_prop = 0 # 统计分数

    prop_xx = []

    time_font = pygame.font.Font('font/Legothick.ttf',100)

    while GamePlaying :
        con.tick(60)


        # 绘制背景
        for each in bg_goup:
            each.update()
            if each.rect.top > HEIGHT:
                #print(each)
                bg_goup.remove(each)
                each.action = False
            screen.blit(each.image,each.rect)
        distance += 1
        if each.action:
            pos = each.rect.left,each.rect.top
            bg_goup.append(ui.BackGround(pos,SCREEN_SIZE))



        # 绘制小型敌机n1
        if distance % 500 == 0 :
            enemy_small_plane_n1 = True
        if enemy_small_plane_n1 :
            bullet_n1_index = 0
            for each in enemy_plane_small_n1_groud.sprites():
                screen.blit(each.image,each.rect)
                each.update()
                c = pygame.sprite.spritecollide(each, hero_bullet_groud, True)
                if c:
                    for i in range(5):
                        screen.blit(small_blast_images[i], each.rect)
                        enemy_plane_small_n1_groud.remove(each)
                if each.rect.left >= WIDTH:
                    enemy_plane_small_n1_groud.remove(each)


                if each.rect.left > WIDTH/3:
                    #print(enemy_bullet_small_n1_list)

                    enemy_bullet_small_n1 = enemyPlane.EnemyBulletSmalln1(each.rect.midtop, SCREEN_SIZE)
                    enemy_bullet_small_n1_list.append(enemy_bullet_small_n1)

                    screen.blit(enemy_bullet_small_n1_list[bullet_n1_index].image,enemy_bullet_small_n1_list[bullet_n1_index].rect)
                    enemy_bullet_small_n1_list[bullet_n1_index].update()
                    bullet_n1_index += 1
                    #(enemy_bullet_small_n1_list)
        if not enemy_plane_small_n1_groud:
            enemy_small_plane_n1 = False
            enemy_bullet_small_n1_list.clear()
            #print(en)
            for i in range(10):
                enemy_plane_small_n1 = enemyPlane.EnemyPlaneSmalln1((-50 * i, -50 * i), SCREEN_SIZE)
                enemy_plane_small_n1_groud.add(enemy_plane_small_n1)
                enemy_group.add(enemy_plane_small_n1)

        # 小型敌机n2 绘制
        if distance % 100 == 0 :
            enemy_small_plane_n2 = True
        if enemy_small_plane_n2 :
            bullet_n2_index = 0


            #print(enemy_plane_small_n2_groud)
            for each in enemy_plane_small_n2_groud.sprites():
                screen.blit(each.image,each.rect)
                each.update()
                c = pygame.sprite.spritecollide(each, hero_bullet_groud, True)
                if c:
                    for i in range(5):
                        screen.blit(small_blast_images[i], each.rect)
                        enemy_plane_small_n2_groud.remove(each)

                    xx_num = score
                    for i in range(xx_num):
                        prop_xxs = ui.Prop_xx(each.rect.midtop)
                        each.rect.left -= 30

                        prop_xx.append(prop_xxs)

                if each.rect.left >= WIDTH/2:
                    enemy_bullet_small_n2 = enemyPlane.EnemyBulletSmalln2(each.rect.midtop, SCREEN_SIZE)
                    enemy_bullet_small_n2_list.append(enemy_bullet_small_n2)
                    screen.blit(enemy_bullet_small_n2_list[bullet_n2_index].image,
                                enemy_bullet_small_n2_list[bullet_n2_index].rect)
                    enemy_bullet_small_n2_list[bullet_n2_index].update()
                    #print('1111')
                    #bullet_n2_index += 1

        if not enemy_plane_small_n2_groud:
            enemy_small_plane_n2 = False
            enemy_bullet_small_n2_list.clear()
            for i in range(5):
                enemy_plane_small_n2 = enemyPlane.EnemyPlaneSmalln2((50 * i, 0 - 80 * i), SCREEN_SIZE)
                enemy_plane_small_n2_groud.add(enemy_plane_small_n2)
                enemy_group.add(enemy_plane_small_n2)


        #中型敌机
        if  not mid_flag:
            screen.blit(enemy_plane_mid.image,enemy_plane_mid.rect)
        enemy_group.add(enemy_plane_mid)
        enemy_plane_mid.move()
        #print(enemy_plane_3.shoot)
        if enemy_plane_mid.shoot and not mid_flag:
            for i in range(2):
                b3 = enemyPlane.EnemyBulletMid((enemy_plane_mid.rect.left + 5 + i * 20,enemy_plane_mid.rect.bottom-10))
                enemy_bullet_mid_group.add(b3)
                enemy_group.add(b3)
        for each in enemy_bullet_mid_group.sprites():
            each.move()
            screen.blit(each.image,each.rect)
            enemy_plane_mid.shoot = False

        c = pygame.sprite.spritecollide(enemy_plane_mid, hero_bullet_groud,True)
        if c:
            mid_flag = True
            for i in range(5):

                screen.blit(small_blast_images[i], enemy_plane_mid.rect)
                enemy_group.remove(enemy_plane_mid)
                enemy_bullet_mid_group.empty()
            xx_num = score
            for i in range(xx_num):
                prop_xxs = ui.Prop_xx(enemy_plane_mid.rect.midtop)
                enemy_plane_mid.rect.left -= 30

                prop_xx.append(prop_xxs)

        # 大型敌机
        if not big_flag:
            screen.blit(enemy_plane_big.image,enemy_plane_big.rect)
        enemy_group.add(enemy_plane_big)
        enemy_plane_big.move()
        c = pygame.sprite.spritecollide(enemy_plane_big, hero_bullet_groud, True)
        if c:
            big_flag = True
            for i in range(5):
                screen.blit(small_blast_images[i], enemy_plane_mid.rect )
                enemy_group.remove(enemy_plane_mid)
            xx_num = score
            for i in range(xx_num):
                prop_xxs = ui.Prop_xx(enemy_plane_big.rect.midtop)
                enemy_plane_big.rect.left -= 30

                prop_xx.append(prop_xxs)

        #print(enemy_plane_4.shoot)
        if enemy_plane_big.shoot and not big_flag:
            for i in range(2):
                b4 =enemyPlane.EnemyBulletBig((enemy_plane_big.rect.left + 10 + i * 100,enemy_plane_big.rect.bottom))
                enemy_bullet_big_group.add(b4)
                enemy_group.add(b4)
        #print(enemy_bullet_big_group)
        for each in enemy_bullet_big_group.sprites():
            each.move()
            screen.blit(each.image,each.rect)
            enemy_plane_big.shoot = False

        # 英雄飞机绘制

        keys = pygame.key.get_pressed()
        if keys[K_UP]:
            #print(123)
            hero_plane.move_up()
        if keys[K_DOWN]:
            hero_plane.move_down()
        if keys[K_RIGHT]:
            hero_plane.move_right()
        if keys[K_LEFT]:
            hero_plane.move_left()

        # 英雄子弹的绘制
        # 英雄子弹精灵组

        if shoot_flag:
            shoot_flag_lvs1 = True
            shoot_flag = False



        if shoot_flag_lvs1:
            #print(1)
            #print(hero_bullet_groud)
            for each in hero_bullet_groud.sprites():
                screen.blit(each.image,each.rect)
                each.update()
                if each.rect.top <=0:
                    hero_bullet_groud.remove(each)
                    #print(hero_bullet_groud)

        screen.blit(hero_plane.image, hero_plane.rect)

        # 检测我方飞机是否被揍：
        a = pygame.sprite.spritecollide(hero_plane,enemy_group,True)
        #print(a)


        # 检测敌方飞机是否被揍





        # 我方英雄血条

        if hero_Hp >= 10 :
            hero_Hp = 10

        if flag_hp :
            l = 56*hero_Hp+3
            flag_hp = False
        pygame.draw.rect(screen, (255, 255, 0), (34, 770, l, 12), 1)
        pygame.draw.line(screen, (0,0,255), (35, 775), (56*hero_Hp+35, 775), 10)

        screen.blit(hero_hp, (5, 765))


        if myplane_prop >= 100:
            GamePlaying = False
            flag = False


        Prop_num = prop_num.render(str(myplane_prop), True, (255,255,255))
        Prop_num_rect = Prop_num.get_rect()
        Prop_num_rect.right, Prop_num_rect.top = WIDTH - 10, 60

        screen.blit(Prop_num, Prop_num_rect)
        #screen.blit(prop_lcon, (Prop_num_rect.left - 40, 50))

        for each in prop_xx:

            each.move()
            xx_hit = pygame.sprite.collide_mask(each, hero_plane)

            if each.action:
                screen.blit(each.xx_image[each.num% 7], each.rect)
                each.num += 1
                # if not (delay % 5):
                #     each.num = (each.num + 1) % 8
                if each.num == 0:
                    screen.blit(each.image, each.rect)

            if xx_hit and each.action:
                #prop_sound.play()
                each.action = False
                myplane_prop += 1



        # 倒计时
        now_time = datetime.datetime.now()
        game_time1 = time-(now_time-start_time).seconds
        game_time = str(game_time1)
        #print((start_time-now_time))
        time_pic = time_font.render(game_time,True,(255,255,0))
        screen.blit(time_pic,(50,50))

        if a:
            if hero_Hp > 0:
                hero_Hp -= 1
        if hero_Hp <= 0:
            GamePlaying = False
            GamePlaying
            flag = True

        if game_time1 <= 0:
            GamePlaying = False
            flag = True



        #print(a)
        for event in pygame.event.get():
            if event.type == QUIT:
                pygame.quit()
                sys.exit()
            if event.type == KEYDOWN:
                if event.key == K_SPACE:
                    shoot_flag = True
                    if numbers >= 5:
                        numbers = 5
                    for i in range(numbers):

                        hero_bullet_groud.add(
                            heroPlane.HeroBullet((hero_plane.rect.midtop[0] - 40-i*15, hero_plane.rect.midtop[1])))
                        hero_bullet_groud.add(
                            heroPlane.HeroBullet((hero_plane.rect.midtop[0] + 5+i*15, hero_plane.rect.midtop[1])))

        pygame.display.update()



    while True:
        screen.fill((255,255,255))
        if flag:
            end_pic = pygame.image.load('image/ui/GameOver.png')
            screen.blit(end_pic, (50, 350))
        else:
            end_pic = pygame.image.load('image/ui/Win.png')
            screen.blit(end_pic, (100, 350))



        for event in pygame.event.get():
            if event.type == QUIT:
                pygame.quit()
                sys.exit()
        pygame.display.update()
