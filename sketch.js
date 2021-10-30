/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var jungle, invisiblejungle;
var kangaroo , invisible_ground , shrubsGroup;
var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;

function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.3
  jungle.x = width /2;

  //kangaroo sprite
  kangaroo = createSprite(50,315,0,0);
  kangaroo.addAnimation("running", kangaroo_running);
  kangaroo.addAnimation("collided", kangaroo_collided);
  kangaroo.scale = 0.15;
  kangaroo.setCollider("circle",0,0,300)

  //invisible ground
  invisible_ground = createSprite(400,350,1600,10);
  invisible_ground.visible = false;

  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background(255);
  
  kangaroo.x = camera.position.x-270;

  if(gameState === PLAY){
    jungle.velocityX = -5;
    if(jungle.x<100){
      jungle.x = 400
    }

    if(keyDown("space")&& kangaroo.y>275) {
      jumpSound.play();
      kangaroo.velocityY = -15;
    }
    kangaroo.velocityY = kangaroo.velocityY + 0.8;

    kangaroo.collide(invisible_ground);

    if(obstaclesGroup.isTouching(kangaroo)){
      collidedSound.play();
      gameState = END;
    }
    if(shrubsGroup.isTouching(kangaroo)){

      shrubsGroup.destroyEach();
      score = score+1;
    }
  }
  else if (gameState === END) {
    kangaroo.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);

    kangaroo.changeAnimation("collided",kangaroo_collided);

    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
    
  }

  spawnShrubs();
  spawnObstacles();
  drawSprites();
  textSize (30)
  fill("green")
  text("Score : "+score,650,40);

}

function spawnShrubs (){
  if(frameCount % 150 === 0){
    var shrub = createSprite(camera.position.x+500,330,40,10);
    shrub.velocityX = -5;
    shrub.scale = 0.5;

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: shrub.addImage(shrub1);
      break;
      case 2: shrub.addImage(shrub2);
      break;
      case 3: shrub.addImage(shrub3);
      break;
      default: break;
    }
          
    shrub.scale = 0.05;
    shrub.lifetime = 400;
    shrub.setCollider("rectangle",0,0,shrub.width/2,shrub.height/2)
    shrubsGroup.add(shrub);
  }
}

function spawnObstacles() {
  if(frameCount % 130 === 0) {
    var obstacle = createSprite(camera.position.x+400,330,40,10);
    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -5;
    obstacle.scale = 0.15;            
    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);
  }
}