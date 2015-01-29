// myGame.js
// Shane DeBrock

(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();
 
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 800,
    height = 600,
    player = {
      x : width/2,
      y : height - 32,
      width : 32,
      height : 32,
      speed: 5,
      velX: 0,
      velY: 0,
      jumping: false,
      moving: false,
      grounded: false,
      dead: false,
      lives: 5
    },
    move = false,
    keys = [],
    friction = 0.8,
    gravity = 0.2;
 
    var numPlats = 25;
    var numCrests = 13;

    var counter = 0;
    var direction = 0;
 
    var collected = 0;
    var timer = 0;
    var fTime = 0;
    var time = setInterval(incTime, 1000);

    var spriteImage = new Image();
    var crestImage = new Image();
    var platImage = new Image();
    var bgImage = new Image();
    var lCarImage = new Image();
    var rCarImage = new Image();
 
    var lilSprite = sprite({
        context: canvas.getContext("2d"),
        width: 128,
        height: 128,
        image: spriteImage
        });
                 
    spriteImage.src = "content/little_sprite.png";
    crestImage.src = "content/PC.png";
    platImage.src= "content/platform.png";
    bgImage.src = "content/background.png";
    lCarImage.src = "content/Porsche-Left.png";
    rCarImage.src = "content/Porsche-Right.png";
 
 canvas.width = width;
 canvas.height = height;
 
 var platforms = [];
 genPlats();
 
 function genPlats() {
    var pX = 0, pY = 0;
    for (var i = 0; i < numPlats; i++){
        var done = false;
        pX = Math.floor(Math.random() * 5000) + 1;
        pY = Math.floor(Math.random() * height-100);
        platforms[i] = ({ x : pX,
                        y : pY,
                        width : 100,
                        height : 16
                        });
        if (i > 1){
            for (var j = 0; j < platforms.length - 1; j++){
                var dir = colCheck(platforms[i], platforms[j]);
                
                if (dir === "l") {
                    platforms[i].x += 100;
                } else if (dir == "r"){
                    platforms[i].x -= 100;
                } else if (dir == "b") {
                    platforms[i].y -= 100;
                } else if (dir == "t") {
                    platforms[i].y += 100;
                }
            }
        }
       
    }
}
 
 var crests = [];
 genCrests();
 
function genCrests() {
    var sX = 0, sY = 0;
    for (var i = 0; i < numCrests; i++) {
        sX = Math.floor(Math.random() * width) + 1;
        sY = Math.floor(Math.random() * height) + 1;
        crests[i] = ({
                      x : sX,
                      y : sY,
                      width : 20,
                      height : 22,
                      captured: false
                    });
        if (i > 1){
            for (var j = 0; j < crests.length - 1; j++){
                var dir = colCheck(crests[i], crests[j]);
                
                if (dir === "l") {
                    crests[i].x += 13;
                } else if (dir == "r"){
                    crests[i].x -= 13;
                } else if (dir == "b") {
                    crests[i].y -= 13;
                } else if (dir == "t") {
                    crests[i].y += 13;
                }
            }
        }
        
    }
}
 
 var cars = [];
 
 cars.push({
           x:1000,
           y:500,
           width:166,
           height:48,
           dir:"l"
           });
 cars.push({
           x:1000,
           y:500,
           width:166,
           height:48,
           dir:"l"
           });
 cars.push({
           x:1000,
           y:540,
           width:166,
           height:48,
           dir:"r"
           });
 cars.push({
           x:1000,
           y:540,
           width:166,
           height:48,
           dir:"r"
           });
 
 
 
function sprite (options) {
             
                var si = {};
             
                si.context = options.context;
                si.width = options.width;
                si.height = options.height;
                si.image = options.image;
             
                si.update = function() {
                    if (counter < 3)
                        counter += 1;
                    else
                        counter = 0;
                }
             
                si.render = function() {
             
                    si.context.drawImage(
                                  si.image,
                                  counter*32,
                                  direction*32,
                                  32,
                                  32,
                                  player.x,
                                  player.y,
                                  32,
                                  32);
                };
             
                return si;
}
 
function update(){
    move = false;
  // check keys
    if (keys[38] || keys[32]) {
        // up arrow or space
      if(!player.jumping){
       player.jumping = true;
       counter = 0;
       player.velY = -player.speed*2;
      }
    }
    if (keys[39]) {
        // right arrow
        if (player.velX < player.speed) {            
            player.velX++;        
         }
        move = true;
        direction = 2;
    }    
    if (keys[37]) {        
        // left arrow        
        if (player.velX > -player.speed) {
            player.velX--;
        }
        move = true;
        direction = 1;
    }
    
    if (move == true){
        player.moving = true;
    }
    else if (player.jumping == false){
        player.moving = false;
        counter = 1;
    }
    else {
        player.moving = false;
    }
 
    player.velX *= friction;
 
    player.velY += gravity;
    
    ctx.clearRect(0,0,width,height);
    ctx.drawImage(bgImage,0,0);
    ctx.fillStyle = "black";
    ctx.beginPath();
    
    for (var i = 0; i < crests.length; i++) {
        if (crests[i].captured == false){
            ctx.drawImage(crestImage,crests[i].x,crests[i].y);
            var col = colCheck(player, crests[i]);
            
            if (col != null){
                crests[i].captured = true;
                collected++;
            }
        }
        
    }
    
    for (var i = 0; i < platforms.length; i++){
        if (platforms[i].x-1 < 0-platforms[i].width){
            platforms[i].x = 5000;
        }
        else {
            platforms[i].x--;
        }
    }
    
    for (var i = 0; i < cars.length; i++){
        if (cars[i].dir == "l"){
            if (cars[i].x-1 < 0-cars[i].width){
                cars[i].x = 3000;
            }
            else {
                cars[i].x -= 4;
            }
        }
        else if (cars[i].dir == "r"){
            if (cars[i].x+1 > 3000){
                cars[i].x = 0-cars[i].width;
            }
            else {
                cars[i].x += 5;
            }
        }
    }
    
    
    player.grounded = false;
    
    for (var i = 0; i < platforms.length; i++) {
        ctx.drawImage(platImage, platforms[i].x, platforms[i].y);
        
        var dir = colCheck(player, platforms[i]);
        
        if (dir === "l" || dir === "r") {
            player.velX = 0;
            player.jumping = false;
        } else if (dir === "b") {
            player.grounded = true;
            player.jumping = false;
        } else if (dir === "t") {
            player.velY *= -0.8;
        }
        
    }
    
   for (var i = 0; i < cars.length; i++) {
        if (cars[i].dir == "l"){
            ctx.drawImage(lCarImage, cars[i].x, cars[i].y);
        }
        else {
            ctx.drawImage(rCarImage, cars[i].x, cars[i].y);
        }
        
        var dir = colCheck(player, cars[i]);
        
        if (dir != null) {
            player.dead = true;
        }
        
        
    }
    
    if(player.dead){
        if(player.lives >0){
        player.lives--;
        }
        player.y -= 49;
        player.velY = -2;
        player.jumping = true;
        direction = 0;
        player.dead = false;
    }
    
    
    if(player.grounded){
        player.velY = 0;
    }
    
    if((player.grounded == true) && (player.y < height - 33)){
        player.x -= 2;
    }
 
    player.x += player.velX;
    player.y += player.velY;
 
    if (player.x >= width-player.width) {
        player.x = width-player.width;
    } else if (player.x <= 0) {        
        player.x = 0;    
    }   
  
    if(player.y >= height-player.height){
        player.y = height - player.height;
        player.jumping = false;
    }

    if ((player.jumping == false) && (player.moving == true)){
        lilSprite.update();
    }
  lilSprite.render();
    
    ctx.font = "20px Impact";
    ctx.fillStyle="#000000";
    ctx.fillText("TIMER: ",18,25);
    ctx.fillText(timer,80,25);
    
    ctx.font = "20px Impact";
    ctx.fillStyle="#000000";
    ctx.fillText("LIVES: ",350,25);
    ctx.fillText(player.lives,400,25);
    
    ctx.fillText("CRESTS COLLECTED: ",width-185,25);
    ctx.fillText(collected,width-25,25);
    
    if (collected == 13 && player.lives >= 0){
        if (fTime == 0){
            fTime = timer;
        }
        
        ctx.fillStyle="rgba(0,0,0, 0.5)";
        ctx.fillRect(0,0,width,height);
        ctx.font = "65px Impact";
        ctx.fillStyle="#FFFFFF";
        ctx.fillText("ALL CRESTS COLLECTED!!",100,250);
        ctx.fillText(fTime,230,350);
        ctx.fillText("SECONDS",350,350);

    }
    
    if (player.lives == 0 && collected<13){
        if (fTime == 0){
            fTime = timer;
        }
        
        ctx.fillStyle="rgba(0,0,0, 0.5)";
        ctx.fillRect(0,0,width,height);
        ctx.font = "65px Impact";
        ctx.fillStyle="#FFFFFF";
        ctx.fillText("GAME OVER",270,250);
        
    }
    
    
 
  requestAnimationFrame(update);
}
 
function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
    vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
    // add the half widths and half heights of the objects
    hWidths = (shapeA.width / 2) + (shapeB.width / 2),
    hHeights = (shapeA.height / 2) + (shapeB.height / 2),
    colDir = null;
    
    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side collision is occuring (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
        oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
    }
    return colDir;
}
 
 function incTime(){
    timer++;
}

 
document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
});
 
document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});
 
window.addEventListener("load",function(){
    update();
});
