var game = {
  data: {
    score: 0,
    parts: 0
  },
  "onload": function() {
    //Initialize the video
    if(!me.video.init(640,480,{wrapper: 'canvas', scale : 1.0})) {
      alert("You'r browser isn't working, yo");
      return;
    }
    // add "#debug" to the URL to enable the debug Panel
    if (me.game.HASH.debug === true) {
      window.onReady(function () {
        me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
      });
    }
    //Initialize the audio
    me.audio.init("m4a,ogg");
    // Set a callback to run when loading is complete.
    me.loader.onload = this.loaded.bind(this);
    // Load the resources.
    me.loader.preload(game.resources);
    // Initialize melonJS and display a loading screen.
    me.state.change(me.state.LOADING);
  },
  // Run on game resources loaded.
  "loaded" : function () {
    me.state.set(me.state.MENU, new game.TitleScreen());
    me.state.set(me.state.INTRO, new game.IntroScreen1());
    me.state.set(me.state.PLAY, new game.PlayScreen());
    // add our player entity in the entity pool
    me.pool.register("mainPlayer", game.PlayerEntity);
    me.pool.register("FuelEntity", game.FuelEntity);
    me.pool.register("Engine", game.Engine);
    me.pool.register("Ship", game.Ship);
    me.pool.register("EnemyEntity", game.EnemyEntity);
    // enable the keyboard
    me.input.bindKey(me.input.KEY.LEFT,   "left");
    me.input.bindKey(me.input.KEY.RIGHT,  "right");
    me.input.bindKey(me.input.KEY.SPACE,  "jumpSpace", true);
    me.input.bindKey(me.input.KEY.UP,     "jumpUp", true);

    // Start the game.
    me.state.change(me.state.MENU);
  }
}