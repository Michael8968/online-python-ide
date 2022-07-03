# main.py
import pygame
import sys

# import traceback
import myplane
import bullet
import enemy
import supply
from pygame.locals import *
from random import *
import background
import prop
import time

pygame.init()
pygame.mixer.init()

bg_size = width, height = 650, 700
screen = pygame.display.set_mode(bg_size)

BLUCK = (0,0,0)

#白色

bg = (255,255,255)

#红色
RED = (255,0,0)

#橙色
ORANGE = (255,165,0)

GREENS = (0,202,0)
#绿色
GREEN = (0,255,0)

#主旋律的集合
music = []
music_num = 0

#爆炸样式
blast_images = []
blast_images.extend([
            pygame.transform.smoothscale(pygame.image.load(r'image/aircraft_image/baozai_1.png').convert_alpha(),(50,50)),
            pygame.transform.smoothscale(pygame.image.load(r'image/aircraft_image/baozai_2.png').convert_alpha(),(50,50)),
            pygame.transform.smoothscale(pygame.image.load(r'image/aircraft_image/baozai_3.png').convert_alpha(),(50,50)),
            ])
blast_image = []
blast_image.extend([
            pygame.transform.smoothscale(pygame.image.load(r'image/aircraft_image/baozai_2.png').convert_alpha(),(50,50)),
            pygame.transform.smoothscale(pygame.image.load(r'image/aircraft_image/baozai_3.png').convert_alpha(),(50,50))
            ])


#我方飞机尾部喷气
plane_images = []
plane_images.extend([
            pygame.image.load(r'image/aircraft_image/myplane_3.png').convert_alpha(),
            pygame.image.load(r'image/aircraft_image/myplane_1.png').convert_alpha(),

            pygame.image.load(r'image/aircraft_image/myplane_3.png').convert_alpha(),
            pygame.image.load(r'image/aircraft_image/myplane_1.png').convert_alpha(),

            pygame.image.load(r'image/aircraft_image/myplane_3.png').convert_alpha(),
            ])





# 载入游戏音乐
pygame.mixer.music.load("sound/game_music.ogg")
pygame.mixer.music.set_volume(0.1)

changa1 = pygame.mixer.Sound("sound/bgm_zhandou1.wav")
changa1.set_volume(0.5)
music.append(changa1)
changa2 = pygame.mixer.Sound("sound/bgm_zhandou2.wav")
changa2.set_volume(0.5)
music.append(changa2)
changa3 = pygame.mixer.Sound("sound/bgm_zhandou3.wav")
changa3.set_volume(0.5)
music.append(changa3)
bullet_sound = pygame.mixer.Sound("sound/bullet.wav")
bullet_sound.set_volume(0.2)
bomb_sound = pygame.mixer.Sound("sound/use_bomb.wav")
bomb_sound.set_volume(0.2)
supply_sound = pygame.mixer.Sound("sound/supply.wav")
supply_sound.set_volume(0.2)
get_bomb_sound = pygame.mixer.Sound("sound/get_bomb.wav")
get_bomb_sound.set_volume(0.2)
get_bullet_sound = pygame.mixer.Sound("sound/get_bullet.wav")
get_bullet_sound.set_volume(0.2)
upgrade_sound = pygame.mixer.Sound("sound/upgrade.wav")
upgrade_sound.set_volume(0.2)
enemy3_fly_sound = pygame.mixer.Sound("sound/enemy3_flying.wav")
enemy3_fly_sound.set_volume(0.2)
enemy1_down_sound = pygame.mixer.Sound("sound/enemy1_down.wav")
enemy1_down_sound.set_volume(0.1)
enemy2_down_sound = pygame.mixer.Sound("sound/enemy2_down.wav")
enemy2_down_sound.set_volume(0.2)
enemy3_down_sound = pygame.mixer.Sound("sound/enemy3_down.wav")
enemy3_down_sound.set_volume(0.5)
me_down_sound = pygame.mixer.Sound("sound/me_down.wav")
me_down_sound.set_volume(0.2)
mid_enemies_n3_sound = pygame.mixer.Sound("sound/luoxuanjiang.wav")
mid_enemies_n3_sound.set_volume(1.0)
prop_sound = pygame.mixer.Sound("sound/cxx.wav")
mid_enemies_n3_sound.set_volume(0.1)


def bollet_lvs(bollet,enemies,my_frection,enemy_index,damage):
            for b in bollet:
                    if b.action:
                        b.move()
                        screen.blit(b.image,b.rect)

                        mybullet_hit = pygame.sprite.spritecollide(b,enemies,False,pygame.sprite.collide_mask)
                        if mybullet_hit:
                            bullet_sound.play()
                            my_frection+=10



                            screen.blit(blast_image[enemy_index],(b.rect.left-20,b.rect.top))
                            enemy_index= (enemy_index+1)%2
                            if enemy_index == 0:

                                b.action = False
                                for each in mybullet_hit:
                                    each.hit = True
                                    each.energy-= damage
                                    if each.energy <= 0:
                                        each.action = False


