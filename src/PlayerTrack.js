var PlayerTrack = {
    DISPLAYED_TRACKS_NUM: 10,
    ALPHA_DEGRADATION_STEP: 0.98,
    TRACKS_INTERVAL_IN_TICKS: 100, // интервал между двумя соседними "следами"
    player: {}, // игрок используется, для получения из него текущих координат
    tracks: [], // отображаемые "следы" за игроком
    lastTick: 0,

    init: function(player) {
        this.player = player;
    },

    update: function(tick) {
        if (this.lastTick === 0) {
            this.lastTick = tick;
        }

        this.tracks.forEach(function(track) {
            track.update();
        });

        var tickDiff = tick - this.lastTick;
        if (tickDiff > PlayerTrack.TRACKS_INTERVAL_IN_TICKS) {
            this.lastTick = tick;

            var player = this.player;
            var lastTick = this.lastTick;

            this.tracks.push({
                startTick: lastTick,
                x: player.x,
                y: player.y,
                sizeX: player.sizeX,
                sizeY: player.sizeY,
                alpha: 1,

                get: function() {
                    return {x: this.x, y: this.y, sizeX: this.sizeX, sizeY: this.sizeY, alpha: this.alpha};
                },
                update: function() {
                    this.alpha *= PlayerTrack.ALPHA_DEGRADATION_STEP;
                }
            });

            // чистим хвост от старых следов
            if (this.tracks.length > PlayerTrack.DISPLAYED_TRACKS_NUM) {
                this.tracks.shift();
            }
        }
    },

    /**
     * @param ctx Canvas context
     */
    draw: function(ctx) {
        this.tracks.forEach(function(track) {
            var data = track.get();
            ctx.fillStyle = 'rgba(200, 200, 255, ' + data.alpha + ')';
            ctx.fillRect(data.x - (data.sizeX/2), data.y - (data.sizeY/2), data.sizeX, data.sizeY);
        })
    }
};
