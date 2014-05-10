var Absorbable = function(x, y) {
  this.initialize(x, y);
};
Absorbable.prototype = Object.create(Absorbable.prototype);
Absorbable.prototype.constructor = Absorbable;

Absorbable.prototype.initialize = function(x, y) {
  this.size = 4.0;
  
  this.pos = {x:x, y:y};
  this.vel = 0.05;
  this.dir = {x:Math.random(), y:Math.random()};
  
  if (this.dir.x === 0.0 || this.dir.y === 0)
  {
    this.dir.x = 1.0;
    this.dir.y = 1.0;
  }
  
  var len = Math.sqrt(this.dir.x*this.dir.x + this.dir.y*this.dir.y);
  this.dir.x = this.dir.x / len;
  this.dir.y = this.dir.y / len;
  
  this.framesToShrink = 60 * 10;
  this.growAmount = 0.5;
  this.shrinkAmount = 0.1;
  this.lastFrameAte = 0;
  
  this.color = Colors.Cyan;
  
  this.alive = true;
  this.index = 0;
};

Absorbable.prototype.update = function(frame, player) { 
  var diffX = this.pos.x - player.pos.x;
  var diffY = this.pos.y - player.pos.y;
  var dist = Math.sqrt(diffX*diffX+diffY*diffY);
  
  if (dist < 2.0)
  {
    this.alive = false;
  }
  else if (dist < 6.0)
  {
    this.dir.x = diffX / dist;
    this.dir.y = diffY / dist;
  }
 
  this.pos.x += this.dir.x * this.vel;
  this.pos.y += this.dir.y * this.vel;
    
  var sizeL = Math.floor(this.size / 2.0);
  // clamp pos
  if (this.pos.x < -sizeL)
    this.pos.x = (game.width - 1.0) + sizeL;
  if (this.pos.x >= game.width + sizeL)
    this.pos.x = -sizeL;
  if (this.pos.y >= game.height + sizeL)
    this.pos.y = -sizeL;
  if (this.pos.y < -sizeL)
    this.pos.y = (game.height - 1.0) + sizeL;
};

Absorbable.prototype.draw = function(fb) {  
  var sizeL = Math.floor(this.size / 2.0);
  
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
