// Space Game

// global variables

var player;
var planets;

// SETUP FUNCTION

var setup = function(){
    createCanvas(windowWidth, windowHeight);
    background(20,20,20);
    rectMode(CENTER);

    player = new rocketShip(width / 2, height / 2);
    planets = [];
    for(var i = 0; i < 10; i++){
        planets.push(new planet(random(0, width), random(0, height), random(50, 150)));
    }
}

// DRAW

var draw = function(){
    background(20,20,20);

    // draw planets
    for(var i = 0; i < planets.length; i++){
        planets[i].drawPlanet();
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
    this.posX = posX;
    this.posY = posY;
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
        ellipse(this.posX, this.posY, this.size * 1.8, this.size * 1.8)        
        // planet base
        fill(this.r, this.g, this.b, 255);
        ellipse(this.posX, this.posY, this.size, this.size);

        // rings
        if(this.rings === 1){
            stroke(this.r * 1.5, this.g * 1.5, this.b * 1.5,200);
            fill(0,0,0,0);
            strokeWeight(3);
            ellipse(this.posX, this.posY, this.size * 1.5, this.size / 2);
            noStroke();
            fill(this.r,this.g,this.b, 255);
            ellipse(this.posX, this.posY - this.size / 5, this.size * 0.9, this.size * 0.2);
        }

        // distance to player
        textAlign(CENTER);
        fill(255);
        text(round(dist(this.posX, this.posY, player.posX, player.posY)), this.posX, this.posY);

        if(player.nearestPlanet == this){
            this.r = 255;
            this.g = 255;
            this.b = 255;            
        }
    }
}

var rocketShip = function(posX, posY){
    this.posX = posX;
    this.posY = posY;
    this.nearestPlanetDistance = 100000;
    this.nearestPlanet = null;
    this.velocityX = 1;
    this.velocityY = 1;

    this.drawRocketShip = function(){
        fill(200,200,200);
        rect(this.posX, this.posY, 20, 50);

        // let gravity of planets affect ship
        // nearest planet

        for(var i = 0; i < planets.length; i++){
            if(dist(planets[i].posX, planets[i].posY, this.posX, this.posY) < this.nearestPlanetDistance && planets[i] != this.nearestPlanet){
                this.nearestPlanet = planets[i];
                this.nearestPlanetDistance = dist(this.nearestPlanet.posX, this.nearestPlanet.posY, this.posX, this.posY);
            }
        }

        this.nearestPlanetDistance = dist(this.nearestPlanet.posX, this.nearestPlanet.posY, this.posX, this.posY);

        var dx = (this.nearestPlanet.posX - this.posX);
        var dy = (this.nearestPlanet.posY - this.posY);

        this.posX += this.velocityX;
        this.posY += this.velocityY;
        this.posX += dx * (this.nearestPlanet.gravity / this.nearestPlanetDistance);
        this.posY += dy * (this.nearestPlanet.gravity / this.nearestPlanetDistance);

        stroke(200);
        line(this.posX, this.posY, this.nearestPlanet.posX, this.nearestPlanet.posY);
    }
}