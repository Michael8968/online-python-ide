import pygame
import random

class EnemyPlaneSmalln1(pygame.sprite.Sprite):
    def __init__(self,postion,screen_size):
        pygame.sprite.Sprite.__init__(self)
        self.image = pygame.transform.smoothscale(pygame.image.load('image/airplane/small_n1.png'),(40,50))

        self.rect = self.image.get_rect()

        self.rect.left ,self.rect.top = postion

        self.width,self.height = screen_size
        self.speed = 3



    def update(self):


        if self.rect.left <= self.width/3:
            self.rect.left += self.speed
            self.rect.top += self.speed
        elif self.rect.left <= self.width/2:
            self.rect.left += self.speed
            self.rect.top -= self.speed
        else:
            self.rect.left += self.speed
            self.rect.top += self.speed

class EnemyBulletSmalln1(pygame.sprite.Sprite):

    def __init__(self,postion,screen_size):
        pygame.sprite.Sprite.__init__(self)
        self.image= pygame.transform.smoothscale(pygame.image.load('image/bullet/enemy_bullet1.png'),(30,30))

        self.rect = self.image.get_rect()

        self.width ,self.height = screen_size

        self.rect.left,self.rect.top = postion

        self.speed = random.randint(-5,5),random.randint(3,10)

    def update(self):
        self.rect.left += self.speed[0]
        self.rect.top += self.speed[1]

class EnemyPlaneSmalln2(pygame.sprite.Sprite):
    def __init__(self,postion,screen_size):
        pygame.sprite.Sprite.__init__(self)
        self.image = pygame.transform.smoothscale(pygame.image.load('image/airplane/small_n2.png'),(40,50))

        self.rect = self.image.get_rect()

        self.rect.left ,self.rect.top = postion

        self.width,self.height = screen_size
        self.speed = [2,2]

        self.action = False



    def update(self):
        self.rect.top += self.speed[1]

        self.rect.left+= self.speed[0]
        if self.rect.right <0 or self.rect.left> self.width:
            self.speed[0] = - self.speed[0]
            self.action = True


class EnemyBulletSmalln2(pygame.sprite.Sprite):

    def __init__(self,postion,screen_size):
        pygame.sprite.Sprite.__init__(self)
        self.image= pygame.transform.smoothscale(pygame.image.load('image/bullet/enemy_bullet2.png'),(30,30))

        self.rect = self.image.get_rect()

        self.width ,self.height = screen_size

        self.rect.left,self.rect.top = postion

        self.speed = 10,3#random.randint(-5,5),random.randint(3,10)

    def update(self):
        self.rect.left -= self.speed[0]
        self.rect.top += self.speed[1]





class EnemyPlaneMid(pygame.sprite.Sprite):


    def  __init__(self,postion):
        pygame.sprite.Sprite.__init__(self)

        self.image = pygame.transform.smoothscale(pygame.image.load('image/airplane/mid_n1.png').convert_alpha( ),(90,90))

        self.rect = self.image.get_rect()

        self.rect.left ,self.rect.top = postion[0],postion[1]
        self.speed = [2,2]
        self.shoot = False
        self.times = 1
        self.action = False

    def move(self):

        self.rect.top  += self.speed[0]
        if self.rect.top >= 200:
            self.times += 1
            if self.times % 50 ==0 :
                self.shoot = random.choice([True, False])
            self.rect.top = 200
            self.rect.left += self.speed[1]

            if self.rect.right > 650 or self.rect.left < 100:
                self.speed[1] = - self.speed[1]
        if self.action :
            self.kill()


class EnemyBulletMid(pygame.sprite.Sprite):

    def __init__(self,postion):
        pygame.sprite.Sprite.__init__(self)
        self.image = pygame.transform.smoothscale(pygame.image.load('image/bullet/enemy_bullet2.png').convert_alpha(),(16,96))
        self.rect = self.image.get_rect()

        self.rect.left,self.rect.top = postion
        self.speed = 2
    def move(self):

        self.rect.top += self.speed


class EnemyPlaneBig(pygame.sprite.Sprite):


    def  __init__(self,postion):
        pygame.sprite.Sprite.__init__(self)

        self.image = pygame.transform.smoothscale(pygame.image.load('image/airplane/big_n1.png').convert_alpha( ),(150,134))

        self.rect = self.image.get_rect()

        self.rect.left ,self.rect.top = postion[0],postion[1]
        self.speed = [2,2]
        self.shoot = False
        self.times = 3

    def move(self):

        self.rect.top  += self.speed[0]
        if self.rect.top >= 100:
            self.times += 1
            if self.times % 50 ==0 :
                self.shoot = random.choice([True, False])
            self.rect.top = 100


class EnemyBulletBig(pygame.sprite.Sprite):

    def __init__(self,postion):
        pygame.sprite.Sprite.__init__(self)
        self.image = pygame.transform.smoothscale(pygame.image.load('image/bullet/enemy_bullet4.png').convert_alpha(),(16,96))
        self.rect = self.image.get_rect()

        self.rect.left,self.rect.top = postion
        self.speed = 2
    def move(self):


        self.rect.top += self.speed