game.PlayScreen = me.ScreenObject.extend({
  onResetEvent: function() {
    // load a level
    me.levelDirector.loadLevel("area01");
    // reset the score
    game.data.score = 0;
    // add our HUD to the game world
    this.HUD = new game.HUD.Container();
    me.game.world.addChild(this.HUD);
  },
  //when leaving the screen (state change)
  onDestroyEvent : function () {
    // remove the HUD from the game world
    me.game.world.removeChild(this.HUD);
  }
});