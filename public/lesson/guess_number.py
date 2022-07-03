import random
m = None # chances
a = None # level
z = None # answer
b = None # whether play it again
z = random.randint(1, 100)  # select number
a=input("Please select the game level\n1:hard 2:normal 3:easy others: random")
if a == 1:
    m = 3
elif a == 2:
    m = 5
elif a == 3:
    m = 10
else:
    m = random.randint(1, 10)
while True:
    if m==0:
        print("Game Over!\nThe answer is " + str(z))
        b = input("Do you wanna play it again?(y/n)")
        if b == "y":
            z = random.randint(1, 100)
            m = 5
        else:
            break
    n = int(input("Please input a number between 1 to 100.\n"))
    for i in range(m):

        print("❤", end = '')
    m -= 1
    if n > z:
        print("\nIt's too big!\n")
    elif n < z:
        print("\nIt's too small!\n")
    else:
        print("bingo!\n")
        break