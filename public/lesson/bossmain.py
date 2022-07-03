import pygame
from pygame.locals import *
import boss
import boss_bullet

SCREEN_SIZE =SCREEN_WIDTH,SCREEN_HEIGHT = 650,800
screen = pygame.display.set_mode((650,800))
pygame.display.set_caption('电子挑战赛')

Game = True# 游戏开关
boss_pic = boss.Boss(SCREEN_SIZE)
bg = pygame.image.load('image/ui/image_1.jpg')
zi = pygame.sprite.Group()
for i in range(50):
    zi.add(boss_bullet.BossBullet1((200, 170)))


boss_bullet_2_group = pygame.sprite.Group()

# zi = pygame.sprite.Group()
# for i in range(50):
#     zi.add(boss_bullet.BossBullet1((400,400)))
#zi = pygame.sprite.DirtySprite(zi)
flag = False
while Game:

    screen.blit(bg,(0,0))
    screen.blit(boss_pic.image,boss_pic.rect)
    boss_pic.move()
    if boss_pic.shoot:
        for i in range(6):
            b3 = boss_bullet.BossBullet2((boss_pic.rect.left+ i * 20+40, boss_pic.rect.bottom))
            boss_bullet_2_group.add(b3)
    for each in boss_bullet_2_group:
        each.move()
        screen.blit(each.image, each.rect)
        boss_pic.shoot = False

    if boss_pic.rect.top == 150 and boss_pic.rect.left == 100 :
        flag = True

    if flag:
        zi.draw(screen)
        zi.update()
        #zi.reset((200, 170))
        #pygame.display.update()
    #if self.rect.left < 0 or self.rect.right > 800 or self.rect.top < 0 or self.rect.bottom > 700:
        print(zi)
    #each.reset()
    if not zi:
        flag = False
        for i in range(50):
            zi.add(boss_bullet.BossBullet1((200, 170)))
    for event in pygame.event.get():
        if event.type == QUIT:
            pygame.quit()

    pygame.display.update()
