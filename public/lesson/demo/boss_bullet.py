import pygame
from random import randint

class BossBullet1(pygame.sprite.Sprite):

    def __init__(self,pos):

        pygame.sprite.Sprite.__init__(self)

        self.image = pygame.image.load('image/bullet/boss_bullet1.png')

        self.rect = self.image.get_rect()

        #self.rect.left,self.rect.top = pos
        self.num = 1
        self.flag= randint(1,4)
        #self.pos = pos
        self.rect.center = pos
        self.rect.centerx,self.rect.centery =self.rect.center
        self.num = randint(2,7)
        self.num2 = randint(2,7)

        #self.vector = pygame.math.Vector2(randint(2,5),randint(2,5))


    def update(self):


        if self.flag == 1 :
            self.rect.centery -= self.num
            self.rect.centerx +=self.num2


        if self.flag == 2 :
            self.rect.centery -= self.num
            self.rect.centerx -=self.num2

        if self.flag == 3 :
            self.rect.centery += self.num
            self.rect.centerx +=self.num2

        if self.flag == 4 :
            self.rect.centery += self.num
            self.rect.centerx -=self.num2
        if self.rect.left <0 or self.rect.right > 800 or self.rect.top <0 or self.rect.bottom > 700:
            self.kill()


    def reset(self,pos):
        self.rect.center = pos
        self.rect.centerx, self.rect.centery = self.rect.center
        self.num = randint(2, 7)
        self.num2 = randint(2, 7)

        # if self.rect.centery <= 50:
        #     self.flag= False
        #     self.flag2 = True
        # if self.flag2:
        #     self.rect.centery +=         self.num2
        #
        #     self.rect.centerx -= 3
        #
        #
        #     print(self.rect.centery)
        # self.rect.left += 1
        # self.rect.top  +=  1
        # self.num += 1



class BossBullet2(pygame.sprite.Sprite):
    def __init__(self,postion):
        pygame.sprite.Sprite.__init__(self)
        self.image = pygame.transform.smoothscale(pygame.image.load('image/bullet/boss_bullet2.png').convert_alpha(),(16,96))
        self.rect = self.image.get_rect()

        self.rect.left,self.rect.top = postion
        self.speed = 5
    def move(self):

        self.rect.top += self.speed