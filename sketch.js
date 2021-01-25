//Create variables here
var dog;
var happydog;
var database;
var foodS;
var foodStock=0;

var feed;
var addFood;
var fedTime;
var lastFed;
var foodObj;

var changeGameState;
var readGameState;

var bedroom;
var garden;
var washroom;

var sadDog;

function preload()
{
  //load images here
  dogImage = loadImage("Dog.png");
  happyDog = loadImage("happydog.png");

  bedroom = loadImage("images/Bed Room.png");
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/Wash Room.png");

  sadDog = loadImage("images/Lazy.png");

} 


function setup() {
  createCanvas(1000, 500);
  database = firebase.database();

  feed = createButton("Feed the dog");
  feed.position(700,20);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,20);
  addFood.mousePressed(addFoods);

  //dog sprite
  dog = createSprite(700,250,20,20);
  dog.addImage(dogImage);
  dog.scale = 0.15

  foodObj = new Food(100,250,50,50);

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  readGameState = database.ref('gameState');
  readGameState.on("value",function(data){
    gameState=data.val();
  })
  
}

function draw() {  
  background(46,139,87);
  textSize(15);
  fill("white")
  
  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeing");
    foodObj.washroom();
  }else if (currentTime>(lastFed+2) && currentTime<=(lastFed)){
    update("Bathing");
    foodObj.washroom();
   }else{
     update("Hungry")
     foodObj.display();
   }


  if(lastFed>=12){
    text("Last Feed : "+lastFed%12 + "PM", 350,30);
  }else if (lastFed==0){
    text("Last Feed : 12 AM",350,30);
  }else{
    text("Last Feed : "+ lastFed + "AM",350,30);
  }

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
     lastFed=data.val();
  });

  if(gameState !== "hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
  }else {
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }


  foodObj.display();


  drawSprites();


}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){

  if(x<=0){
    x=0
  }else{
    x=x-1
  }

  database.ref('/').update({
    Food:x
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}



