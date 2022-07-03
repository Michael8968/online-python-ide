
import pygame
#
# #敌方子弹
# class Small_n1s(pygame.sprite.Sprite):
#     def __init__(self,position,size):
#         pygame.sprite.Sprite.__init__(self)
#
#         #设置子弹对象
#         self.image = pygame.image.load('image/aircraft_image/enemy_bullet1.png.png').convert_alpha()
#         self.rect = self.image.get_rect()
#         self.rect.left,self.rect.top = position[0]-7,position[1]
#         self.speed = 15
#         self.action = True
#         self.width,self.height = size[0],size[1]
#
#         self.mask = pygame.mask.from_surface(self.image)
#
#
#     def move(self):
#
#
#             if self.rect.top > self.height :
#                 self.action = False
#             else:
#                 self.rect.top += self.speed
#
#     def reset(self,position):
#             self.rect.left,self.rect.top = position
#             self.action = True
#
#
#


# class HeroBullet(pygame.sprite.Sprite):
#     def __init__(self,postion):
#         pygame.sprite.Sprite.__init__(self)
#         self.image = pygame.image.load('image/bullet/hero_bullet1.png').convert_alpha()
#
#         self.rect = self.image.get_rect()
#
#         self.rect.left, self.rect.top = postion[0] -14 ,postion[1] -60
#
#         self.speed = random.randint(28,35)
#
#         self.action = False
#
#
#     def shoot(self):
#
#         self.rect.top -= self.speed
#
#
#     def reset(self,postion):
#
#         self.rect.left ,self.rect.top =  postion[0] -14 ,postion[1] -60




class EnemyBullet1(pygame.sprite.Sprite):

    def __init__(self,postion):
        pygame.sprite.Sprite.__init__(self)
        self.image = pygame.transform.smoothscale(pygame.image.load('image/bullet/enemy_bullet1.png').convert_alpha(),(30,30))
        self.rect = self.image.get_rect()

        self.rect.left,self.rect.top = postion
        self.speed = [1,2]
    def move(self):
        self.rect.left += self.speed[1]
        self.rect.top += self.speed[1]

class EnemyBullet2(pygame.sprite.Sprite):

    def __init__(self,postion):
        pygame.sprite.Sprite.__init__(self)
        self.image = pygame.transform.smoothscale(pygame.image.load('image/bullet/enemy_bullet2.png').convert_alpha(),(30,30))
        self.rect = self.image.get_rect()

        self.rect.left,self.rect.top = postion
        self.speed = [1,2]
    def move(self):
        self.rect.left += self.speed[1]
        self.rect.top += self.speed[1]


class EnemyBullet3(pygame.sprite.Sprite):

    def __init__(self,postion):
        pygame.sprite.Sprite.__init__(self)
        self.image = pygame.transform.smoothscale(pygame.image.load('image/bullet/enemy_bullet2.png').convert_alpha(),(16,96))
        self.rect = self.image.get_rect()

        self.rect.left,self.rect.top = postion
        self.speed = 2
    def move(self):

        self.rect.top += self.speed



class EnemyBullet4(pygame.sprite.Sprite):

    def __init__(self,postion):
        pygame.sprite.Sprite.__init__(self)
        self.image = pygame.transform.smoothscale(pygame.image.load('image/bullet/boss_bullet4.png').convert_alpha(),(16,96))
        self.rect = self.image.get_rect()

        self.rect.left,self.rect.top = postion
        self.speed = 2
    def move(self):

        self.rect.top += self.speed

#蓝色子弹
class Mybullet(pygame.sprite.Sprite):
    def __init__(self,position):
        pygame.sprite.Sprite.__init__(self)

        #设置子弹对象
        self.image = pygame.image.load('image/aircraft_image/mybuttle.png').convert_alpha()

        self.rect = self.image.get_rect()
        self.rect.left,self.rect.top = position[0]-7,position[1]-40
        self.speed = 15
        self.action = True

        # self.mask = pygame.mask.from_surface(self.image)


    def move(self):
        self.rect.top -= self.speed
        if self.rect.top < 0:
                self.action = False

    def reset(self,position):
            self.rect.left,self.rect.top = position[0]-9,position[1]-70
            self.action = True
#红色子弹
class Mybullet1(pygame.sprite.Sprite):
    def __init__(self,position):
        pygame.sprite.Sprite.__init__(self)

        #设置子弹对象
        self.image = pygame.image.load('image/aircraft_image/mybollet1.png').convert_alpha()
        self.rect = self.image.get_rect()
        self.rect.left,self.rect.top = position[0]-7,position[1]-40
        self.speed = 15
        self.action = True

        # self.mask = pygame.mask.from_surface(self.image)


    def move(self):
        self.rect.top -= self.speed
        if self.rect.top < 0:
                self.action = False

    def reset(self,position):
            self.rect.left,self.rect.top = position[0]-7,position[1]-40
            self.action = True
# 蓝色子弹
class Mybullet2(pygame.sprite.Sprite):
    def __init__(self,position):
        pygame.sprite.Sprite.__init__(self)

        #设置子弹对象
        self.image = pygame.image.load('image/aircraft_image/mybollet1.png').convert_alpha()

        self.rect = self.image.get_rect()
        self.rect.left,self.rect.top = position[0]-7,position[1]-40
        self.speed = 15
        self.action = True

        # self.mask = pygame.mask.from_surface(self.image)


    def move(self):
        self.rect.top -= self.speed
        if self.rect.top < 0:
                self.action = False

    def reset(self,position):
            self.rect.left,self.rect.top = position[0]-13,position[1]-70
            self.action = True
