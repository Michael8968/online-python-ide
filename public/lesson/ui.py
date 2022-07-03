import pygame,random

class BackGround(pygame.sprite.Sprite):

    def __init__(self,postion,screen_size):

        pygame.sprite.Sprite.__init__(self)

        self.image = pygame.image.load('image/ui/bg.png').convert_alpha()

        self.rect = self.image.get_rect()

        self.rect.left ,self.rect.bottom = postion

        self.width,self.height = screen_size

        self.speed = 1

        self.action = False

    def update(self):
        self.rect.top += self.speed
        if self.rect.bottom >self.height:
            self.action = True
            #self.kill()



class Prop_xx(pygame.sprite.Sprite):

    def __init__(self, position):
        pygame.sprite.Sprite.__init__(self)

        self.image = pygame.image.load('image/ui/xx.png').convert_alpha()
        self.image_bollet = pygame.image.load('image/ui/prop_lcon.png').convert_alpha()

        self.xx_image = []
        self.xx_image.extend([ \
            pygame.image.load('image/ui/xx.png').convert_alpha(), \
            pygame.image.load('image/ui/xx_1.png').convert_alpha(), \
            pygame.image.load('image/ui/xx_2.png').convert_alpha(), \
            pygame.image.load('image/ui/xx_3.png').convert_alpha(), \
            pygame.image.load('image/ui/xx_4.png').convert_alpha(), \
            pygame.image.load('image/ui/xx_5.png').convert_alpha(), \
            pygame.image.load('image/ui/xx_6.png').convert_alpha(), \
            pygame.image.load('image/ui/xx_7.png').convert_alpha(), \
            ])
        self.rect = self.image.get_rect()
        self.rect.left, self.rect.top = position
        # self.mask = pygame.mask.from_surface(self.image)
        self.top = position[1]

        self.speed = 5
        self.num = 0
        self.action = True

    def move(self):
        self.rect.top -= self.speed

        if self.rect.top < self.top - random.randint(100, 110):

            self.speed = -self.speed
            if self.rect.top > 700:
                self.action = False


class Prop_bollet(pygame.sprite.Sprite):
    def __init__(self, position):
        pygame.sprite.Sprite.__init__(self)

        self.image = pygame.image.load('image/aircraft_image/prop_lcon.png').convert_alpha()
        self.rect = self.image.get_rect()
        self.rect.left, self.rect.top = position
        # self.mask = pygame.mask.from_surface(self.image)
        self.top = position[1]

        self.speed = 5
        self.action = True

    def move(self):
        self.rect.top -= self.speed

        if self.rect.top < self.top - randint(100, 110):

            self.speed = -self.speed
            if self.rect.top > 700:
                self.action = False
