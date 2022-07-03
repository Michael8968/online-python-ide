import turtle
turtle.shape('turtle')
turtle.bgcolor('black')
turtle.speed(0)
turtle.pencolor("yellow")
turtle.pensize(2)
for i in range(100):
    turtle.circle(30+i)
    turtle.right(5)

turtle.done()
