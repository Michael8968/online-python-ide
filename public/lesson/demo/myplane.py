
import pygame

class Myplane(pygame.sprite.Sprite):
    output = 500
    def __init__(self,bg_size):
        pygame.sprite.Sprite.__init__(self)

        #设置主机飞机对象
        self.image = pygame.image.load('image/airplane/main_1.png').convert_alpha()
        self.image1 = pygame.image.load('image/airplane/main_2.png').convert_alpha()
        self.image2 = pygame.image.load('image/airplane/main_3.png').convert_alpha()





        self.rect = self.image.get_rect()
        self.width,self.height = bg_size[0],bg_size[1]
        self.rect.left,self.rect.top = (self.width-self.rect.width)/2,(self.height-self.rect.height-60)
        self.speed = 10

        self.action = True

        # self.mask = pygame.mask.from_surface(self.image)
        self.output = Myplane.output


    def moveUP(self):
        if self.rect.top > 0:
            self.rect.top -= self.speed
        else:
            self.rect.top = 0

    def moveDown(self):
        if self.rect.bottom < self.height-60:
            self.rect.bottom += self.speed
        else:
            self.rect.bottom = self.height-60

    def moveLeft(self):
        if self.rect.left > 0:
            self.rect.left -= self.speed
        else:
            self.rect.left = 0
    def moveRight(self):
        if self.rect.right < self.width:
            self.rect.right += self.speed

        else:
             self.rect.right = self.width
    # def reset(self):
    #     self.action = True
    #     self.output = 500
        #self.rect.left,self.rect.top = (self.width-self.rect.width)/2,(self.height-self.rect.height-60)
