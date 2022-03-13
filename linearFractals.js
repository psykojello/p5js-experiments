const patterns = [
    [[0, 0], [0,1/2], [1/2, 1/2], [1/2, 0], [1/2, -1/2], [1, -1/2], [1,0] ], //0
    [[0, 0], [0,1/3], [1/3, 1/3], [1/3, -1/3], [2/3, -1/3], [2/3, 1/6], [1, 1/6], [1,0] ], //1
    [[0, 0], [0,1/3], [1/3, 1/3], [1/3, 0], [2/3,0], [2/3, 1/6], [1, 1/6], [1,0] ], //2
    [[0, 0], [1/3,0], [1/3, 1/3], [2/3, 1/3], [2/3, 0], [1,0] ], //3  (koch)
    [[0, 0], [1/3,0], [1/2, 0.8660254/3], [2/3, 0], [1,0] ], //4
    [[0, 0], [1/2, 1/2], [1/2, -1/2], [1, 0]], //5
]


function fracLine(pointA, pointB, pattern, iter){

    var lineVec = p5.Vector.sub(pointB, pointA)
    var length = lineVec.mag()
    var heading = lineVec.heading()

    if(length < 2 || iter === 0){
        line(pointA.x, height-pointA.y, pointB.x, height-pointB.y)
    } else {

        var pts = []

        for(var pat of pattern){
            var vec = createVector(pat[0], pat[1])
            vec.mult(length)
            vec.rotate(heading)
            pts.push(p5.Vector.add(pointA, vec))
        }

        for(var i = 0;i<pts.length-1;i++){
            fracLine(pts[i], pts[i+1], pattern, iter-1)
        }
    }
}

function setup(){
    
    // angleMode(DEGREES)
    createCanvas(1080, 1080)
    background(0)
    stroke("white")
    strokeWeight(1)
}

function koch(){
    var lineWidth = width/2
    iters = 5

    var A = createVector(width/2 - lineWidth/2, height/2)
    var B = createVector(width/2 + lineWidth/2, height/2)
    var C = createVector(width/2, height/2 + sin(PI/3) * lineWidth)
    // fracLine(A, B, patterns[4],5)
    fracLine(A, C, patterns[4],iters)
    fracLine(C, B, patterns[4],iters)
    fracLine(B, A, patterns[4],iters)
}

function border() {
    var A = createVector(0+20, height/2)
    var B = createVector(width/2, height-20)
    var C = createVector(width-20, height/2)
    var D = createVector(width/2, 0+20)
    fracLine(A, B, patterns[patt],iters)
    fracLine(B, C, patterns[patt],iters)
    fracLine(C, D, patterns[patt],iters)
    fracLine(D, A, patterns[patt],iters)
}

function draw(){
    var lineWidth = width/2
    iters = 7
    patt = 5

    var A = createVector(width/2 - lineWidth/2, height/2)
    var B = createVector(width/2 + lineWidth/2, height/2)
    fracLine(A, B, patterns[patt],iters)
    noLoop()
}