let aliveSeeds = []
let ITERATION = -1;

let cherryBlossom = {
	h: 50,
	l: 50,
	t: 10000,
	clr: ["#F7A1C4", "#F16CA6", "#EE5297", "#EA3788", "#FF5964"]
}
let oak = {
	h: 75,
	l: 25,
	t: 10000,
	clr: ["#388659", "#45985C", "#52AA5E", "#036016", "#03440C", "#0C873A"]
}
let maple = {
	h: 50,
	l: 30,
	t: 10000,
	clr: ["#3C1518", "#9A031E", "#AF4319", "#FF7F11", "#FF5F09", "#FF3F00", "#FC6503", "#F98B05", "#F6B107", "#F2D709"]
}
let willow = {
	h: 50,
	l: 50,
	t: 10000,
	clr: ["#2A9134", "#137547", "#FFC914", "#054A29", "#76B041", "#F79824", "#FA9F42", "#88BA61", "#245B23"]
}

let c = oak;

function setup() {
	createCanvas(500 , 500).center();
	background(51);
}

function keyPy() {
	if (keyIsDown(87)) c = willow;
	if (keyIsDown(67)) c = cherryBlossom;
	if (keyIsDown(79)) c = oak;
	if (keyIsDown(77)) c = maple;
}

function draw() {
	keyPy();
	if (mouseIsPressed && mouseX <= width && mouseY <= height) {
		aliveSeeds.push(new Seed(mouseX , mouseY , c.h, c.l , c.t , c.clr , random(["Left" , "Right"])));
		ITERATION = 10;
	}

	if (ITERATION < 0) return;
	ITERATION--;
	let oldLen = aliveSeeds.length;
	if (oldLen == 0) noLoop();
	for (let i=0; i<oldLen; i++) {
		if (ITERATION >= 0) {
			if (random() > 0.05)
					aliveSeeds[i].nextGen();
		  	else {
		  		if (c === willow) {
		  			aliveSeeds[i].drawSeedForWillow();
		  		} else {
		  			aliveSeeds[i].drawSeed();
		  		}
			}
		} else {
	  		if (c === willow) {
	  			aliveSeeds[i].drawSeedForWillow();
	  		} else {
	  			aliveSeeds[i].drawSeed();
	  		}
		}
	}
	while (oldLen--) aliveSeeds.shift(); // Kill the prev Gen.	 
}


function Seed(x , y , h , l , t , clr , side){
	this.h = h; // Height
	this.l = l; // Half length
	this.n = random([1, 1, 2, 2, 3]); // # of seeds to next gen.
	this.t = t; // thickness( Lifness of this seed )
	this.pos = createVector(x , y); // Position
	this.side = side; // Left of Right

	this.rad = 5;
	this.clr = clr; //Beautiful colors(I like Them :>)

	this.drawSeed = function() {
		fill(random(this.clr));
		noStroke();
		push();
		translate(this.pos.x , this.pos.y);
		let rep = 5;
		while (rep--) {
			ellipse(0 , -0.5 , this.rad-0.75 , this.rad+0.75)
			rotate(1,25664);   // 72 deg
		}
		pop();
	}
	this.drawSeedForWillow = function() {
		push();
		let r = floor(random(2 , 5));
		translate(this.pos.x , this.pos.y);
		while(r--) {
			push();
			fill(random(this.clr));
			noStroke();
			rotate(5.02654825); // 4 * 72 deg
			ellipse(0, 0, this.rad-0.75, this.rad+0.75);
			pop();

			stroke("black");
			strokeWeight(2);
			line(0, 0, 0, 5);
			
			push();
			fill(random(this.clr));
			noStroke();
			rotate(3.76991118); // 3 * 72 deg
			ellipse(0, 0, this.rad-0.75, this.rad+0.75);
			pop();

			translate(0, 5)
		}
		pop();
	}
	this.drawLine = function(a) {
		stroke("black");
		strokeWeight(2);
		line(this.pos.x , this.pos.y , a.pos.x , a.pos.y);
	}

	this.nextGen = function() {

		for (let i=0; i<this.n; i++) {
			//Choosing atributes for i-th seed
			let P = 0 , norm = [];
			if (this.side == "Right") {
				P = 100;
				for (let j=1; j>=0; j-=0.01) {
					let rep = P * ((this.side == "Right")?3:1);   //Better Chancer
					while (rep--) norm.push({a:j , s:"Right"});
					P--;
				}
				P = 100;
				for (let j=0; j<=1; j+=0.01) {
					let rep = P * ((this.side == "Left")?3:1);    //Better Chancer
					while (rep--) norm.push({a:j , s:"Left"});
					P--;
				}
			} else {
				P = 100;
				for (let j=0; j<=1; j+=0.01) {
					let rep = P * ((this.side == "Right")?3:1);   //Better Chancer
					while (rep--) norm.push({a:j , s:"Right"});
					P--;
				}
				P = 100;
				for (let j=1; j>=0; j-=0.01) {
					let rep = P * ((this.side == "Left")?3:1);    //Better Chancer
					while (rep--) norm.push({a:j , s:"Left"});
					P--;
				}				
			}
			let val = random(norm);

			let x = this.pos.x + ((val.s == "Left")?-1:1) * map(val.a, 0, 1, 0, random(this.l/3 , this.l));
			let y = this.pos.y - random(this.h/5 , this.h);

			let nt = this.h / (dist(this.pos.x , this.pos.y , x , y)*10) * this.t; // Life divider
			
			let minval = (1 - nt / this.t);
			let nh = minval * this.h;
			let nl = (nh / this.h) * this.l;
			
			let seed = new Seed(x, y, nh, nl, nt, c.clr, val.s);

			aliveSeeds.push(seed);
			this.drawLine(seed)
		}
	}
}