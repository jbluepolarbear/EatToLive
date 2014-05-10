window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

var game = new Game;

var lastRPress = false;

addMouseDownCallback(function(mousePos) {
  if (!game.running)
    game = new Game;
});

setInterval(function() {
  if (game.running)
  {
    game.update();
  }
  game.draw();
  
  var curRPressed = Key.isDown(Key.R);
  if (!lastRPress && !!curRPressed)
    game = new Game;
  lastRPress = curRPressed;
}, game.framerate);