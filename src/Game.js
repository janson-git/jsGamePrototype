
var Game = {
    fps: 30,
    g: 15,
    stopMain: undefined,
    lastTick: undefined,
    lastRender: undefined,
    tickLength: undefined,
    canvas: {},
    canvasCtx: {},
    player: {},
    playerTrack: {}, // след за игроком

    init: function(canvas, player) {
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext('2d');
        this.player = player;
        PlayerTrack.init(this.player);

        this.playerTrack = PlayerTrack;

        this.lastTick = performance.now();
        this.lastRender = this.lastTick;
        this.tickLength = 1000 / this.fps;

        this.setInitialState();
    },

    setInitialState: function() {
        // set initial state of game
    },

    play: function() {
        this.main(performance.now());
    },

    main: function(tFrame) {

        Game.stopMain = window.requestAnimationFrame(Game.main);

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

    update: function(lastTick) {
        this.player.update(lastTick);
        this.playerTrack.update(lastTick);
    },

    render: function() {
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Game drawing process
        this.playerTrack.draw(this.canvasCtx);
        this.player.draw(this.canvasCtx);
    }
};
