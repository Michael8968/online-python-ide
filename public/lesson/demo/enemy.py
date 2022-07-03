
import pygame
from random import *

#小型敌机第一种
class SmallEnemy_n1(pygame.sprite.Sprite):
    energy = 10
    def __init__(self,bg_size):


        pygame.sprite.Sprite.__init__(self)


        self.image = pygame.transform.smoothscale(pygame.image.load('image/aircraft_image/small_n1.png').convert_alpha(),(60,75))

        self.action = True
        self.hit = False

        self.bullet = False
        self.speed = [2,0.1]

        self.rect = self.image.get_rect()
        self.width,self.height = bg_size[0],bg_size[1]
        self.rect.left,self.rect.top = self.width,self.height#randint(0,self.width - self.rect.width),\
                                      # randint(-10*self.height,0)
        # self.mask = pygame.mask.from_surface(self.image)

        self.energy = SmallEnemy_n1.energy



    def move(self):
        self.rect.left += self.speed[0]
        self.rect.top  += self.speed[1]
            # if self.rect.top < self.height:
            #     self.rect.top+=self.speed
            #     if self.rect.top == 150 :
            #         self.bullet = True
            #     else:
            #         self.bullet = False
            #
            #
            # else:
            #
            #     self.reset()
    def reset(self):

            self.energy = 10
            self.action = True
            self.hit = False
            self.bullet = False
            self.rect.left,self.rect.top = self.width,self.height#randint(0,self.width - self.rect.width),\
                                       #randint(-10*self.height,0)
#小型敌机第二种
class SmallEnemy_n2(pygame.sprite.Sprite):
    energy = 10

    def __init__(self,bg_size):


        pygame.sprite.Sprite.__init__(self)


        self.image = pygame.transform.smoothscale(pygame.image.load('image/aircraft_image/small_n2.png').convert_alpha(),(80,70))

        self.rect = self.image.get_rect()
        self.width,self.height = bg_size[0],bg_size[1]
        self.rect.left,self.rect.top = randint(0,self.width - self.rect.width),\
                                       randint(-10*self.height,0)
        # self.mask = pygame.mask.from_surface(self.image)
        self.action = True
        self.hit = False

        self.energy = SmallEnemy_n2.energy

        self.speed = 2

    def move(self):
            if self.rect.top < self.height:
                self.rect.top+=self.speed
            else:
                self.reset()

    def reset(self):
            self.energy = 10
            self.action = True
            self.hit = False

            self.rect.left,self.rect.top = randint(0,self.width - self.rect.width),\
                                       randint(-10*self.height,0)

#小型敌机第三种
class SmallEnemy_n3(pygame.sprite.Sprite):
    energy = 10

    def __init__(self,bg_size):
        pygame.sprite.Sprite.__init__(self)


        self.image = pygame.transform.smoothscale(pygame.image.load('image/aircraft_image/small_n3.png').convert_alpha(),(80,40))

        self.rect = self.image.get_rect()
        self.width,self.height = bg_size[0],bg_size[1]
        self.rect.left,self.rect.top = randint(0,self.width - self.rect.width),\
                                       randint(-10*self.height,0)
        # self.mask = pygame.mask.from_surface(self.image)
        self.action = True
        self.hit = False

        self.speed = 2
        self.energy = SmallEnemy_n3.energy


    def move(self):
            if self.rect.top < self.height:
                self.rect.top+=self.speed
            else:
                self.reset()

    def reset(self):
            self.energy = 10
            self.action = True
            self.hit = False

            self.rect.left,self.rect.top = randint(0,self.width - self.rect.width),\
                                       randint(-10*self.height,0)




#中型敌机第一种
class MidEnemy_n1(pygame.sprite.Sprite):
    energy = 20
    def __init__(self,bg_size):
        pygame.sprite.Sprite.__init__(self)

        #设置主机飞机对象
        self.image = pygame.transform.smoothscale(pygame.image.load('image/aircraft_image/mid_n1.png').convert_alpha(),(80,70))


        self.rect = self.image.get_rect()
        self.speed = 2
        self.action = True
        self.width,self.height = bg_size[0],bg_size[1]
        self.rect.left,self.rect.top = randint(0,self.width - self.rect.width),\
                                       randint(-10*self.height,-self.height)
        # self.mask = pygame.mask.from_surface(self.image)
        self.energy = MidEnemy_n1.energy
        self.hit = False
        self.energy = MidEnemy_n1.energy



    def move(self):
            if self.rect.top < self.height:
                self.rect.top+=self.speed
            else:
                self.reset()

    def reset(self):
            self.action = True
            self.hit = False
            self.energy =20
            self.rect.left,self.rect.top = randint(0,self.width - self.rect.width),\
                                       randint(-10*self.height,-self.height)




#大型敌机
class BigEnemy(pygame.sprite.Sprite):
    energy = 30
    #敌机血量
    def __init__(self,bg_size):
        pygame.sprite.Sprite.__init__(self)

        #设置主机飞机对象
        self.image = pygame.image.load('image/aircraft_image/big_n1.png').convert_alpha()


        self.rect = self.image.get_rect()
        self.speed = 2
        self.action = True
        self.width,self.height = bg_size[0],bg_size[1]
        self.rect.left,self.rect.top = randint(0,self.width - self.rect.width),\
                                       randint(-15*self.height,-self.height)

        self.num = 0
        # self.mask = pygame.mask.from_surface(self.image)
        self.energy = BigEnemy.energy
        self.hit = False
    def move(self):
            if self.rect.top < self.height:
                self.rect.top+=self.speed
            else:
                self.reset()
    def reset(self):
            self.action = True
            self.hit = False
            self.energy =30
            self.rect.left,self.rect.top = randint(0,self.width - self.rect.width),\
                                       randint(-15*self.height,-self.height)
