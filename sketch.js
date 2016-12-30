// Space Game

var gameState;

// menu
var mainMenu;
var earthObjects;

// global variables

var player;
var planets;
var backgroundLayer_1;
var backgroundLayer_2;
var backgroundLayer_3;

var particles_rocket_main;
var particles_rocket_left;
var particles_rocket_right;

var blackHole;
var earth;

// SETUP FUNCTION

var setup = function(){
    createCanvas(windowWidth, windowHeight);
    background(20,20,20);
    rectMode(CENTER);

    gameState = 0;
    mainMenu = new mainMenu();

    earthObjects = [];
    for(var i = 0; i < 100; i++){
        earthObjects[i] = new earthObject(random(width / 2 - (height / 5 / 2), width / 2 + (height / 5 / 2)), random(height / 1.5 - (height / 5 / 2), height / 1.5 + (height / 5 / 2)));
    }

    player = new rocketShip(width / 2, height / 2);
    planets = [];
    for(var i = 0; i < 3; i++){
        planets.push(new planet(random(0, width), random(0, height), random(50, 150)));
    }

    backgroundLayer_1 = [];
    backgroundLayer_2 = [];
    backgroundLayer_3 = [];

    for(var i = 0; i < 300; i++){
        backgroundLayer_1[i] = new backgroundDetail(random(-width, width * 2), random(-height, height * 2), i);
        backgroundLayer_2[i] = new backgroundDetail(random(-width, width), random(-height, height), i);
    }

    for(var i = 0; i < 500; i++){
        backgroundLayer_3[i] = new backgroundDetail(random(0, width), random(0, height), i);
    }

    particles_rocket_main = [];
    for(var i = 0; i < 50; i++){
        // parent, posX, posY, r, g, b, dirX, dirY, decaySpeed, size, speed
        particles_rocket_main[i] = new particle(player, player.position.x, player.position.y, 200, 200, 0, random(-1,1), 1, random(5, 8), random(8,10), 3);
    }

    blackHole = new blackHole(width / 2, height * 2);
    earth = new earth(player.fPosition.x, player.fPosition.y);
}

// DRAW

var draw = function(){
    if(gameState == 0){
        background(20,20,20);
        mainMenu.drawScreen();
    }
    if(gameState == 1){
        background(20,20,20);
        textSize(12);

        for(var i = 0; i < backgroundLayer_3.length; i++){
            backgroundLayer_3[i].drawDetail();
        }

        // draw background
        // back layer
        for(var i = 0; i < backgroundLayer_2.length; i++){
            push();
            translate(player.position.x * (0.6 - i / backgroundLayer_2.length) - width / 2, player.position.y * (0.6 - i / backgroundLayer_2.length) - height / 2);
            backgroundLayer_2[i].drawDetail();
            pop();
        }

        // front layer
        for(var i = 0; i < backgroundLayer_1.length; i++){
            push();
            //translate(player.position.x * (0.8 - i / backgroundLayer_1.length) - width / 2, player.position.y * (0.8 - i / backgroundLayer_1.length) - height / 2);
            translate(player.position.x * 0.8 - width / 2, player.position.y * 0.8 - height / 2);
            backgroundLayer_1[i].drawDetail();
            pop();
        }
        push();
        translate(player.position.x - width / 2, player.position.y - height / 2);

        // draw planets
        for(var i = 0; i < planets.length; i++){
            planets[i].drawPlanet();
        }

        noStroke();

        // draw earth
        earth.drawEarth();

        // draw black hole
        blackHole.drawBlackHole();
        pop();

        // draw player
        player.drawRocketShip();
    }
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
    this.color = color(this.r, this.g, this.b);
    this.crashed = false;

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
        stroke(this.color);
        ellipse(this.position.x, this.position.y, this.size, this.size);
        noStroke();
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
        text(round(dist(this.position.x, this.position.y, width / 2 - (player.position.x - width / 2), height / 2 - (player.position.y - height / 2))), this.position.x, this.position.y);

        stroke(255);
        strokeWeight(2);

        if(player.nearestPlanet == this){
            this.color = color(255,255,255);
            if(player.nearestPlanetDistance < this.size / 2 && this.crashed == false){
                player.force *= -1;
                this.crashed = true;
            }
        } else {
            this.color = color(this.r, this.g, this.b);
        }
    }
}

