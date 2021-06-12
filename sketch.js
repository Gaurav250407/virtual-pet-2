//Create variables here
var dog,dog_img,dog_img2,food,food_img,database;
var foodRef,foodStock;
var fedTime,lastFed;

function preload()
{
  //load images here
  dog_img=loadImage("images/dogImg.png")
  dog_img2=loadImage("images/dogImg1.png")
  
}

function setup() {
  createCanvas(1000, 700);
  
  database=firebase.database();

  foodRef=database.ref('Food');
  foodRef.on('value',readStock);

  dog=createSprite(400,350,50,50)
  dog.addImage(dog_img); 
  dog.scale=0.3 

  feed=createButton('Feed Tom');
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton('Add Food');
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  foodObj=new Food();
}


function draw() {  

  background(0);
  drawSprites();
  //add styles here


      fill(255);
      textSize(30);
      text("Current Food Stock in the inventory is:" +foodObj.getFoodStock(),150,600);
      

      if(lastFed>=12){
        text("Last Feed"+lastFed%12+" PM ",350,30)
      }
      else if(lastFed===0)
      {
        text("Last Feed: 12 AM",350,30)
      }
      else
      text("Last Feed "+lastFed+" AM ",350,30);
      

      fedTime=database.ref('FeedTime')
      fedTime.on('value',function(value)
      {
        lastFed=value.val()
      })

      foodObj.display();

      
    /*  if(keyWentDown(UP_ARROW))
      {
        writeStock(foodStock);
        dog.addImage(dog_img2)
      }
    */
}

function readStock(readData)
{
  foodStock=readData.val();
  foodObj.updateFoodStock(foodStock);
}

function addFoods()
{
  foodStock++;
  database.ref('/').update({
    Food:foodStock
  })
}

function feedDog()
{
  dog.addImage(dog_img2);
  if(foodObj.getFoodStock<=0)
  {
    foodObj.updateFoodStock(0);
  }
  else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  }
  database.ref('/').update(
    {
      Food:foodObj.getFoodStock(),
      FeedTime:hour()
      
    }
  )
  console.log(hour());
}