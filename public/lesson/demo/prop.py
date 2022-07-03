import pygame
from random import *

class Prop_xx(pygame.sprite.Sprite):

    def __init__(self,position):
            pygame.sprite.Sprite.__init__(self)

            self.image = pygame.image.load('image/aircraft_image/xx.png').convert_alpha()
            self.image_bollet = pygame.image.load('image/aircraft_image/prop_Icon.png').convert_alpha()

            self.xx_image = []
            self.xx_image.extend([\
                pygame.image.load('image/aircraft_image/xx.png').convert_alpha(),\
                pygame.image.load('image/aircraft_image/xx_1.png').convert_alpha(),\
                pygame.image.load('image/aircraft_image/xx_2.png').convert_alpha(),\
                pygame.image.load('image/aircraft_image/xx_3.png').convert_alpha(),\
                pygame.image.load('image/aircraft_image/xx_4.png').convert_alpha(),\
                pygame.image.load('image/aircraft_image/xx_5.png').convert_alpha(),\
                pygame.image.load('image/aircraft_image/xx_6.png').convert_alpha(),\
                pygame.image.load('image/aircraft_image/xx_7.png').convert_alpha(),\
                ])
            self.rect = self.image.get_rect()
            self.rect.left,self.rect.top = position
            # self.mask = pygame.mask.from_surface(self.image)
            self.top = position[1]

            self.speed = 5
            self.num = 0
            self.action = True

    def move(self):
            self.rect.top-=self.speed

            if self.rect.top < self.top-randint(100,110):

                self.speed = -self.speed
                if  self.rect.top >700:
                    self.action = False
class Prop_bollet(pygame.sprite.Sprite):
    def __init__(self,position):
            pygame.sprite.Sprite.__init__(self)

            self.image = pygame.image.load('image/aircraft_image/prop_Icon.png').convert_alpha()
            self.rect = self.image.get_rect()
            self.rect.left,self.rect.top = position
            # self.mask = pygame.mask.from_surface(self.image)
            self.top = position[1]

            self.speed = 5
            self.action = True



    def move(self):
            self.rect.top-=self.speed

            if self.rect.top < self.top-randint(100,110):

                self.speed = -self.speed
                if  self.rect.top >700:
                    self.action = False
