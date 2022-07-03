import turtle,random
turtle.tracer(10000)
turtle.hideturtle()
turtle.colormode(255)

def snail():
    turtle.clear()
    turtle.bgcolor(0,0,0)
    r = random.randint(0, 255)
    g = random.randint(0, 255)
    b = random.randint(0, 255)    
    turtle.pencolor(r,g,b)
    for i in range(103):
        turtle.circle(30+i)
        turtle.right(5)
    turtle.ontimer(snail, 1000)
snail()
turtle.done()