var rocketShip = function(posX, posY){
    this.position = createVector(posX, posY);
    this.nearestPlanetDistance = 100000;
    this.nearestPlanet = null;
    this.velocityX = 1;
    this.velocityY = 1;
    this.force = 0;
    this.maxForce = 15;
    this.rotation = 0;
    this.direction = createVector(0,0);
    this.fPosition = createVector(width / 2 - (this.position.x - width / 2), height / 2 - (this.position.y - height / 2));

    // ACTUAL PLAYER POSITION --> width / 2 - (player.position.x - width / 2), height / 2 - (player.position.y - height / 2)

    this.drawRocketShip = function(){        
        noStroke();
        // draw engine particles
        // main engine
        for(var i = 0; i < particles_rocket_main.length; i++){
            particles_rocket_main[i].drawParticle(this.position);
        }

        // draw rocketship
        push();
        // translate(this.position.x, this.position.y);
        translate(width / 2, height / 2);
        rotate(radians(this.rotation));

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
            if(dist(planets[i].position.x, planets[i].position.y, width / 2 - (player.position.x - width / 2), height / 2 - (player.position.y - height / 2)) < this.nearestPlanetDistance && planets[i] != this.nearestPlanet){
                this.nearestPlanet = planets[i];
                this.nearestPlanetDistance = dist(this.nearestPlanet.position.x, this.nearestPlanet.position.y, width / 2 - (player.position.x - width / 2), height / 2 - (player.position.y - height / 2));
            }
        }

        this.nearestPlanetDistance = dist(this.nearestPlanet.position.x, this.nearestPlanet.position.y, width / 2 - (player.position.x - width / 2), height / 2 - (player.position.y - height / 2));

        var dx = (this.nearestPlanet.position.x - this.position.x);
        var dy = (this.nearestPlanet.position.y - this.position.y);

        //this.force.add(1 * (this.nearestPlanet.position.x - this.position.x) / this.nearestPlanetDistance ^ 2, 1 * (this.nearestPlanet.position.y - this.position.y) / this.nearestPlanetDistance ^ 2);

        textAlign(LEFT);
        fill(255);
        text("Magnitude: " + this.position.mag(), 20, 40);
        text("Rotation: " + this.rotation, 20, 60);       
        text("Direction X: " + this.direction.x, 20, 80);
        text("Direction Y: " + this.direction.y, 20, 100);
        text("Velocity: " + this.force, 20, 120);
        text("--------", 20, 140);
        text("Planets: " + planets.length, 20, 160);
        text("--------", 20, 180);
        text("Position X: " + (this.position.x - width / 2), 20, 200);
        text("Position Y: " + (this.position.y - height / 2), 20, 220);
        text("FPS: " + round(frameRate()), 20, 240);

        // APPLY FORCE ON SHIP
        // this.position.add(this.force * this.position.heading());

        /*
        if(this.rotation > 90 && this.rotation < 260){
            this.position.y -= this.force;
        } else {
            this.position.y += this.force;
        }
        // left
        if(this.rotation > 180){
            this.position.x += this.force * 1;
        } else
        // right
        if(this.rotation < 180 && this.rotation > 0){
            this.position.x += this.force * -1;
        }
        */

        
        if(this.rotation > -90 && this.rotation < 0){
            this.direction.x = this.rotation / 90;
        } else if(this.rotation > -180 && this.rotation < -90){
            this.direction.x = -(1 + (this.rotation / 90 + 1));
        } else if(this.rotation > 0 && this.rotation < 90){
            this.direction.x = this.rotation / 90;
        } else if(this.rotation > 90 && this.rotation < 180){
            this.direction.x = 1 - (this.rotation / 90 - 1);
        }

        if(this.rotation > -90 && this.rotation < 0){
            this.direction.y = 1 - (-this.rotation / 90);
        } else if(this.rotation >= 0 && this.rotation < 90){
            this.direction.y = 1 - (this.rotation / 90);
        } else if(this.rotation >= 90 && this.rotation <= 180){
            this.direction.y = 1 - this.rotation / 90;
        } else if(this.rotation >= -180 && this.rotation <= -90){
            this.direction.y = 1 + (this.rotation / 90);
        }

        this.position.x -= this.direction.x * this.force;
        this.position.y += this.direction.y * this.force;
        
        // this.position.x -= dx * (this.nearestPlanet.gravity / this.nearestPlanetDistance);
        // this.position.y += dy * (this.nearestPlanet.gravity / this.nearestPlanetDistance);

        // stroke(200);
        // line(width / 2, height / 2, this.nearestPlanet.position.x - this.position.x, this.nearestPlanet.position.y);

        // INPUT

        if(keyIsDown(87)){
            if(this.force <= this.maxForce){
                this.force += 0.1;
            }
            if(particles_rocket_main[0].moving == false){                
                for(var i = 0; i < 50; i++){                
                    particles_rocket_main[i].stopMoving = false;
                }
            }
        } else
        if(keyIsDown(83)){
            this.force -= 0.1;
        }

        if(this.force > 1){
            this.force -= 0.02;
        }

        if(keyIsDown(65)){
            this.rotation -= 2;
            if(this.rotation < -180){
                this.rotation = 180;
            }
        } else
        if(keyIsDown(68)){
            this.rotation += 2;
            if(this.rotation > 180){
                this.rotation = -180;
            }
        }

        this.fPosition = createVector(width / 2 - (this.position.x - width / 2), height / 2 - (this.position.y - height / 2));
    }
}

