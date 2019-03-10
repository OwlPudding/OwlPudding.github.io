game.HUD = game.HUD || {};
game.HUD.Container = me.Container.extend({
  init: function () {
    this._super(me.Container, 'init');
    this.isPersistent = true;
    this.floating = true;
    this.name = "HUD";
    this.addChild(new game.HUD.ScoreItem(-10, -10));
  }
});
game.HUD.ScoreItem = me.Renderable.extend( {
  init : function (x, y) {
    this._super(me.Renderable, 'init', [x, y, 10, 10]);
    this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'), 0.5);
    this.font.textAlign = "right";
    this.font.textBaseline = "bottom";
    this.score = -1;
  },
  update : function (dt) {
    if (this.score !== game.data.score) {
      this.score = game.data.score;
      return true;
    }
    return false;
  },
  draw : function (renderer) {
    if(me.levelDirector.getCurrentLevelId() == "area01") {
      this.font.draw(renderer, "fuel: " + game.data.score + "/20", me.game.viewport.width + this.pos.x - 20, me.game.viewport.height + this.pos.y -20);
      this.font.draw(renderer, "parts: " + game.data.parts, me.game.viewport.width + this.pos.x , me.game.viewport.height + this.pos.y );
    } else if(me.levelDirector.getCurrentLevelId() == "area02") {
      this.font.draw(renderer, "fuel: " + game.data.score + "/40", me.game.viewport.width + this.pos.x - 20, me.game.viewport.height + this.pos.y -20);
      this.font.draw(renderer, "parts: " + game.data.parts, me.game.viewport.width + this.pos.x , me.game.viewport.height + this.pos.y );
    }
  }
});