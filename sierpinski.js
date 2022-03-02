var prevmid = 0.5
var rot = 0
var minskew = 0.00

var inc = 1/360.0/2.0
var rotspeed = 1/2.0
// var inc = 0
// var rotspeed = 0

var scl = 0.8

var enableCapture = false
var captureStart = 1
var captureEnd = 5
var _isCapturing = false

function startCapture(){
    if(!enableCapture) return
    if(frameCount == captureStart){
        _isCapturing = true
        capturer.start()
    }
}

function doCapture() {
    if(_isCapturing){
        capturer.capture(canvas)
        if(frameCount === captureEnd){
            capturer.stop()
            capturer.save()
        }
    }
}



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

    sierpinski(left, basemid, leftmid, iterations - 1, midpoint, palette, altpallete, 2)
    sierpinski(basemid, right, rightmid, iterations - 1, midpoint, palette, altpallete, 4)
    sierpinski(leftmid, rightmid, top, iterations - 1, midpoint, palette, altpallete, 6)
    sierpinski(leftmid, basemid, rightmid, iterations - 1, .5, altpallete, altpallete, 8)
}



function keyTyped(){
    if(key === "s"){
        save(canvas, "sierpinski.png")
    }

    if (key == "v"){
        capturer.start()
    }

    if(key ==="x"){
        capturer.stop()
        capturer.save()        
    }
}

function setup(){
    
    angleMode(DEGREES)
    createCanvas(800, 800)
}

function draw(){

    startCapture()
    
    
    background(pinks[4])

    var l = width*scl
    var h = l * sin(60)
    
    var left = -l/2
    var right = l/2
    var midx = 0
    var top = - h* 2/3
    var bottom = h * 1/3

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
        createVector(left, bottom), 
        createVector(right, bottom), 
        createVector(midx, top),
        5, midpoint, blues, pinks, 0)

    prevmid = midpoint

    pop()

    doCapture()
}