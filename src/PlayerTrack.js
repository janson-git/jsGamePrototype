var PlayerTrack = {
    DISPLAYED_TRACKS_NUM: 6,
    ALPHA_DEGRADATION_STEP: 0.92,
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
                sizeX: 6,
                sizeY: 6,
                alpha: 1,
                playerObj: this.player,

                get: function() {
                    return {x: this.x, y: this.y, sizeX: this.sizeX, sizeY: this.sizeY, alpha: this.alpha};
                },
                getPlayer: function() {
                    return this.playerObj;
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
        ctx.save();
        this.tracks.forEach(function(track, index) {
            var data = track.get();
            var player = track.getPlayer();

            // в data есть координаты на момент создания трека
            // в player есть текущие координаты игрока, его скорость и направление
            // можем посчитать, где рисовать след. В зависимости от скорости и направления игрока
            var diffX = player.x - data.x;
            var diffY = player.y - data.y;

            var x = player.screenX - diffX;
            var y = player.screenY - diffY;

            ctx.fillStyle = 'rgba(200, 200, 255, ' + data.alpha + ')';
            ctx.fillRect(x - (data.sizeX/2), y - (data.sizeY/2), data.sizeX, data.sizeY);
        });

        ctx.restore();
    }
};
