import pygame

class HeroPlane(pygame.sprite.Sprite):
    def __init__(self,screen_size):
        pygame.sprite.Sprite.__init__(self)

        self.image = pygame.image.load('image/airplane/heroplane.png')

        self.rect = self.image.get_rect()

        self.rect.left ,self.rect.top = 300,700

        self.width,self.height = screen_size

        self.speed = 10



    def move_up(self):
        self.rect.top -= self.speed
        if self.rect.top < 0:
            self.rect.top = 0


    def move_down(self):
        self.rect.top += self.speed
        if self.rect.bottom > self.height :
            self.rect.bottom = self.height

    def move_right(self):
        self.rect.left += self.speed
        if self.rect.right >= self.width:
            self.rect.right = self.width

    def move_left(self):
        self.rect.left -= self.speed
        if self.rect.left <= 0 :
            self.rect.left = 0



class HeroBullet(pygame.sprite.Sprite):
    def __init__(self,postion):
        pygame.sprite.Sprite.__init__(self)

        self.image = pygame.image.load('image/bullet/hero_bullet.png')

        self.rect = self.image.get_rect()

        self.rect.left,self.rect.top = postion

        self.speed = 10


    def update(self):

        self.rect.top -= self.speed
        if self.rect.top < 0 :
            self.kill()

