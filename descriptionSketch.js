var stars;
var canvas;

var setup = function(){
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.class('canvas_space');
    background(20,20,20);

    stars = [];

    for(var i = 0; i < 100; i++){
        stars[i] = new star(random(-100, width + 100), random(-100, height + 100));
    }
}

var draw = function(){
    background(20,20,20);
    for(var i = 0; i < stars.length; i++){
        stars[i].drawStar();
        if(dist(mouseX, mouseY, stars[i].position.x, stars[i].position.y) < 100){
            stroke(200, 200, 0);
            line(mouseX, mouseY, stars[i].position.x, stars[i].position.y);
            noStroke();
        }
    }
}

var star = function(posX, posY){
    this.position = createVector(posX, posY);
    this.size = round(random(2, 5));
    this.speed = 0.5;

    this.drawStar = function(){
        fill(200,200,0);
        ellipse(this.position.x, this.position.y, this.size, this.size);
        this.position.y -= this.speed;        
        if(this.position.y <= -100){
            this.position.y = height;
        }
    }
}