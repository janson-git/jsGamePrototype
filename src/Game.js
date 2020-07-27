
var Game = {
    fps: 60,
    g: 15,
    stopMain: undefined,
    lastTick: undefined,
    lastRender: undefined,
    tickLength: undefined,
    canvasCtx: {},
    player: {},

    init: function(canvasCtx, player) {
        this.canvasCtx = canvasCtx;
        this.player = player;

        this.lastTick = performance.now();
        this.lastRender = this.lastTick;
        this.tickLenght = 1000 / this.fps;

        this.setInitialState();
    },

    setInitialState: function() {
        // set initial state of game
    },

    play: function() {
        this.main(performance.now());
    },

    main: function(tFrame) {

        this.stopMain = window.requestAnimationFrame(Game.main);

        var nextTick = Game.lastTick + Game.tickLength;
        var numTicks = 0;

        // If tFrame < nextTick then 0 ticks need to be updated (0 is default for numTicks).
        // If tFrame = nextTick then 1 tick needs to be updated (and so forth).
        // Note: As we mention in summary, you should keep track of how large numTicks is.
        // If it is large, then either your game was asleep, or the machine cannot keep up.
        if (tFrame > nextTick) {
            var timeSinceTick = tFrame - Game.lastTick;
            numTicks = Math.floor( timeSinceTick / Game.tickLength );
        }

        // Main game loop content here!
        Game.queueUpdates( numTicks );
        Game.render(tFrame);

        this.lastRender = tFrame;
    },

    queueUpdates: function( numTicks ) {
        for (var i=0; i < numTicks; i++) {
            this.lastTick = this.lastTick + this.tickLength; // Now lastTick is this tick.
            this.update( this.lastTick );
        }
    },

    update: function() {
        // TODO: ОБРАБОТКА ВВОДА КЛАВИАТУРЫ!!! СЕЙЧАС ВНУТРИ request animation frame это не работает
        this.player.update();
    },

    render: function() {
        // Game drawing process
        this.player.draw(this.canvasCtx);
    }
};