var keyReleased = function(){
    if(keyCode == 87){
        for(var i = 0; i < 50; i++){
            particles_rocket_main[i].stopMoving = true;
        }
    }
}

var backgroundDetail = function(posX, posY, index){
    this.position = createVector(posX, posY);
    this.r = 200;
    this.g = 200;
    this.b = 0;
    this.size = random(0, 5);
    this.opacity = 255;
    this.index = index;

    this.drawDetail = function(){
        // fill(this.r, this.g, this.b);        
        noStroke();               
        fill(this.r, this.g, this.b, this.opacity);
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
    this.fSize = size;
    this.direction = createVector(dirX, dirY);
    this.stopMoving = true;
    this.moving = false;
    this.fade = true;
    this.decaySpeed = decaySpeed;
    this.speed = speed;

    this.drawParticle = function(parentPosition){
        // draw particle
        push();
        translate(this.position.x, this.position.y);
        fill(this.r, this.g, this.b, this.opacity);
        ellipse(0, 0, this.size, this.size);
        pop();
        // move particle
        if(this.moving){
            this.position.x += this.direction.x * this.speed;
            this.position.y += this.direction.y * this.speed;
        }
        // fadeout
        if(this.fade){
            if(this.opacity > 0){
                this.opacity -= decaySpeed;
                this.size -= 0.2;
            } else {
                this.resetParticle();
            }
        }
    }

    this.resetParticle = function(){
        // this.startPosition.x = this.parent.position.x;
        // this.startPosition.y = this.parent.position.y + 20;
        // this.position.x = this.startPosition.x;
        // this.position.y = this.startPosition.y;

        this.position.x = width / 2;
        this.position.y = height / 2;

        this.direction.x = -this.parent.direction.x;
        this.direction.y = this.parent.direction.y;
        this.opacity = 255;
        this.size = this.fSize;

        if(this.stopMoving){
            this.moving = false;
        } else {
            this.moving = true;
        }
    }

}

var blackHole = function(posX, posY){
    this.position = createVector(posX, posY);
    this.speed = 0.5;
    this.size = width / 1.2;

    this.drawBlackHole = function(){
        for(var i = 10; i > 0; i--){
            fill(255, 200, 0, i);
            ellipse(this.position.x, this.position.y, width / 1.2 + i * 30, width / 1.2 + i * 30);    
        }
        for(var i = 0; i < 20; i++){
            var size = random(width / 1.2, width / 1.3);            
            fill(0,0,0,0);
            stroke(random(200, 255), random(200, 255), 0);
            ellipse(this.position.x, this.position.y, size, size);
        }

        fill(255, 230, 0);
        ellipse(this.position.x, this.position.y, width / 1.28, width / 1.28);
        noStroke();
        // black center
        fill(0,0,0);
        ellipse(this.position.x, this.position.y, width / 1.3, width / 1.3);

        // drag everything towards it
        for(var i = 0; i < planets.length; i++){
            if(dist(planets[i].position.x, planets[i].position.y, this.position.x, this.position.y) < 300){
                if(planets[i].position.x < this.position.x){
                    planets[i].position.x++;
                } else {
                    planets[i].position.x--;
                }
                if(planets[i].position.y < this.position.y){
                    planets[i].position.y++;
                } else {
                    planets[i].position.y--;
                }
            }
            if(dist(planets[i].position.x, planets[i].position.y, this.position.x, this.position.y) < 50){
                if(planets[i].size > 0){
                    planets[i].size--;
                } else {
                    planets.splice(planets[i].id, 1);
                }
            }
        }

        // move it

        if(this.position.x < player.fPosition.x){
            this.position.x += this.speed;
        } else {
            this.position.x -= this.speed;
        }
        if(this.position.y < player.fPosition.y){
            this.position.y += this.speed;
        } else {
            this.position.y -= this.speed;
        }
    }
}

var earth = function(posX, posY){
    this.size = 400;
    this.position = createVector(posX, posY + this.size / 2);

    this.drawEarth = function(){
        fill(0, 50, 255);
        ellipse(this.position.x, this.position.y, this.size, this.size);
    }
}

// MENU

var mainMenu = function(){
    this.drawScreen = function(){
        noStroke();
        fill(10, 10, 10);
        rect(width / 2, height / 2, width, height);
        // window area
        fill(20,20,20);
        rect(width / 2, height / 5 + (height / 5 * 3) / 2, width, (height / 5) * 3);
            // stars
            for(var i = 0; i < backgroundLayer_3.length; i++){
                backgroundLayer_3[i].drawDetail();
            }
            // earth
            fill(0, 50, 255);
            ellipse(width / 2, height / 1.5, height / 5, height / 5);
            for(var i = 0; i < earthObjects.length; i++){
                earthObjects[i].drawObject();
            }
            // black hole           
            for(var i = 10; i > 0; i--){
                fill(255, 200, 0, i);
                ellipse(width / 2, 0, height *  1.2 + i * 30, height *  1.2 + i * 30);    
            }            
            fill(0,0,0);
            ellipse(width / 2, 0, height, height); 
            for(var i = 0; i < 20; i++){
                var size = random(height * 1, height * 1.1);            
                fill(0,0,0,0);
                stroke(random(200, 255), random(200, 255), 0);
                ellipse(width / 2, 0, size, size);
            }
            noStroke();
        // top area
        fill(10, 10, 10);
        rect(width / 2, height / 5 / 2, width, height / 5);
        // bottom area        
        fill(10, 10, 10);
        rect(width / 2, height - height / 5 / 2, width, height / 5);
        // new game button
        fill(0, 150, 0);
        rect(width / 2, height - height / 5 / 2, width / 3, height / 8);
        fill(0,0,0,0);
        stroke(0, 255, 0);
        rect(width / 2, height - height / 5 / 2, width / 4, height / 9);
        noStroke();
        fill(0, 255, 0);
        textAlign(CENTER);
        textSize(height / 25);
        textFont('RALEWAY');
        text("NEW GAME", width / 2, height - height / 5 / 2);
        // bottom displays
        fill(0, 150, 0);
        ellipse(width / 5, height - height / 5 / 2, height / 8, height / 8);
        // sides
        fill(10,10,10);
        rect(width / 9 / 2, height / 2, width / 9, height);        
        rect(width - width / 9 / 2, height / 2, width / 9, height);
    }
}

var earthObject = function(posX, posY){
    this.position = createVector(posX, posY);
    this.startPosition = createVector(posX, posY);
    this.opacity = 255;
    this.size = random(10, 15);
    this.b = random(200, 255);
    this.speed = random(1,2);

    this.drawObject = function(){
        fill(0, 50, this.b, this.opacity);
        ellipse(this.position.x, this.position.y, this.size, this.size);
        if(this.position.y > height / 4){
            this.position.y-= this.speed;
        } else {
            this.position.y = this.startPosition.y;
        }  
        if(this.position.y > height / 1.5){
            this.opacity = 0;
        } else {
            this.opacity = 255;
        }
    }
}

var mousePressed = function(){
    gameState = 1;
}