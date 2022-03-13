var planets = []
var speedScale = .01
var G = 0.01
var drawTrails = true
const sunPal = ["#ff7b00","#ff8800","#ff9500","#ffa200","#ffaa00","#ffb700","#ffc300","#ffd000","#ffdd00","#ffea00"]
var planetPal = "#9c89b8, #f0a6ca, #efc3e6, #f0e6ef, #b8bedd".split(", ")
planetPal = "#b7094c, #a01a58, #892b64, #723c70, #5c4d7d, #455e89, #2e6f95, #1780a1, #0091ad".split(", ")
planetPal = "#f72585, #b5179e, #7209b7, #560bad, #480ca8, #3a0ca3, #3f37c9, #4361ee, #4895ef, #4cc9f0".split(", ")
suns = []

const bgColor = "#052b38"
var doUpdate = true


var enableCapture = true
var captureStart = 1
var captureEnd = 3200
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
            _isCapturing = false
			capturer.stop()
            capturer.save()
        }
    }
}

function perpendicular(vec){
	var tangent = createVector(0,1)
		if(vec.x == 0){
			if(y>0){
				tangent = createVector(1, 0)
			}
			else{
				tangent = createVector(-1,0)
			}
		}
		else{
			if(vec.x>0){
				tangent = createVector(-vec.y / vec.x, 1).normalize()
			}
			else{
				tangent = createVector(-vec.y / vec.x, -1).normalize()
			}
		}
	return tangent
}

function randomPlanets(count, sizeMin, sizeMax, velMin, velMax){
	for (var i = 0; i < count; i++) {
        
		var angle = random(TWO_PI)
		var length = random(100, 540)
		var pos = createVector(width/2, height/2).add(p5.Vector.mult(createVector(cos(angle), sin(angle)).normalize(), length))
		
		// var pos = createVector(random(width), random(height))
		var rad = random(sizeMin, sizeMax)		
		

		var radial = p5.Vector.sub(pos, createVector(width/2, height/2))
		// var length = radial.mag()
		var angle2 = atan2(radial.y, radial.x) + PI/180
		var radial2 = p5.Vector.mult(createVector(cos(angle2), sin(angle)).normalize(), length)


		var g = G * rad * rad * rad * PI * 125000 * PI / (length * length)
		var vel = p5.Vector.sub(radial2, radial).normalize() 
		// vel.mult(random(velMin, velMax))
		vel.mult(g* 50)
		
		

		planets.push(new Planet("rand", pos.x, pos.y, rad, vel, planetPal))
	}
}


function randomPlanetsPerpendicular(center, count, distMin, distMax, sizeMin, sizeMax, velMin, velMax) {

	var step = (velMax-velMin)/count

	for (var i = 0; i < count; i++) {
		var angle = random(TWO_PI)
		angle = QUARTER_PI
		var dist = random(distMin, distMax)
		var rad = random(sizeMin, sizeMax)
		// var vel = random(velMin, velMax)
		var vel = velMin + i * step
		var colorIdx = floor((vel-velMin)/(velMax-velMin) * planetPal.length)
		
		
		var dirVec = createVector(cos(angle), sin(angle)).mult(dist)

		var planetpos = p5.Vector.add(center, dirVec)
		
		var tangent = perpendicular(dirVec)
		
		var planet = new Planet("rand", planetpos.x, planetpos.y, rad, tangent.mult(vel), planetPal, -1)
		planets.push(planet)
	}
}

class Planet {
	constructor(name, x, y, radius, v, palette, index = -1) {
		this.name = name
		this.setRadius(radius)

		this.pos = createVector(x, y, 0)
		this.vel = v //vector

		this.alive = true
		if(index === -1) index = floor(random(palette.length))
		this.color = palette[index] // + "11"
        this.prevPos = createVector(this.pos.x, this.pos.y)
	}
	
	setRadius(radius){
		this.radius = radius
		this.mass = radius * radius * radius * PI
	}

	collide(other){
		var recepient = this
		var giver = other
		if(other.mass > this.mass){
			recepient = other
			giver = this
		}
		
		giver.alive = false
		var totalmass = recepient.mass + giver.mass
		recepient.vel = p5.Vector.add(recepient.vel.mult(recepient.mass/totalmass), giver.vel.mult(giver.mass/totalmass))
		recepient.setRadius (sqrt(recepient.radius * recepient.radius + giver.radius * giver.radius))
		// recepient.color = giver.color

		
		
	}

