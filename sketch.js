var pal = []
var cnv

function sierpinski(left, right, top, iterations, midpoint, palette, altpallete, index){

    if(iterations == 0)
    {
        
        fill(palette[index])
        noStroke()
        triangle(left.x, left.y, right.x, right.y, top.x, top.y)
        return 
    }

    var basemid = p5.Vector.lerp(left, right, midpoint)
    var rightmid = p5.Vector.lerp(right, top, midpoint)
    var leftmid = p5.Vector.lerp(top, left, midpoint)
    
    pal = blues

    sierpinski(left, basemid, leftmid, iterations - 1, midpoint, palette, altpallete, 2)
    sierpinski(basemid, right, rightmid, iterations - 1, midpoint, palette, altpallete, 4)
    sierpinski(leftmid, rightmid, top, iterations - 1, midpoint, palette, altpallete, 6)
    sierpinski(leftmid, basemid, rightmid, iterations - 1, .5, altpallete, altpallete, 8)
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
    // pal = pinks
    cnv = createCanvas(800, 800)
}

function draw(){
    background(pinks[4])

    // scl*=1.001
    var l = width*scl
    var h = l * sin(60)
    var cy = l/2 * tan(30)
    var cyy = h - cy
    var r = (l/2) / cos(30)

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
        createVector(0, -cyy), 5, midpoint, blues, pinks, 0)

    prevmid = midpoint

    pop()
}