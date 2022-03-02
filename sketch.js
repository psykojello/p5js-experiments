var pal = []
var cnv

function sierpinski(left, right, top, iterations, midpoint, color="gray"){

    if(iterations == 0)
    {
        fill(color)
        // stroke(color)
        // stroke('black')
        noStroke()
        triangle(left.x, left.y, right.x, right.y, top.x, top.y)
        return 
    }

    var basemid = p5.Vector.lerp(left, right, midpoint)
    var rightmid = p5.Vector.lerp(right, top, midpoint)
    var leftmid = p5.Vector.lerp(top, left, midpoint)
    
    pal = softrainbow
    // if(hole) pal = blues; else pal = warmrainbow

    sierpinski(left, basemid, leftmid, iterations - 1, midpoint, color=pal[0])
    sierpinski(basemid, right, rightmid, iterations - 1, midpoint, color = pal[1])
    sierpinski(leftmid, rightmid, top, iterations - 1, midpoint, color=pal[2])
    sierpinski2(leftmid, basemid, rightmid, iterations - 1, midpoint, color=pal[3])
}

function sierpinski2(left, right, top, iterations, midpoint, color="gray", hole = false){

    if(iterations == 0)
    {
        fill(color)
        noStroke()
        triangle(left.x, left.y, right.x, right.y, top.x, top.y)
        return 
    }

    var basemid = p5.Vector.lerp(left, right, midpoint)
    var rightmid = p5.Vector.lerp(right, top, midpoint)
    var leftmid = p5.Vector.lerp(top, left, midpoint)
    // pal = blues
    // if(hole) pal = blues; else pal = warmrainbow
    // var base = 4
    

    sierpinski2(left, basemid, leftmid, iterations - 1, midpoint, color=pal[5])
    sierpinski2(basemid, right, rightmid, iterations - 1, midpoint, color = pal[6])
    sierpinski2(leftmid, rightmid, top, iterations - 1, midpoint, color=pal[7])
    sierpinski2(leftmid, basemid, rightmid, iterations - 1, midpoint, color=pal[8], true)
}
var prevmid = 0.5
var rot = 0
var minskew = 0.00

var inc = 0.001
var rotspeed = 0.1
// var inc = 0
// var rotspeed = 0

var scl = 0.8

function keyTyped(){
    if(key === "s"){
        save(cnv, "sierpinski.png")
    }
}

function setup(){
    angleMode(DEGREES)
    pal = softrainbow
    cnv = createCanvas(800, 800)
}

function draw(){
    background(pal[4])

    // scl*=1.001
    var l = width*scl
    var h = l * sin(60)
    var cy = l/2 * tan(30)
    var cyy = h - cy
    var r = (l/2) / cos(30)
    stroke("white")
    strokeWeight(2)
    noFill()
    // circle(width/2, height/2, r*2)


    stroke("white")
    strokeWeight(2)
    // noFill()

    var midpoint = prevmid + inc
    if(midpoint>1-minskew || midpoint < minskew){        
        inc = -inc
    }
    if(midpoint>1)
        midpoint = 1
    if(midpoint<0)
        midpoint = 0

    rot += rotspeed
    
    push()
    translate(width/2, height/2)
    rotate(rot)
    
    sierpinski(
        createVector(-l/2, cy), 
        createVector(l/2, cy), 
        createVector(0, -cyy), 5, midpoint)

    prevmid = midpoint

    pop()
}