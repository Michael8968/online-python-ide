import turtle

turtle.mode("logo")
turtle.shape("turtle")
turtle.bgcolor("black")
turtle.pensize(7)
turtle.colormode(255)
turtle.pencolor(157, 208, 228)

for i in range(4):
    turtle.pu()
    turtle.goto(30*i, 0)
    turtle.pd()
    turtle.forward(80)


turtle.done()