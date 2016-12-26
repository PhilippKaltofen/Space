// Space Game

// global variables

var player;
var planets;
var backgroundLayer_1;
var backgroundLayer_2;

var particles_rocket_main;
var particles_rocket_left;
var particles_rocket_right;

// SETUP FUNCTION

var setup = function(){
    createCanvas(windowWidth, windowHeight);
    background(20,20,20);
    rectMode(CENTER);

    player = new rocketShip(width / 2, height / 2);
    planets = [];
    for(var i = 0; i < 3; i++){
        planets.push(new planet(random(0, width), random(0, height), random(50, 150)));
    }

    backgroundLayer_1 = [];
    backgroundLayer_2 = [];

    for(var i = 0; i < 30; i++){
        backgroundLayer_1[i] = new backgroundDetail(random(0, width), random(0, height));
        backgroundLayer_2[i] = new backgroundDetail(random(0, width), random(0, height));
    }

    particles_rocket_main = [];
    for(var i = 0; i < 50; i++){
        particles_rocket_main[i] = new particle(player, player.position.x, player.position.y, 200, 200, 0, random(-1,1), 1, random(5, 10), random(3,10), random(1,3));
    }
}

// DRAW

var draw = function(){
    background(20,20,20);

    // draw background
    // back layer
    for(var i = 0; i < backgroundLayer_2.length; i++){
        backgroundLayer_2[i].drawDetail();
    }
    // front layer
    for(var i = 0; i < backgroundLayer_1.length; i++){
        backgroundLayer_1[i].drawDetail();
    }

    // draw planets
    for(var i = 0; i < planets.length; i++){
        planets[i].drawPlanet();
    }

    // draw engine particles
    // main engine
    for(var i = 0; i < particles_rocket_main.length; i++){
        particles_rocket_main[i].drawParticle();
    }

    // draw player
    player.drawRocketShip();
}

var planet = function(posX, posY, size){
    this.r = random(200, 255); 
    this.g = random(0,50);
    this.b = 0;
    this.seed = round(random(0,2));
    this.rings = round(random(0,1));
    this.position = createVector(posX, posY);
    this.size = size;
    this.gravity = size / 500;

    // setup

    switch(this.seed){
        case 1:
            this.r = random(200, 255);
            this.g = random(0,50);
            this.b = 0;
            break;
        case 2:
            this.r = 0;
            this.g = random(50, 100);
            this.b = random(200, 255);
    }

    // draw planet
    this.drawPlanet = function(){ 
        noStroke();       
        // planet glow
        fill(this.r, this.g, this.b, 50);
        ellipse(this.position.x, this.position.y, this.size * 1.8, this.size * 1.8)        
        // planet base
        fill(this.r, this.g, this.b, 255);
        ellipse(this.position.x, this.position.y, this.size, this.size);

        // rings
        if(this.rings === 1){
            stroke(this.r * 1.5, this.g * 1.5, this.b * 1.5,200);
            fill(0,0,0,0);
            strokeWeight(3);
            ellipse(this.position.x, this.position.y, this.size * 1.5, this.size / 2);
            noStroke();
            fill(this.r,this.g,this.b, 255);
            ellipse(this.position.x, this.position.y - this.size / 5, this.size * 0.9, this.size * 0.2);
        }

        // distance to player
        textAlign(CENTER);
        fill(255, 255, 255);
        text(round(dist(this.position.x, this.position.y, player.position.x, player.position.y)), this.position.x, this.position.y);

        if(player.nearestPlanet == this){
            this.r = 255;
            this.g = 255;
            this.b = 255;            
        }
    }
}

