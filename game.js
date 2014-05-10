// $fb.text(25,80, "text", hsv2rgb([220, rand(100), rand(100)]));
// $fb.pixel(x, y, [64, 64, 200]);
// $fb.render();
// $fb.clear([0,0,0]);
// $fb.fillcircle(80, 60, 48, [93,27,175]);

var Game = function() {
  this.width = 32;
  this.height = 32;
  this.framerate = 30;
  this.frame = 0;
  
  this.framebuffer = framebuffer(this.width, this.height, "gameScreen");
  this.gameView = this.framebuffer.makesprite(this.width, this.height);
  
  this.player = new Player;
  this.player.pos.x = Math.floor(this.width / 2.0) - 1.0;
  this.player.pos.y = Math.floor(this.height / 2.0) - 1.0;
  
  this.absorbables = [];
  this.reserveIndex = [];
  
  this.spawnTimeStep = 2 * 60.0;
  this.spawnTime = 1 * 60.0;
  this.spawnNumber = 10;
  this.lastSpawnTime = 0;
  
  this.eatenAbsorbables = 0;
  
  var canvas = document.getElementById("gameScreen");
  canvas.addEventListener("mousedown", mouseDownEvent, false);
  
  this.spawnAbsorbable(Math.floor(this.spawnNumber));
  
  this.running = true;
};

Game.prototype = Object.create(Game.prototype);
Game.prototype.constructor = Game;
  
Game.prototype.update = function() {
  this.frame += 1;
  
  if (this.frame - this.lastSpawnTime > this.spawnTime && this.spawnNumber > 0)
  {
    this.spawnAbsorbable(Math.floor(this.spawnNumber));
    this.lastSpawnTime = this.frame;
    this.spawnNumber -= 0.1;
    this.spawnTime += this.spawnTimeStep;
  }
  
  if (Key.isDown(Key.SPACE))
    this.player.grow();
  
  this.player.update(this.frame);
  if (!this.player.alive)
  {
    this.running = false;
    return;
  }
  
  for (var i = 0; i < this.absorbables.length; ++i)
  {
    if (!!this.absorbables[i].alive)
    {
      this.absorbables[i].update(this.frame, this.player);
      if (!this.absorbables[i].alive)
      {
        this.reserveIndex.push(this.absorbables[i].index);
        this.player.grow();
        this.eatenAbsorbables += 1;
      }
    }
  }
};

Game.prototype.draw = function() {
  if (!this.running)
  {
    this.GameOverScreen();
    return;
  }
  
  //clearSprite(this.gameView, Colors.Sand);
  this.gameView.clear(Colors.Sand);
  
  for (var i = 0; i < this.absorbables.length; ++i)
  {
    if (!!this.absorbables[i].alive)
    {
      this.absorbables[i].draw(this.gameView);
    }
  }
  
  this.player.draw(this.gameView);
  
  this.framebuffer.blit(this.gameView, 0, 0, 0, 0, 0, 0);

  this.framebuffer.render();
};

Game.prototype.GameOverScreen = function() {
  this.framebuffer.clear(Colors.Sand);
  
  this.framebuffer.text(0, 0, "Game", Colors.FireBrickRed);
  this.framebuffer.text(17, 3, "Over", Colors.FireBrickRed);
  
  this.framebuffer.text(0, 8, "Score:", Colors.FireBrickRed);
  this.framebuffer.text(0, 13, "\""+ this.frame +"\"", Colors.FireBrickRed); 
  
  this.framebuffer.text(0, 18, "Hi-Score:", Colors.FireBrickRed);
  this.framebuffer.text(0, 23, "\""+ GetHighScore(this.frame) +"\"", Colors.FireBrickRed);  
  
  this.framebuffer.text(0, 28, "Again:\"R\"", Colors.FireBrickRed);
  
  this.framebuffer.render();
};

Game.prototype.spawnAbsorbable = function(num) {
  for (var i = 0; i < num; ++i)
  {
    if (this.reserveIndex.length > 0)
    {
      this.absorbables[this.reserveIndex.pop()].initialize(rand(this.width), rand(this.height));
    }
    else
    {
      var absorbable = new Absorbable(rand(this.width), rand(this.height));
      absorbable.index = this.absorbables.length;
      this.absorbables.push(absorbable);
    }
  }
};