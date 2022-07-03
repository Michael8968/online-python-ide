import turtle
turtle.shape('turtle')
turtle.bgcolor('black') 
turtle.speed(1)
turtle.pencolor('yellow')
for i in range(100):
    turtle.circle(30+i)
    turtle.right(5)

turtle.done()