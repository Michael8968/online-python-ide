import pygame,random

class Boss(pygame.sprite.Sprite):
    def __init__(self,screen_size,):
        pygame.sprite.Sprite.__init__(self)

        self.image = pygame.transform.smoothscale(pygame.image.load('image/airplane/boss.png').convert_alpha(),(180,120))


        self.rect =self.image.get_rect()
        self.width,self.height = screen_size
        self.rect.left,self.rect.top = 100,-100
        self.speed = [1,1]
        self.time = 0
        self.shoot = False
        self.time = 0


    def move(self):
        self.rect.top += self.speed[1]
        if self.rect.top >=150:
            self.rect.top = 150
            self.time += 1
            if self.time % 50 == 0:
                self.shoot = random.choice([True, False])
            self.rect.left += self.speed[0]
            if self.rect.left  <= 0 or self.rect.right > self.width:
                self.time += 1
                self.speed[0] = - self.speed[0]

