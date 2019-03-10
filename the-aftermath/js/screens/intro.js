game.IntroScreen1 = me.ScreenObject.extend({
  onResetEvent: function() {
    var backgroundImage = new me.Sprite(0, 0, {
      image: me.loader.getImage("intro_screen_one")
    });
    backgroundImage.anchorPoint.set(0,0);
    backgroundImage.scale(me.game.viewport.width/backgroundImage.width, me.game.viewport.height / backgroundImage.height);
    me.game.world.addChild(backgroundImage, 1);
    me.game.world.addChild(new (me.Renderable.extend({
      init: function() {
        this._super(me.Renderable, 'init', [0,0, me.game.viewport.width, me.game.viewport.height]);
        this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'), 0.5);
        this.font.textAlign = "right";
        this.font.textBaseline = "bottom";
        this.font.alpha = 0.6;
      },
      update: function(dt) {
        return true;
      },
      draw: function(renderer) {
        this.font.draw(renderer, "Continue (ENTER)",me.game.viewport.width + this.pos.x - 20, me.game.viewport.height + this.pos.y -20);
      }
    })), 2);
    me.input.bindKey(me.input.KEY.ENTER, "enter", true);
    this.handler = me.event.subscribe(me.event.KEYDOWN, function(action, keyCode, edge) {
      if(action == 'enter'){
        me.state.change(me.state.PLAY);
      }
    });
  },
  onDestroyEvent: function() {
    me.input.unbindKey(me.input.KEY.ENTER);
    me.event.unsubscribe(this.handler);
  }
});