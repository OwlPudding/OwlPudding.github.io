game.PlayerEntity = me.Entity.extend({
  init: function(x, y, settings) {
    this._super(me.Entity, 'init', [x, y, settings]);
    //default horizontal and vertical speeds
    this.body.setVelocity(3, 15);
    //display follows position
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    this.alwaysUpdate = true;
    //animations
    this.renderable.addAnimation("walk", [0, 1, 2, 3]);
    this.renderable.addAnimation("stand", [0]);
    this.renderable.setCurrentAnimation("stand");
    this.resetLevel = function() {
      me.levelDirector.loadLevel(me.levelDirector.getCurrentLevelId());
      if(me.levelDirector.getCurrentLevelId() == "area02") {
        game.data.score = 20;
      } else {
        game.data.score = 0;
      }
      me.state.transition("fade","#000000", 500);
    }
  },
  update: function(dt) {
    //walking/moving
    if (me.input.isKeyPressed('left')) {
      // flip the sprite on horizontal axis
      this.renderable.flipX(true);

      // update the entity velocity
      this.body.vel.x -= this.body.accel.x * me.timer.tick;

      // change to the walking animation
      if (!this.renderable.isCurrentAnimation("walk")) {
        this.renderable.setCurrentAnimation("walk");
      }
    }
    else if(me.input.isKeyPressed('right')) {
      this.renderable.flipX(false);
      this.body.vel.x += this.body.accel.x * me.timer.tick;
      if(!this.renderable.isCurrentAnimation("walk")) {
        this.renderable.setCurrentAnimation("walk");
      }
    } else {
      this.body.vel.x = 0;
      this.renderable.setCurrentAnimation("stand");
    }
    //jumping
    if(me.input.isKeyPressed('jumpUp') || me.input.isKeyPressed('jumpSpace')) {
      if(!this.body.jumping && !this.body.falling) {
        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
        this.body.jumping = true;
      }
    }
    if(this.pos.y > me.game.viewport.height) {
      this.resetLevel();
    }
    // console.log("x: " + this.pos.x + ", y: " + this.pos.y);
    this.body.update(dt);
    me.collision.check(this);
    return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
  },
  onCollision: function(response, other) {
    switch (response.b.body.collisionType) {
      case me.collision.types.WORLD_SHAPE:
        if (other.type === "platform") {
          if (this.body.falling && !me.input.isKeyPressed('down') && (response.overlapV.y > 0) && (~~this.body.vel.y >= ~~response.overlapV.y)) {
            response.overlapV.x = 0;
            return true;
          }
          return false;
        }
        break;
      case me.collision.types.ENEMY_OBJECT:
        if ((response.overlapV.y > 0) && !this.body.jumping) {
          this.body.falling = false;
          this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
          this.body.jumping = true;
        }
        else {
          this.resetLevel();
        }
        return false;
        break;
      default:
        return false;
    }
    return true;
  }
});
game.FuelEntity = me.CollectableEntity.extend({    
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.CollectableEntity, 'init', [x, y , settings]);
  },
  onCollision : function (response, other) {
    if (response.b.body.collisionType !== me.collision.types.ENEMY_OBJECT) {
      game.data.score += 1;
      this.body.setCollisionMask(me.collision.types.NO_OBJECT);
      me.game.world.removeChild(this);
      return false;
    }
  }
});
game.Engine = me.CollectableEntity.extend( {    
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.CollectableEntity, 'init', [x, y , settings]);
  },
  onCollision : function (response, other) {
    game.data.parts += 1;
    this.body.setCollisionMask(me.collision.types.NO_OBJECT);
    me.game.world.removeChild(this);
    return false;
  }
});
game.Ship = me.CollectableEntity.extend( {    
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.CollectableEntity, 'init', [x, y , settings]);
  },
  onCollision : function (response, other) {
    game.data.parts += 1;
    this.body.setCollisionMask(me.collision.types.NO_OBJECT);
    me.game.world.removeChild(this);
    me.audio.stopTrack();
    me.state.change(me.state.MENU);
    return false;
  }
});
game.EnemyEntity = me.Entity.extend({
  init: function(x, y, settings) {
    settings.image = "rat";
    var width = settings.width;
    var height = settings.height;
    settings.framewidth = settings.width = 16;
    settings.frameheight = settings.height = 32;
    settings.shapes[0] = new me.Rect(0, 0, settings.framewidth, settings.frameheight);
    this._super(me.Entity, 'init', [x, y , settings]);
    x = this.pos.x;
    this.startX = x;
    this.endX   = x + width - settings.framewidth;
    this.pos.x  = x + width - settings.framewidth;
    this.walkLeft = false;
    this.body.setVelocity(2, 6);
    this.renderable.addAnimation("walk", [0, 1, 2, 3]);
    this.renderable.setCurrentAnimation("walk");
  },
  // enemy movement
  update : function (dt) {          
    if (this.alive) {
      if (this.walkLeft && this.pos.x <= this.startX) {
        this.walkLeft = false;
      }
      else if (!this.walkLeft && this.pos.x >= this.endX) {
        this.walkLeft = true;
      }
      this.renderable.flipX(this.walkLeft);
      this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
    }
    else {
      this.body.vel.x = 0;
    }
    this.body.update(dt);
    me.collision.check(this);
    return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
  },
  onCollision : function (response, other) {
    if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
      return false;
    }
    return true;
  }
});