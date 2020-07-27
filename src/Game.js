
var Game = {
    fps: 60,
    g: 15,
    canvasCtx: {},
    player: {},

    init: function(canvasCtx, player) {
        this.canvasCtx = canvasCtx;
        this.player = player;
    },
    start: function() {
        Game._onEachFrame(Game.run);
    },
    draw: function() {
        // Game drawing process
        this.player.draw(this.canvasCtx);
    }
};

Game.update = function() {
       Game.player.update();
};


Game._onEachFrame = (function() {
    return function(cb) {
        setInterval(cb, 1000 / Game.fps);
    };
})();


Game.run = (function() {
    var loops = 0, skipTicks = 1000 / Game.fps,
        maxFrameSkip = 10,
        nextGameTick = (new Date).getTime(),
        lastGameTick;

    return function() {
        loops = 0;

        while ((new Date).getTime() > nextGameTick) {
            Game.update();
            nextGameTick += skipTicks;
            loops++;
        }

        if (loops) {
            Game.draw();
        }
    }
})();

