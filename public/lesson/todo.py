#默认
import random

xiang  = random.randint(1,100)  # 电脑想的数字


cai = int(input())             # 人类输入的数字

if cai > xiang:
    print("太大了")



#1.一次机会猜数字
#import random

#xiang  = random.randint(1,100)  # 电脑想的数字
#print("我已经想好数字了，你可以猜了,范围是1到100")

#cai = int(input())             # 人类输入的数字

#if cai > xiang:
    #print("太大了")
#if cai < xiang:
    #print("太小了")
#if cai == xiang:
    #print("猜对了") 
    
#2.放循环里无限猜数字
#import random
#xiang  = random.randint(1,100)
#while True:
    #print("我已经想好数字了，你可以猜了,范围是1到100")   #电脑告诉人类，它想好了
    #cai = int(input())    
    #if cai > xiang:
        #print("太大了")
    #if cai < xiang:
        #print("太小了")
    #if cai == xiang:
        #print("猜对了")  
        #break