	update(bodies) {
		if (!doUpdate) return 
		if (!this.alive) return

        

		for (var body of bodies) {
			//skip self or if body is dead
			if (body === this || !body.alive) continue

			var dist = this.pos.dist(body.pos)

			if (dist < this.radius + body.radius * 0.9) {
				this.collide(body)
				if(!this.alive){
					return
				}
			}

			var dir = p5.Vector.sub(body.pos, this.pos).normalize()
			var g = G * this.mass * body.mass / (dist * dist)
			dir.mult(g)
			this.vel.add(dir)

		}
        // if(this.pos.x < 0 ){
		// 	this.pos.x = - this.pos.x
		// 	this.vel.x *= -1
		// }
		// if(this.pos.x > width){
		// 	this.pos.x = width - (this.pos.x - width)
		// 	this.vel.x *= -1
		// }

		// if(this.pos.y < 0){
		// 	this.pos.y = -this.pos.y
		// 	this.vel.y *= -1
		// }
		// if(this.pos.y > height){
		// 	this.pos.y = height - (this.pos.y - height)
		// 	this.vel.y *= -1
		// }

		this.prevPos = createVector(this.pos.x, this.pos.y)
		this.pos.x += this.vel.x * speedScale
		this.pos.y += this.vel.y * speedScale
	}

	draw() {
		if (!this.alive) return
		
		// fill(this.color)
		// noStroke()
        // circle(this.pos.x, this.pos.y, 2 * this.radius)

		strokeWeight(this.radius * 2)
		stroke(this.color)
		line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y)
		// fill("white")
		// text(floor(this.mass), this.pos.x, this.pos.y)
	}
}

function keyTyped() {
	if (key === "s") {
		save("Galaxy.jpg")
	}

	if(key == "x") {
		_isCapturing = false
		capturer.stop()
		capturer.save()
	}
}

const params = {}



function paramsWindow(){
// 	// create sliders
//   params.sun1 = createSlider(1, 100, sun1Rad);
//   params.sun1.position(1200, 20);
// 	params.sun1.changed(()=>{ 
// 		sun1Rad = params.sun1.value() 
// 		suns[0].setRadius(sun1Rad)
// 	})
//   params.sun2 = createSlider(1, 100, sun2Rad);
//   params.sun2.position(1200, 50);
// 	params.sun2.changed(()=>{ 
// 		sun2Rad = params.sun2.value() 
// 		suns[1].setRadius(sun2Rad)
// 	})
	
	params.trails = createCheckbox('Trails', drawTrails);
	params.trails.position(1200, 70);
  params.trails.changed(()=>{
		drawTrails = !drawTrails});
	
	params.simulate = createCheckbox('Simulate', doUpdate);
	params.simulate.position(1200, 90);
  params.simulate.changed(()=>{
		doUpdate = !doUpdate});
}

function setup() {
	createCanvas(1080, 1080);
	background(bgColor)
	
	//suns.push(new Planet("sun", width/2, height/2, random(50,50), new p5.Vector(0, 0), sunPal))

	
	// suns.push(new Planet("sun", random(width / 8, width*7/8), random(height  / 8, height*7/8), random(30,100), new p5.Vector(0, 0), sunPal))
	// suns.push(new Planet("sun",  random(width / 8, width*7/8), random(height / 3, height*7/8), random(30,100), new p5.Vector(0, 0), sunPal))

	suns.push(new Planet("sun", 475.90103373845733, 452.1566323839558, 61.54783059883469, new p5.Vector(0, 0), sunPal))
	suns.push(new Planet("sun",  915.613133549677, 446.9138887695626, 50.10153316274585, new p5.Vector(0, 0), sunPal))
	

	console.log(suns[0].pos.x +" "+  suns[0].pos.y + " " + suns[0].radius)
	console.log(suns[1].pos.x +" "+  suns[1].pos.y+ " " + suns[1].radius)

	paramsWindow()

	randomPlanetsPerpendicular(suns[1].pos, 40, 200, 200, 2, 2, 100, 500)
	// randomPlanets(100, 2, 2, 100, 500)
}


function draw() {
	if(frameCount%100 === 0) console.log(frameCount)
	startCapture()
	if(!drawTrails){
		 background(bgColor);
	}
	for(var sun of suns){
		sun.draw()
	}
	
	for (var p of planets) {
		// p.update([...planets, sun])
		p.update(suns)
		p.draw()
	}
    // noLoop()
	doCapture()
}