def add_small_enemies_n1(group1,group2,num):
    enemy_plane1_y  = randint(100,200)
    for i in range(num):
        e1 = enemy.SmallEnemy_n1((-600+i*80,enemy_plane1_y+i*20))
        group1.add(e1)
        group2.add(e1)


def add_small_enemies_n2(group1,group2,num):
    for i in range(num):
        e1 = enemy.SmallEnemy_n2(bg_size)
        group1.add(e1)
        group2.add(e1)
def add_small_enemies_n3(group1,group2,num):
    for i in range(num):
        e1 = enemy.SmallEnemy_n3(bg_size)
        group1.add(e1)
        group2.add(e1)



def add_mid_enemies_n1(group1,group2,num):
    for i in range(num):
        e2 = enemy.MidEnemy_n1(bg_size)
        group1.add(e2)
        group2.add(e2)


def add_big_enemies(group1,group2,num):
    for i in range(num):
        e3 = enemy.BigEnemy(bg_size)
        group1.add(e3)
        group2.add(e3)

#设置云朵透明度
def blit(target,ground,position,number):
    x = position.left
    y = position.top
    temp = pygame.Surface((ground.get_width(),ground.get_height())).convert()
    temp.blit(target,(-x,-y))
    temp.blit(ground,(0,0))
    temp.set_alpha(number)
    target.blit(temp,position)