var rocketShip = function(posX, posY){
    this.position = createVector(posX, posY);
    this.nearestPlanetDistance = 100000;
    this.nearestPlanet = null;
    this.velocityX = 1;
    this.velocityY = 1;
    this.force = 1;
    this.rotation = 0;

    this.drawRocketShip = function(){
        // draw rocketship
        push();
        translate(this.position.x, this.position.y);
        rotate(degrees(this.rotation));

        // rocketship base
        fill(200,200,200);
        rect(0, 0, 20, 40);
        // top
        ellipse(0, -20, 20, 20);
        // wings
        fill(150,150,150);
        triangle(-10, 10, -10, -20, -20, 10);        
        triangle(10, 10, 10, -20, 20, 10);
        // window
        fill(20, 20, 20);
        ellipse(0, -18, 15, 15);
        fill(200, 200, 200);
        rect(0, -10, 15, 10);
        // ENGINES
        // main
        fill(150,150,150);
        beginShape();
        vertex(-5, 20);
        vertex(5, 20);
        vertex(8, 25);
        vertex(-8, 25);
        endShape(CLOSE);
        // left
        fill(200,200,200);
        rect(-14, 12, 6, 5);
        // right
        fill(200,200,200);
        rect(14, 12, 6, 5);

        pop();

        // let gravity of planets affect ship
        // nearest planet

        for(var i = 0; i < planets.length; i++){
            if(dist(planets[i].position.x, planets[i].position.y, this.position.x, this.position.y) < this.nearestPlanetDistance && planets[i] != this.nearestPlanet){
                this.nearestPlanet = planets[i];
                this.nearestPlanetDistance = dist(this.nearestPlanet.position.x, this.nearestPlanet.position.y, this.position.x, this.position.y);
            }
        }

        this.nearestPlanetDistance = dist(this.nearestPlanet.position.x, this.nearestPlanet.position.y, this.position.x, this.position.y);

        var dx = (this.nearestPlanet.position.x - this.position.x);
        var dy = (this.nearestPlanet.position.y - this.position.y);

        // this.force.add(1 * (this.nearestPlanet.position.x - this.position.x) / this.nearestPlanetDistance ^ 2, 1 * (this.nearestPlanet.position.y - this.position.y) / this.nearestPlanetDistance ^ 2);

        textAlign(LEFT);
        text("Direction: " + this.position.heading(), width / 2, 20);
        text("Magnitude: " + this.position.mag(), width / 2, 40);

        if(keyIsPressed){
            this.force++;
        }

        // this.position.add(0.1 * this.position.heading() * this.force);
        // this.position.x += dx * (this.nearestPlanet.gravity / this.nearestPlanetDistance);
        // this.position.y += dy * (this.nearestPlanet.gravity / this.nearestPlanetDistance);

        stroke(200);
        line(this.position.x, this.position.y, this.nearestPlanet.position.x, this.nearestPlanet.position.y);

        // INPUT

        if(keyIsDown(87)){
            // UP
        } else
        if(keyIsDown(83)){
            // DOWN
        }

        if(keyIsDown(65)){
            this.rotation -= 0.001;
        } else
        if(keyIsDown(68)){
            this.rotation += 0.001;
        }
    }
}

var backgroundDetail = function(posX, posY){
    this.position = createVector(posX, posY);
    this.r = 200;
    this.g = 200;
    this.b = 0;
    this.size = random(0, 5);

    this.drawDetail = function(){
        // fill(this.r, this.g, this.b);        
        noStroke();
        fill(this.r, this.g, this.b);
        ellipse(this.position.x, this.position.y, this.size, this.size);
    }
}

var particle = function(parent, posX, posY, r, g, b, dirX, dirY, decaySpeed, size, speed){
    this.parent = parent;
    this.startPosition = createVector(this.parent.position.x, this.parent.position.y + 20);
    this.position = createVector(posX, posY);
    this.r = r;
    this.g = g;
    this.b = b;
    this.opacity;
    this.size = size;
    this.direction = createVector(dirX, dirY);
    this.moving = true;
    this.fade = true;
    this.decaySpeed = decaySpeed;
    this.speed = speed;

    this.drawParticle = function(){
        // draw particle
        fill(this.r, this.g, this.b, this.opacity);
        ellipse(this.position.x, this.position.y, this.size, this.size);
        // move particle
        if(this.moving){
            this.position.x += this.direction.x * this.speed;
            this.position.y += this.direction.y * this.speed;
        }
        // fadeout
        if(this.fade){
            if(this.opacity > 0){
                this.opacity -= decaySpeed;
            } else {
                this.resetParticle();
            }
        }
    }

    this.resetParticle = function(){
        this.position.x = this.startPosition.x;
        this.position.y = this.startPosition.y;
        this.opacity = 255;
    }

}