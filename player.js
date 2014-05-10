var Player = function() {
  this.size = 1.0;
  
  this.pos = {x:0, y:0};
  this.vel = 0.5;
  
  this.framesToShrink = 60 * 0.25;
  this.growAmount = 0.5;
  this.shrinkAmount = 0.1;
  this.lastFrameAte = 0;
  this.lastFrame = 0;
  
  this.color = Colors.FireBrickRed;
  
  this.moving = false;
  this.moveToPos = {x:0, y:0};
  
  var obj = this;
  addMouseDownCallback(function(mousePos) {
    obj.moving = true;
    obj.moveToPos.x = mousePos.x;
    obj.moveToPos.y = mousePos.y;
  });
  
  this.alive = true;
};

Player.prototype = Object.create(Player.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(frame) {
  if (Key.isDown(Key.LEFT) || Key.isDown(Key.A))
  {
    this.pos.x -= this.vel;
    this.moving = false;
  }
  if (Key.isDown(Key.RIGHT) || Key.isDown(Key.D))
  {
    this.pos.x += this.vel;
    this.moving = false;
  }
  if (Key.isDown(Key.DOWN) || Key.isDown(Key.S))
  {
    this.pos.y += this.vel;
    this.moving = false;
  }
  if (Key.isDown(Key.UP) || Key.isDown(Key.W))
  {
    this.pos.y -= this.vel;
    this.moving = false;
  }
  
  if (!!this.moving)
  {
    var diffX = this.moveToPos.x - this.pos.x;
    var diffY = this.moveToPos.y - this.pos.y;
    var dist = Math.sqrt(diffX*diffX+diffY*diffY);
    if (dist > 0.5)
    {
      this.pos.x += diffX / dist * this.vel;
      this.pos.y += diffY / dist * this.vel;
    }
    else
    {
      this.moving = false;
    }
  }
    
  if (frame - this.lastFrameAte > this.framesToShrink)
  {
    this.size -= this.shrinkAmount;
    if (this.size < 0.0)
    {
      this.size = 0.0;
      this.alive = false;
    }
    this.lastFrameAte = frame;
  }
  
  // clamp pos
  if (this.pos.x < 0.0)
    this.pos.x = 0.0;
  if (this.pos.x >= game.width)
    this.pos.x = (game.width - 1.0);
  if (this.pos.y >= game.height)
    this.pos.y = (game.height - 1.0);
  if (this.pos.y < 0.0)
    this.pos.y = 0.0;
    
  this.lastFrame = frame;
};

Player.prototype.grow = function() {
  this.size += this.growAmount;
  this.lastFrameAte = this.lastFrame;
};

Player.prototype.draw = function(fb) {  
  var sizeL = Math.floor(this.size / 2.0);
  //var sizeH = Math.ceil(this.size / 2.0);
  
  for (var x = this.pos.x - sizeL; x < this.pos.x + sizeL + 1.0; ++x)
  {
    for (var y = this.pos.y - sizeL; y < this.pos.y + sizeL + 1.0; ++y)
    {
      var diffX = this.pos.x - x;
      var diffY = this.pos.y - y;
      var dist = Math.sqrt(diffX*diffX+diffY*diffY);
      
      var t = Math.min(dist / (sizeL + 1.0), 1.0);
      
      var outX = Math.floor(x);
      var outY = Math.floor(y);
      
      if (outX >= 0.0 && outX < game.width &&
          outY >= 0.0 && outY < game.height)
      {
        fb[outX][outY] = Blend.Lerp(this.color,
                                   fb[outX][outY],
                                   t);
      }
    }
  }
  
};