def main(bollet_lv,score,life):

    #当前子弹等级
    # bollet_lv = 0
    # score = 10


    #背景音乐参数
    music_choice = True
    music_num = 0
    music_nums = 1





    #编辑血量HP
    HP = pygame.image.load(r'image/aircraft_image/HP.png')
    HP_num = pygame.font.Font('font/Interstate Mono - Blk.ttf',10)



    #创建背景图片对象
    position = 0,height
    buss = []
    ball= background.Back(position,bg_size)
    ground = background.Ground(bg_size)
    buss.append(ball)
    #我方吃了多少个星星
    myplane_prop = 0

    #创建我方飞机对象
    me = myplane.Myplane(bg_size)

    enemies = pygame.sprite.Group()

    #统计我方得分与行驶距离
    my_frection = 0
    my_Frection = pygame.font.Font('font/Legothick.ttf',35)
    my_distance = 0
    my_dist = 1
    my_Distance = pygame.font.Font('font/Interstate Mono - Blk.ttf',20)



    #生成小型敌机
    small_enemies_n1 = pygame.sprite.Group()
    add_small_enemies_n1(small_enemies_n1,enemies,7)

    small_enemies_n2 = pygame.sprite.Group()
    add_small_enemies_n2(small_enemies_n2,enemies,5)

    small_enemies_n3 = pygame.sprite.Group()
    add_small_enemies_n3(small_enemies_n3,enemies,5)

    # #生成中型敌机
    mid_enemies_n1 = pygame.sprite.Group()
    add_mid_enemies_n1(mid_enemies_n1, enemies, 1)


    # 生成大型敌机
    big_enemies = pygame.sprite.Group()
    add_big_enemies(big_enemies, enemies, 1)


    #生成敌方子弹
    bullets = []

    #生成我方0级蓝色子弹
    mybullet_0 = []

    mybullet_index = 0
    mybullet_num = 20
    mybullet_nums = mybullet_num
    for i in range(mybullet_num):
            mybullet_0.append(bullet.Mybullet((me.rect.midtop)))

    #生成我方红色级子弹
    mybullet_1 = []
    mybullet_index1 = 0

    for i in range(mybullet_nums):
            mybullet_1.append(bullet.Mybullet1((me.rect.midtop[0]-10,me.rect.midtop[1])))
            mybullet_1.append(bullet.Mybullet1((me.rect.midtop[0]+10,me.rect.midtop[1])))
    #生成我方红色级子弹子弹
    mybullet_2 = []
    mybullet_index2 = 0

    for i in range(mybullet_nums):
            mybullet_2.append(bullet.Mybullet1((me.rect.midtop[0]-40,me.rect.midtop[1]+10)))
            mybullet_2.append(bullet.Mybullet1((me.rect.midtop[0]+40,me.rect.midtop[1]+10)))
    #生成我方红色子弹子弹
    mybullet_3 = []
    mybullet_index3 = 0

    for i in range(mybullet_nums):
            mybullet_3.append(bullet.Mybullet1((me.rect.midtop[0]-20,me.rect.midtop[1]+10)))
            mybullet_3.append(bullet.Mybullet1((me.rect.midtop[0]+20,me.rect.midtop[1]+10)))
    #生成我方蓝色子弹
    mybullet_01 = []

    mybullet_index01 = 0
    for i in range(mybullet_num):
            mybullet_01.append(bullet.Mybullet((me.rect.midtop[0]-10,me.rect.midtop[1])))
            mybullet_01.append(bullet.Mybullet((me.rect.midtop[0]+10,me.rect.midtop[1])))
    #生成我方蓝色子弹

    mybullet_02 = []

    mybullet_index02 = 0
    for i in range(mybullet_num):
            mybullet_02.append(bullet.Mybullet((me.rect.midtop[0]-10,me.rect.midtop[1])))
            mybullet_02.append(bullet.Mybullet((me.rect.midtop[0]+10,me.rect.midtop[1])))


    # #生成我方紫色色子弹子弹
    # mybullet_4 = []
    # mybullet_index4 = 0
    #
    # for i in range(mybullet_num):
    #         mybullet_4.append(bullet.Mybullet2((me.rect.midtop)))







    #中弹图片索引
    me_index = 0
    small_index_1 = 0
    small_index_2 = 0
    small_index_3 = 0
    small_index_4= 0
    mid_index_1 = 0
    mid_index_2 = 0
    mid_index_3 = 0
    big_index = 0

    #用于切换我方飞机螺旋桨图片
    switch_image = True



    #生成飞机喷气索引
    me_indexs = 0

    #敌方中弹图片索引
    enemy_index = 0

    #道具的集合
    prop_xx = []
    prop_bollet_s = []
    xx_num= 0


    #统计星星图标与数字
    prop_num = pygame.font.Font('font/Interstate Mono - Blk.ttf',25)

    prop_lcon = pygame.image.load(r'image/aircraft_image/prop_Icon.png')





    clock = pygame.time.Clock()

    running = True

    delay = 100

    print(pygame.mixer)


    while running:
        #背景音乐音效
        if music_choice and music_nums :
                music[music_num].play()
                music_nums =0
        # if  not pygame.mixer.get_busy():

        #                     music_nums=1

        #                     music_choice = True
        #                     music_num =(music_num+1)%3
        for event in pygame.event.get():
            if event.type == QUIT:
                pygame.quit()
                sys.exit()
        #按下空格释放全屏炸弹
            # elif event.type == KEYDOWN:
            #     if event.key == K_SPACE:
            #         zd_num-=1
            #         if zd_num > 0:
            #             for each in enemies:
            #                 if each.rect.bottom>0:
            #                     each.action = False


        #绘制背景
        for each in buss:
            each.move()
            if each.rect.top>height:
                buss.remove(each)
                each.action = False


            if my_dist < 500:
                screen.blit(each.image,each.rect)
            if 1000< my_dist < 6000:
                screen.blit(each.images[0],each.rect)
            if 2000< my_dist < 7000:
                screen.blit(each.images[1],each.rect)
            if 3000< my_dist < 8000:
                screen.blit(each.images[2],each.rect)
            if 4000< my_dist < 9000000000000:
                screen.blit(each.images[3],each.rect)
            # if 50< my_dist < 60:
            #     screen.blit(each.images[4],each.rect)
            # if 160< my_dist < 70:
            #     screen.blit(each.images[5],each.rect)

        if each.action:
                position = each.rect.left,each.rect.top
                speed = [0,1]
                ball = background.Back(position,bg_size)
                buss.append(ball)
        #云朵的生成
        blit(screen,ground.image_s,ground.image_rect,170)
        ground.move()

         #检测用户的键盘操作,Key_pressed是一个序列包含了键盘上所有布尔类型的值
        key_pressed = pygame.key.get_pressed()
            #设置按键选项
        if key_pressed[K_w] or key_pressed[K_UP]:
                me.moveUP()
        if key_pressed[K_s] or key_pressed[K_DOWN]:
                me.moveDown()
        if key_pressed[K_a] or key_pressed[K_LEFT]:
                me.moveLeft()
        if key_pressed[K_d] or key_pressed[K_RIGHT]:
                me.moveRight()




        #绘制大型敌机
        for each in big_enemies.sprites():
            if each.action:
                each.move()
                screen.blit(each.image,each.rect)
                if each.hit:
                        #绘制显示血槽
                        pygame.draw.line(screen,RED,(each.rect.left,each.rect.top-5),
                                                   (each.rect.left+each.rect.width,
                                                        each.rect.top-5),
                                                         5)
                        #目前血量
                        energy_remain = each.energy/enemy.BigEnemy.energy
                        energy_color = GREEN
                        pygame.draw.line(screen,energy_color,(each.rect.left,each.rect.top-5),
                                                       (each.rect.left+each.rect.width*energy_remain,
                                                        each.rect.top-5),
                                                         5)





            else:
                my_frection+=1000
                if not(delay%2):

                    screen.blit(blast_images[big_index],each.rect)
                    screen.blit(blast_images[big_index],(each.rect.left,each.rect.bottom-45))
                    screen.blit(blast_images[big_index],(each.rect.left+30,each.rect.bottom-45))
                    screen.blit(blast_images[big_index],(each.rect.left+30,each.rect.bottom-100))

                    big_index = (big_index+1)%3
                    if big_index == 0 :
                        my_frection+=1000

                        xx_num = score#randint(3,7)
                        for i in range(xx_num):

                            prop_xxs = prop.Prop_xx(each.rect.midtop)
                            each.rect.left-=30

                            prop_xx.append(prop_xxs)

                        each.reset()


        # #绘制中型敌机
        for each in mid_enemies_n1.sprites():
            if each.action:
                each.move()
                screen.blit(each.image,each.rect)
                if each.hit:
                        #绘制显示血槽
                        pygame.draw.line(screen,RED,(each.rect.left+45,each.rect.bottom+5),
                                                   (each.rect.left+each.rect.width-70,
                                                        each.rect.bottom+5),
                                                         3)
                        #目前血量
                        energy_remain = each.energy/enemy.MidEnemy_n1.energy
                        energy_color = GREEN
                        pygame.draw.line(screen,energy_color,(each.rect.left+45,each.rect.bottom+5),
                                                       (each.rect.left+45+(each.rect.width-140)*energy_remain,
                                                        each.rect.bottom+5),
                                                         3)
            else:

                if not(delay%2):

                    screen.blit(blast_images[mid_index_1],each.rect)
                    screen.blit(blast_images[mid_index_1],(each.rect.left,each.rect.bottom-45))
                    screen.blit(blast_images[mid_index_1],(each.rect.left+30,each.rect.bottom-45))
                    screen.blit(blast_images[mid_index_1],(each.rect.left+30,each.rect.bottom-100))

                    mid_index_1 = (mid_index_1+1)%3
                    if mid_index_1 == 0 :
                        my_frection+=500

                        xx_num = score#randint(2,5)
                        bollet_num = choice([True,False])
                        for i in range(xx_num):

                            prop_xxs = prop.Prop_xx(each.rect.midtop)
                            each.rect.left-=30

                            prop_xx.append(prop_xxs)
                        if bollet_num :
                            prop_bollet = prop.Prop_bollet(each.rect.midtop)
                            prop_bollet_s.append(prop_bollet)



                        each.reset()


        #绘制小型敌机
        for each in small_enemies_n1.sprites():
            if each.action:
                each.move()
                screen.blit(each.image,each.rect)
                if each.hit:
                        #绘制显示血槽
                        pygame.draw.line(screen,RED,(each.rect.left+45,each.rect.bottom),
                                                   (each.rect.left+each.rect.width-50,
                                                        each.rect.bottom),
                                                         2)
                        #目前血量
                        energy_remain = each.energy/enemy.BigEnemy.energy
                        energy_color = GREEN
                        pygame.draw.line(screen,energy_color,(each.rect.left+45,each.rect.bottom),
                                                       (each.rect.left+each.rect.width*energy_remain+50,
                                                        each.rect.bottom),
                                                         2)
                if each.bullet:
                        #小型敌机形成子弹
                        small_bullet = bullet.Small_n1s(each.rect.midbottom,bg_size)
                        bullets.append(small_bullet)




            else:
                #毁灭

                if not(delay%2):

                    screen.blit(blast_images[small_index_1],each.rect)
                    screen.blit(blast_images[small_index_1],(each.rect.left,each.rect.bottom-45))
                    screen.blit(blast_images[small_index_1],(each.rect.left+30,each.rect.bottom-45))
                    screen.blit(blast_images[small_index_1],(each.rect.left+30,each.rect.bottom-100))

                    small_index_1 = (small_index_1+1)%3


                    if small_index_1 == 0 :
                        my_frection+=150

                        xx_num = score#randint(0,20)
                        for i in range(xx_num):

                            prop_xxs = prop.Prop_xx(each.rect.midtop)
                            each.rect.left-=30

                            prop_xx.append(prop_xxs)

                        each.reset()





        #小型敌机发射子弹
        for b in bullets:
            if b.action:
                b.move()

                screen.blit(b.image,b.rect)
                #检测我方飞机是否中弹
                enemy_hit = pygame.sprite.spritecollide(me,bullets,False,pygame.sprite.collide_mask)
                if enemy_hit:
                    b.action = False
                    if me.output > 0:
                        me.output-=100

                    else:
                        me.action = False

        for each in small_enemies_n2.sprites():
            if each.action:
                each.move()
                screen.blit(each.image,each.rect)
                if each.hit:
                        #绘制显示血槽
                        pygame.draw.line(screen,RED,(each.rect.left+45,each.rect.bottom),
                                                   (each.rect.left+each.rect.width-50,
                                                        each.rect.bottom),
                                                         2)
                        #目前血量
                        energy_remain = each.energy/enemy.BigEnemy.energy
                        energy_color = GREEN
                        pygame.draw.line(screen,energy_color,(each.rect.left+45,each.rect.bottom),
                                                       (each.rect.left+each.rect.width*energy_remain+50,
                                                        each.rect.bottom),
                                                         2)
            else:
                #毁灭

                if not(delay%3):

                    screen.blit(blast_images[small_index_2],each.rect)
                    screen.blit(blast_images[small_index_2],(each.rect.left,each.rect.bottom-45))
                    screen.blit(blast_images[small_index_2],(each.rect.left+30,each.rect.bottom-45))
                    screen.blit(blast_images[small_index_2],(each.rect.left+30,each.rect.bottom-100))

                    small_index_2 = (small_index_2+1)%3

                    if small_index_2 == 0 :
                        my_frection+=150

                        xx_num = score#randint(0,3)
                        for i in range(xx_num):

                            prop_xxs = prop.Prop_xx(each.rect.midtop)
                            each.rect.left-=30

                            prop_xx.append(prop_xxs)

                        each.reset()


        for each in small_enemies_n3.sprites():
            if each.action:
                each.move()
                screen.blit(each.image,each.rect)
                if each.hit:
                        #绘制显示血槽
                        pygame.draw.line(screen,RED,(each.rect.left+45,each.rect.bottom),
                                                   (each.rect.left+each.rect.width-50,
                                                        each.rect.bottom),
                                                         2)
                        #目前血量
                        energy_remain = each.energy/enemy.BigEnemy.energy
                        energy_color = GREEN
                        pygame.draw.line(screen,energy_color,(each.rect.left+45,each.rect.bottom),
                                                       (each.rect.left+each.rect.width*energy_remain+50,
                                                        each.rect.bottom),
                                                         2)
            else:
                #毁灭
                if not(delay%4):

                    screen.blit(blast_images[small_index_3],each.rect)
                    screen.blit(blast_images[small_index_3],(each.rect.left,each.rect.bottom-45))
                    screen.blit(blast_images[small_index_3],(each.rect.left+30,each.rect.bottom-45))
                    screen.blit(blast_images[small_index_3],(each.rect.left+30,each.rect.bottom-100))

                    small_index_3 = (small_index_3+1)%3
                    if small_index_3 == 0 :
                        my_frection+=150

                        xx_num =score #randint(0,3)
                        for i in range(xx_num):

                            prop_xxs = prop.Prop_xx(each.rect.midtop)
                            each.rect.left-=30

                            prop_xx.append(prop_xxs)

                        each.reset()




        #检测我方飞机是否被撞
        enemies_down = pygame.sprite.spritecollide(me,enemies,True,pygame.sprite.collide_mask)
        print(life)
        if enemies_down :
            life -= 1

            #me.action = True
            for e in enemies_down:
                e.action = False
                e.hit = True

        #生成我方子弹

        if not(delay%6):
            if bollet_lv < 4:

                    #0级子弹
                    mybullet_0[mybullet_index].reset((me.rect.midtop))
                    mybullet_index = (mybullet_index+1)%mybullet_num
                    #1级子弹
                    if bollet_lv >= 1:
                        mybullet_1[mybullet_index1].reset((me.rect.midtop[0]-20,me.rect.midtop[1]))

                        mybullet_1[mybullet_index1+1].reset((me.rect.midtop[0]+20,me.rect.midtop[1]))
                        mybullet_index1 = (mybullet_index1+2)%mybullet_num

                    #2级级子弹
                    if bollet_lv >= 2:
                        mybullet_2[mybullet_index2].reset((me.rect.midtop[0]-40,me.rect.midtop[1]+15))
                        mybullet_2[mybullet_index2+1].reset((me.rect.midtop[0]+40,me.rect.midtop[1]+15))
                        mybullet_index2 = (mybullet_index2+2)%mybullet_num
                    #3级级子弹
                    if bollet_lv >= 3:
                        mybullet_3[mybullet_index3].reset((me.rect.midtop[0]-30,me.rect.midtop[1]+10))
                        mybullet_3[mybullet_index3+1].reset((me.rect.midtop[0]+30,me.rect.midtop[1]+10))
                        mybullet_index3 = (mybullet_index3+2)%mybullet_num
            if bollet_lv >=4 and bollet_lv < 8:
                    #4级子弹
                    if bollet_lv >=4:
                        mybullet_0[mybullet_index].reset((me.rect.midtop[0]-10,me.rect.midtop[1]))
                        mybullet_0[mybullet_index+1].reset((me.rect.midtop[0]+10,me.rect.midtop[1]))

                        mybullet_index = (mybullet_index+2)%mybullet_num

                    #5级子弹
                    if bollet_lv >=5:
                        mybullet_1[mybullet_index1].reset((me.rect.midtop[0]-25,me.rect.midtop[1]))

                        mybullet_1[mybullet_index1+1].reset((me.rect.midtop[0]+25,me.rect.midtop[1]))
                        mybullet_index1 = (mybullet_index1+2)%mybullet_num
                    #6级子弹
                    if bollet_lv >=6:
                        mybullet_2[mybullet_index2].reset((me.rect.midtop[0]-40,me.rect.midtop[1]+10))

                        mybullet_2[mybullet_index2+1].reset((me.rect.midtop[0]+40,me.rect.midtop[1]+10))
                        mybullet_index2 = (mybullet_index2+2)%mybullet_num
                    #7级子弹
                    if bollet_lv >=7:
                        mybullet_3[mybullet_index3].reset((me.rect.midtop[0]-33,me.rect.midtop[1]+5))

                        mybullet_3[mybullet_index3+1].reset((me.rect.midtop[0]+33,me.rect.midtop[1]+5))
                        mybullet_index3 = (mybullet_index3+2)%mybullet_num
            if bollet_lv >= 8 and bollet_lv <= 10 :
                    #8级子弹
                    if bollet_lv >=8:
                        mybullet_0[mybullet_index].reset((me.rect.midtop))
                        mybullet_index = (mybullet_index+1)%mybullet_num
                        mybullet_02[mybullet_index02+1].reset((me.rect.midtop[0]-30,me.rect.midtop[1]+10))
                        mybullet_02[mybullet_index02+2].reset((me.rect.midtop[0]+30,me.rect.midtop[1]+10))
                        mybullet_index02 = (mybullet_index02+3)%mybullet_num

                    #9级子弹
                    if bollet_lv >=9:
                        mybullet_1[mybullet_index1+1].reset((me.rect.midtop[0]-50,me.rect.midtop[1]+10))
                        mybullet_1[mybullet_index1+2].reset((me.rect.midtop[0]+50,me.rect.midtop[1]+10))

                        mybullet_index1 = (mybullet_index1+2)%mybullet_nums
                    #10级子弹
                    if bollet_lv >=10:
                        mybullet_2[mybullet_index2+0].reset((me.rect.midtop[0]-15,me.rect.midtop[1]+10))
                        mybullet_2[mybullet_index2+1].reset((me.rect.midtop[0]+15,me.rect.midtop[1]+10))

                        mybullet_index2 = (mybullet_index2+2)%mybullet_nums
            if bollet_lv >= 11 and bollet_lv < 14:
                    if bollet_lv ==11:
                        mybullet_02[mybullet_index02+0].reset((me.rect.midtop[0]-15,me.rect.midtop[1]))
                        mybullet_02[mybullet_index02+1].reset((me.rect.midtop[0]+15,me.rect.midtop[1]))
                        mybullet_index02 = (mybullet_index02+2)%mybullet_num

                        mybullet_01[mybullet_index01+0].reset((me.rect.midtop[0]-43,me.rect.midtop[1]+20))
                        mybullet_01[mybullet_index01+1].reset((me.rect.midtop[0]+45,me.rect.midtop[1]+20))
                        mybullet_index01 = (mybullet_index01+2)%mybullet_num


                    if bollet_lv ==12:

                        mybullet_01[mybullet_index01+0].reset((me.rect.midtop[0]-10,me.rect.midtop[1]+20))
                        mybullet_01[mybullet_index01+1].reset((me.rect.midtop[0]+10,me.rect.midtop[1]+20))
                        mybullet_index01 = (mybullet_index01+2)%mybullet_num

                        mybullet_02[mybullet_index02+0].reset((me.rect.midtop[0]-30,me.rect.midtop[1]))
                        mybullet_02[mybullet_index02+1].reset((me.rect.midtop[0]+30,me.rect.midtop[1]))
                        mybullet_index02 = (mybullet_index02+2)%mybullet_num
                        mybullet_1[mybullet_index1+1].reset((me.rect.midtop[0]-43,me.rect.midtop[1]+20))
                        mybullet_1[mybullet_index1+2].reset((me.rect.midtop[0]+45,me.rect.midtop[1]+20))
                        mybullet_index1 = (mybullet_index1+2)%mybullet_nums

                    if bollet_lv ==13:
                        mybullet_0[mybullet_index+0].reset((me.rect.midtop[0]-25,me.rect.midtop[1]))
                        mybullet_0[mybullet_index+1].reset((me.rect.midtop[0]+25,me.rect.midtop[1]))
                        mybullet_0[mybullet_index+2].reset((me.rect.midtop[0]-40,me.rect.midtop[1]))
                        mybullet_0[mybullet_index+3].reset((me.rect.midtop[0]+40,me.rect.midtop[1]))
                        mybullet_index = (mybullet_index+4)%mybullet_num

                        mybullet_1[mybullet_index1+1].reset((me.rect.midtop[0]-55,me.rect.midtop[1]+10))
                        mybullet_1[mybullet_index1+2].reset((me.rect.midtop[0]+55,me.rect.midtop[1]+10))
                        mybullet_index1 = (mybullet_index1+2)%mybullet_nums

                        mybullet_2[mybullet_index2+1].reset((me.rect.midtop[0]-10,me.rect.midtop[1]+10))
                        mybullet_2[mybullet_index2+2].reset((me.rect.midtop[0]+10,me.rect.midtop[1]+10))
                        mybullet_index2 = (mybullet_index2+2)%mybullet_nums
            if bollet_lv >= 14 and bollet_lv < 19:
                    #14级子弹
                    mybullet_4[mybullet_index4].reset((me.rect.midtop))
                    mybullet_index4 = (mybullet_index4+1)%mybullet_num
                    if 14<=bollet_lv<=15  or bollet_lv >= 17:

                        mybullet_01[mybullet_index01+0].reset((me.rect.midtop[0]-25,me.rect.midtop[1]+20))
                        mybullet_01[mybullet_index01+1].reset((me.rect.midtop[0]+25,me.rect.midtop[1]+20))
                        mybullet_index01 = (mybullet_index01+2)%mybullet_num
                    #15级子弹
                    if 15<= bollet_lv <=16 or bollet_lv == 18:
                        if bollet_lv == 15:
                            mybullet_1[mybullet_index1+0].reset((me.rect.midtop[0]-43,me.rect.midtop[1]+30))
                            mybullet_1[mybullet_index1+1].reset((me.rect.midtop[0]+45,me.rect.midtop[1]+30))

                            mybullet_index1 = (mybullet_index1+2)%mybullet_nums
                        else:
                            mybullet_1[mybullet_index1+0].reset((me.rect.midtop[0]-55,me.rect.midtop[1]+30))
                            mybullet_1[mybullet_index1+1].reset((me.rect.midtop[0]+55,me.rect.midtop[1]+30))

                            mybullet_index1 = (mybullet_index1+2)%mybullet_nums

                    #16级子弹
                    if bollet_lv >=16 and bollet_lv <=18:
                        mybullet_02[mybullet_index02+0].reset((me.rect.midtop[0]-43,me.rect.midtop[1]+20))
                        mybullet_02[mybullet_index02+1].reset((me.rect.midtop[0]+45,me.rect.midtop[1]+20))
                        mybullet_index02 = (mybullet_index02+2)%mybullet_nums
                    if  bollet_lv >=16 and bollet_lv < 17:
                        mybullet_3[mybullet_index3+0].reset((me.rect.midtop[0]-25,me.rect.midtop[1]+30))
                        mybullet_3[mybullet_index3+1].reset((me.rect.midtop[0]+27,me.rect.midtop[1]+30))

                        mybullet_index3 = (mybullet_index3+2)%mybullet_nums
            if bollet_lv >= 19:

                    mybullet_4[mybullet_index4].reset((me.rect.midtop[0]-15,me.rect.midtop[1]))
                    mybullet_4[mybullet_index4+1].reset((me.rect.midtop[0]+15,me.rect.midtop[1]))
                    mybullet_index4 = (mybullet_index4+2)%mybullet_num
                    mybullet_01[mybullet_index01+0].reset((me.rect.midtop[0]-40,me.rect.midtop[1]+40))
                    mybullet_01[mybullet_index01+1].reset((me.rect.midtop[0]+40,me.rect.midtop[1]+40))
                    mybullet_index01 = (mybullet_index01+2)%mybullet_nums
                    if bollet_lv >= 20:
                        mybullet_1[mybullet_index1].reset((me.rect.midtop[0]-55,me.rect.midtop[1]+30))
                        mybullet_1[mybullet_index1+1].reset((me.rect.midtop[0]+55,me.rect.midtop[1]+30))

                        mybullet_index1 = (mybullet_index1+2)%mybullet_nums

        if life== 0 :
            break

        if  bollet_lv < 4:
            #发射0级子弹
            bollet_lvs(mybullet_0,enemies,my_frection,enemy_index,0)

            #发射1级子弹
            if bollet_lv >= 1:
                bollet_lvs(mybullet_1,enemies,my_frection,enemy_index,1)

            #发射2级子弹
            if bollet_lv >= 2:
                bollet_lvs(mybullet_2,enemies,my_frection,enemy_index,1)
            #发射3级子弹
            if bollet_lv >= 3:
                bollet_lvs(mybullet_3,enemies,my_frection,enemy_index,1)

        elif  bollet_lv >= 4 and bollet_lv < 8:
                #发射3级子弹
                bollet_lvs(mybullet_0,enemies,my_frection,enemy_index,5)
                if bollet_lv >= 5:
                    bollet_lvs(mybullet_1,enemies,my_frection,enemy_index,1)
                if bollet_lv >= 6:
                    bollet_lvs(mybullet_2,enemies,my_frection,enemy_index,1)
                if bollet_lv >= 7:
                    bollet_lvs(mybullet_3,enemies,my_frection,enemy_index,1)
        elif bollet_lv >= 8 and bollet_lv < 11 :
            bollet_lvs(mybullet_0,enemies,my_frection,enemy_index,6)
            bollet_lvs(mybullet_02,enemies,my_frection,enemy_index,1)

            if bollet_lv >= 9:
                    bollet_lvs(mybullet_1,enemies,my_frection,enemy_index,1)

            if bollet_lv >= 10:
                    bollet_lvs(mybullet_2,enemies,my_frection,enemy_index,1)
        elif bollet_lv >= 11 :
            if bollet_lv == 11 :
                bollet_lvs(mybullet_01,enemies,my_frection,enemy_index,6)

                bollet_lvs(mybullet_02,enemies,my_frection,enemy_index,6)

            if bollet_lv == 12:
                bollet_lvs(mybullet_01,enemies,my_frection,enemy_index,6)
                bollet_lvs(mybullet_02,enemies,my_frection,enemy_index,6)

                bollet_lvs(mybullet_1,enemies,my_frection,enemy_index,2)
            if bollet_lv >= 13:
                bollet_lvs(mybullet_0,enemies,my_frection,enemy_index,6)
                bollet_lvs(mybullet_1,enemies,my_frection,enemy_index,2)
                bollet_lvs(mybullet_2,enemies,my_frection,enemy_index,2)
        if bollet_lv >= 14 and bollet_lv < 19 :

            bollet_lvs(mybullet_4,enemies,my_frection,enemy_index,14)
            if bollet_lv >= 14:
                bollet_lvs(mybullet_01,enemies,my_frection,enemy_index,8)

            if bollet_lv >= 15 :
                bollet_lvs(mybullet_2,enemies,my_frection,enemy_index,2)
            if bollet_lv >= 16 :
                bollet_lvs(mybullet_3,enemies,my_frection,enemy_index,2)
                bollet_lvs(mybullet_02,enemies,my_frection,enemy_index,8)

        if bollet_lv >=19:
            bollet_lvs(mybullet_4,enemies,my_frection,enemy_index,14)
            bollet_lvs(mybullet_01,enemies,my_frection,enemy_index,8)
            if bollet_lv>=20:
                bollet_lvs(mybullet_2,enemies,my_frection,enemy_index,4)



        delay -=1
        if not delay:
            delay = 100
        #绘制我方飞机
        if me.output>0 and me.action:

                if bollet_lv < 5:
                    screen.blit(me.image,me.rect)
                    screen.blit(plane_images[me_indexs],(me.rect.left+20,me.rect.bottom-20))

                elif 5< bollet_lv <=10 :
                    screen.blit(me.image1,me.rect)
                    screen.blit(plane_images[me_indexs],(me.rect.left+20,me.rect.bottom-20))

                else:

                    screen.blit(me.image2,me.rect)
                    screen.blit(plane_images[me_indexs],(me.rect.left+20,me.rect.bottom+10))


                me_indexs = (me_indexs+1)%5
                #绘制血条
                pygame.draw.rect(screen, (255,0,0), (24, 680, 200, 12))
                for i in range(life):

                    pygame.draw.rect(screen,GREEN,(24+i*20,680,20,12))
                    #pygame.draw.line(screen,BLUCK,(25,15),(122,15),10)

                output_remain = 100/life
                output_color = RED
                #pygame.draw.line(screen,output_color,(25,15),(25+output_remain,15),10)

                HP_NUM = HP_num.render(str(me.output),True,bg)
                screen.blit(HP,(5,675))
                #screen.blit(HP_NUM,(60,11))

        else :
            #毁灭
            if not(delay%6):
                screen.blit(blast_images[me_index],me.rect)
                screen.blit(blast_images[me_index],(me.rect.left,me.rect.bottom-45))
                screen.blit(blast_images[me_index],(me.rect.left+30,me.rect.bottom-45))
                screen.blit(blast_images[me_index],(me.rect.left+30,me.rect.bottom-100))
                me_index = (me_index+1)%3
            if me_index == 0 :
                if me.output > 0:
                    me.output -= 100
                    me.reset()
        #星星的移动与是否与我方敌机碰撞
        #星星图标
        Prop_num = prop_num.render(str(myplane_prop),True,bg)
        Prop_num_rect = Prop_num.get_rect()
        Prop_num_rect.right,Prop_num_rect.top = width-10,60


        screen.blit(Prop_num,Prop_num_rect)
        screen.blit(prop_lcon,(Prop_num_rect.left-40,50))

        for each in prop_xx:

                        each.move()
                        xx_hit = pygame.sprite.collide_mask(each,me)

                        if each.action :
                                screen.blit(each.xx_image[each.num],each.rect)

                                if not(delay%5):

                                    each.num = (each.num+1)%8
                                if each.num == 0:

                                    screen.blit(each.image,each.rect)



                        if xx_hit and each.action:
                            prop_sound.play()
                            each.action = False
                            myplane_prop+=1
        #子弹道具
        for each in prop_bollet_s:
            each.move()
            bollet1_hit = pygame.sprite.collide_mask(each,me)
            if each.action:
                screen.blit(each.image,each.rect)
                if bollet1_hit:
                    prop_sound.play()
                    each.action = False
                    bollet_lv+=1
                    print(bollet_lv)


        #绘制分数与行驶距离：
        my_frections = my_Frection.render(str(my_frection),True,ORANGE)
        my_frections_rect = my_frections.get_rect()
        my_frections_rect.right,my_frections_rect.top = width-40,10
        screen.blit(my_frections,my_frections_rect)



        if my_distance < 1000:
            my_distance+=1
            my_distances = my_Distance.render(str(my_distance)+'/n'+'m',True,ORANGE)
        else:
            my_dist+=0.01
            my_distances = my_Distance.render(str('%.2f'%my_dist)+'/n'+'Km',True,ORANGE)



        my_distances_rect = my_distances.get_rect()
        my_distances_rect.right,my_distances_rect.top = width-20,100
        screen.blit(my_distances,my_distances_rect)



        #切换图片
        if  not(delay%5):
            switch_image = not switch_image


        my_frection+=1



        pygame.display.flip()
        clock.tick(60)

if __name__ == "__main__":


    nums = 10
    life = 20



    fenshu = 1
    time = 30











    main(bollet_lv=nums,score= fenshu,life =life )
