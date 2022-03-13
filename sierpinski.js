var prevmid = 0.5
var rot = 0
var minskew = 0.00

var inc = 0
var rotspeed = 0
// inc = -1/360.0/2.0
// rotspeed = 1/2.0

var scl = 0.8

var enableCapture = false
var captureStart = 1
var captureEnd = 720-1
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



function sierpinski(left, right, top, iterations, midpoint, palette, altpallete, index, skip = false){

    if(iterations <= 0)
    {        
        if(skip) return
        
        // noStroke()
        // noFill()
        fill(palette[index])
        stroke(palette[index])
        triangle(left.x, left.y, right.x, right.y, top.x, top.y)
        return 
    }

    var basemid = p5.Vector.lerp(left, right, midpoint)
    var rightmid = p5.Vector.lerp(right, top, midpoint)
    var leftmid = p5.Vector.lerp(top, left, midpoint)

    sierpinski(left, basemid, leftmid, iterations - 1, midpoint, palette, altpallete, 0, false)
    sierpinski(basemid, right, rightmid, iterations - 2, midpoint, palette, altpallete, 1, false)
    sierpinski(leftmid, rightmid, top, iterations - 3, midpoint, palette, altpallete, 2, false)
    sierpinski(leftmid, basemid, rightmid, iterations - 4, midpoint, altpallete, altpallete, 3, false)
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
    strokeWeight(1)
}

function draw(){

    startCapture()
    
    background(softrainbow[9])


    //Calculate Midpoint
    var midpoint = prevmid + inc
    // if(midpoint>1-minskew || midpoint < minskew){        
        
    // }

    var pingpong = 1

    if(midpoint>1-minskew){
        if(pingpong){
            midpoint = 2-midpoint
            inc = -inc
        }
        else {
            midpoint = 1-midpoint
        }
    }
        
    if(midpoint<minskew){
        if(pingpong){
            midpoint = minskew + minskew - midpoint
            inc = -inc
        }
        else
        {
            midpoint = 1 - minskew - minskew + midpoint
        }
    }

    prevmid = midpoint

    //Do rotation
    rot += rotspeed
    if(rot>360){
        rot = rot-360
    }
    
    var l = width*scl
    var h = l * sin(60)

    push()
    translate(width/2, height/2)
    rotate(rot)

    sierpinski(
        createVector(-l/2, h * 1/3), 
        createVector(l/2, h * 1/3), 
        createVector(0, -h* 2/3),
        7, midpoint, softrainbow.slice(0,4), softrainbow.slice(6,10), 0)

    pop()

    doCapture()
}