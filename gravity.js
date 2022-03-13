var planets = []
var suns = []
var speedScale = .1
var G = 0.01
var drawTrails = true
// const planetPal = ["#f94144","#f3722c","#f8961e","#f9844a","#f9c74f","#90be6d","#43aa8b","#4d908e","#577590","#277da1"]
// const planetPal = ["#d9ed92","#b5e48c","#99d98c","#76c893","#52b69a","#34a0a4","#168aad","#1a759f","#1e6091","#184e77"]
const sunPal = ["#ff7b00","#ff8800","#ff9500","#ffa200","#ffaa00","#ffb700","#ffc300","#ffd000","#ffdd00","#ffea00"]
var planetPal = "#9c89b8, #f0a6ca, #efc3e6, #f0e6ef, #b8bedd".split(", ")
planetPal = "#b7094c, #a01a58, #892b64, #723c70, #5c4d7d, #455e89, #2e6f95, #1780a1, #0091ad".split(", ")
planetPal = "#f72585, #b5179e, #7209b7, #560bad, #480ca8, #3a0ca3, #3f37c9, #4361ee, #4895ef, #4cc9f0".split(", ")




const bgColor = "#052b38"
var doUpdate = true
var sun1Rad = 50
var sun2Rad = 50

function perpendicular(vec){
	var tangent = createVector(0,1)
		if(vec.x == 0){
			tangent = createVector(1, 0)
		}
		else{
			tangent = createVector(-vec.y / vec.x, 1).normalize()
		}
	return tangent
}

function randomPlanets(pos, direction, count, sizeMin, sizeMax, velMin, velMax){
	var step = (velMax-velMin)/count
	for (var i = 0; i < count; i++) {
		var rad = random(sizeMin, sizeMax)		
		var vel = velMin + i * step
		planets.push(new Planet("rand", pos.x, pos.y, rad, direction.normalize().mult(vel), planetPal))
	}
}

function randomPlanetsPerpendicular(center, count, distMin, distMax, sizeMin, sizeMax, velMin, velMax) {

	for (var i = 0; i < count; i++) {
		var angle = random(TWO_PI)
		angle = QUARTER_PI
		var dist = random(distMin, distMax)
		var rad = random(sizeMin, sizeMax)
		var vel = random(velMin, velMax)
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

		this.pos = new p5.Vector(x, y, 0)
		this.vel = v //vector

		this.alive = true
		if(index === -1) index = floor(random(palette.length))
		this.color = palette[index] // + "11"
	}
	
	setRadius(radius){
		this.radius = radius
		this.mass = radius * radius * PI
	}

	update(bodies) {
		if (!doUpdate) return 
		if (!this.alive) return

        

		for (var body of bodies) {
			//skip self or if body is dead
			if (body === this || !body.alive) continue

			var dist = this.pos.dist(body.pos)

			if (dist < this.radius + body.radius * 0.9) {
					this.alive = false
			}

			var dir = p5.Vector.sub(body.pos, this.pos).normalize()
			var g = G * this.mass * body.mass / (dist * dist)
			dir.mult(g)
			this.vel.add(dir)

		}
        
		this.pos.x += this.vel.x * speedScale
		this.pos.y += this.vel.y * speedScale
	}

	draw() {
		if (!this.alive) return
		
		fill(this.color)
		stroke(this.color)

        circle(this.pos.x, this.pos.y, 2 * this.radius)
		
	}
}

function keyTyped() {
	if (key === "s") {
		save("Galaxy.jpg")
	}
}

const params = {}



function paramsWindow(){
	// create sliders
  params.sun1 = createSlider(1, 100, sun1Rad);
  params.sun1.position(1200, 20);
	params.sun1.changed(()=>{ 
		sun1Rad = params.sun1.value() 
		suns[0].setRadius(sun1Rad)
	})
  params.sun2 = createSlider(1, 100, sun2Rad);
  params.sun2.position(1200, 50);
	params.sun2.changed(()=>{ 
		sun2Rad = params.sun2.value() 
		suns[1].setRadius(sun2Rad)
	})
	
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
	
	suns.push(new Planet("sun", random(width / 8, width*7/8), random(height  / 8, height*7/8), random(30,100), new p5.Vector(0, 0), sunPal))
	suns.push(new Planet("sun",  random(width / 8, width*7/8), random(height / 3, height*7/8), random(30,100), new p5.Vector(0, 0), sunPal))

	paramsWindow()
	randomPlanetsPerpendicular(suns[1].pos, 40, 200, 200, 2, 2, 5, 25)
	// randomPlanets(p5.Vector.add(suns[1].pos,createVector(suns[1].radius*2, 0)), createVector(0, 1), 50, 2, 2, 1, 100)
}


function draw() {
    
	if(!drawTrails){
		 background(bgColor);
	}
	fill("#FFFFFF11")
	// stroke("#55555511")
	strokeWeight(1)
	noStroke()
	for(var sun of suns){
		sun.draw()
	}
	
	for (var p of planets) {
		// p.update([...planets, sun])
		p.update(suns)
		p.draw()
	}
    // noLoop()
}