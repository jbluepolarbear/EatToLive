/**
 * Utility functions
 */
 var Colors = {
  EarthYellow: [225, 169, 95],
  Sand: [194, 178, 128],
  SandDune: [150, 113, 23],
  Cyan: [0, 255, 255],
  AliceBlue: [240, 248, 255],
  Red: [196, 2, 51],
  FireBrickRed: [178, 34, 34],
  Black: [0, 0, 0]
}

/*
 * Mouse Event and Pos
 */
var mouseDownEventCallbacks = [];

function addMouseDownCallback(func) {
  mouseDownEventCallbacks.push(func);
}
 
function mouseDownEvent(event) {
  var mousePos = {x:0, y:0};
  
  var canvas = document.getElementById("gameScreen");
  var blockSizeX = canvas.width / game.width;
  var blockSizeY = canvas.height / game.height;
  
  mousePos.x = clamp(Math.floor(event.pageX / blockSizeX), 0, 31);
  mousePos.y = clamp(Math.floor(event.pageY / blockSizeY), 0, 31);
  for (var index = 0; index < mouseDownEventCallbacks.length; ++index)
  {
    mouseDownEventCallbacks[index](mousePos);
  }
  //alert("x:" + mousePos.x + " | y:" + mousePos.y);
}

function clearMouseCallbackEvents() {
  mouseDownEventCallbacks = [];
}

/*
 * Math utility
 */
function clamp(x, a, b) {
  return Math.min(Math.max(x, a), b)
}

/*
 * highScore functions
 */
function GetHighScore(currScore) {
  var highScore = getCookie("HowLowCanWeGoHighScore");
  if (highScore === "" || Number(highScore) < currScore)
  {
    highScore = currScore;
    setCookie("HowLowCanWeGoHighScore", highScore.toString(), 30);
  }
  return highScore;
}
 
function setCookie(name,value,days) {
  if (days)
  {
    var date = new Date();
    date.setTime(date.getTime()+days*24*60*60*1000); // ) removed
    var expires = "; expires=" + date.toGMTString(); // + added
  }
  else
    var expires = "";
  document.cookie = name+"=" + value+expires + ";path=/"; // + and " added
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
    {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
  return "";
}
