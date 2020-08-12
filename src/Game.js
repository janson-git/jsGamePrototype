
var Game = {
    fps: 30,
    g: 15,
    stopMain: undefined,
    lastTick: undefined,
    lastRender: undefined,
    tickLength: 50, // ms
    renderInterval: undefined,
    canvas: {},
    canvasUI: {},
    debugMonitor: undefined,
    canvasCtx: {},
    player: {},
    playerTrack: {}, // след за игроком

    directionArrowImg: null,
    boatsSpriteList: null,

    tileAtlas: null,
    camera: null,

    init: function(canvas, canvasUI, debugMonitor) {
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext('2d');
        this.canvasUI = canvasUI;

        this.debugMonitor = debugMonitor;

        this.lastTick = performance.now();
        this.lastRender = this.lastTick;
        this.renderInterval = 1000 / this.fps;

        this.loadImages();
        this.setInitialState();
    },

    setInitialState: function() {
        // set initial state of game
        this.player = Object.create(Player);
        this.player.init(Map, 160, 160, Direction.NORTH);

        this.playerTrack = Object.create(PlayerTrack);
        this.playerTrack.init(this.player);

        this.camera = new Camera(Map, 512, 448);
        // мы хотим, чтобы камера следовала за игроком
        this.camera.follow(this.player);
    },

    loadImages: function() {
        this.directionArrowImg = new Image();
        this.directionArrowImg.src = "img/CircledArrowRight.png";
        this.directionArrowImg.style.transform = 'rotate(-90deg)';

        this.boatsSpriteList = new Image();
        this.boatsSpriteList.src = Player.spriteImage;

        this.tileAtlas = new Image();
        this.tileAtlas.src = 'img/tiles.png';
        // Loader.loadImage('tiles', 'img/tiles.png');
    },

    play: function() {
        this.main(performance.now());
    },

    main: function(tFrame) {

        Game.stopMain = window.requestAnimationFrame(Game.main);

        var nextTick = Game.lastTick + Game.tickLength;
        var nextRender = Game.lastRender + Game.renderInterval;
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

        if (tFrame > nextRender) {
            Game.render(tFrame);
            Game.lastRender = tFrame;
        }
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

        // движение камеры зависит от движения игрока
        this.camera.update(lastTick);
    },

    render: function() {
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // рисуем карту
        this.renderMapLayer(0);
        this.renderMapLayer(1);
        this.canvasCtx.save();

        // Game drawing process
        this.playerTrack.draw(this.canvasCtx);
        this.player.draw(this.canvasCtx);

        if (this.debugMonitor) {
            this.debugMonitor.innerHTML = `Speed: ${this.player.speed}<br>` +
                `Direction: ${this.player.direction * 180 / Math.PI}<br>` +
                `Sprite index: ${this.player.currentSpriteIndex}`;
        }

        this.renderInfoOverlay();
    },
    renderMapLayer: function(layer) {
        var startCol = Math.floor(this.camera.x / Map.tsize);
        var endCol = startCol + (this.camera.width / Map.tsize);
        var startRow = Math.floor(this.camera.y / Map.tsize);
        var endRow = startRow + (this.camera.height / Map.tsize);
        var offsetX = -this.camera.x + startCol * Map.tsize;
        var offsetY = -this.camera.y + startRow * Map.tsize;

        var ctx = this.canvasCtx;

        for (var c = startCol; c <= endCol; c++) {
            for (var r = startRow; r <= endRow; r++) {
                var tile = Map.getTile(layer, c, r);
                var x = (c - startCol) * Map.tsize + offsetX;
                var y = (r - startRow) * Map.tsize + offsetY;
                if (tile !== 0) { // 0 => empty tile
                    ctx.drawImage(
                        this.tileAtlas, // image
                        (tile - 1) * Map.tsize, // source x
                        0, // source y
                        Map.tsize, // source width
                        Map.tsize, // source height
                        Math.round(x),  // target x
                        Math.round(y), // target y
                        Map.tsize, // target width
                        Map.tsize // target height
                    );
                }
            }
        }

    },
    renderInfoOverlay: function() {
        // что отображаем в оверлее:
        // стрелка направления движения
        var arrowPosX = 6,
            arrowPosY = 6,
            arrowWidth = 32,
            arrowHeight = 32;

        var ctxUI = this.canvasUI.getContext('2d');
        ctxUI.clearRect(0, 0, this.canvasUI.width, this.canvasUI.height);
        ctxUI.save();

        // стрелку нужно нарисовать в направлении player.direction
        ctxUI.translate(arrowPosX + arrowWidth/2, arrowPosY + arrowHeight/2);
        ctxUI.rotate((this.player.direction - (90 * Math.PI / 180)));
        ctxUI.drawImage(this.directionArrowImg, arrowWidth / 2 * (-1), arrowHeight / 2 * (-1), arrowWidth, arrowHeight);

        ctxUI.restore();

        ctxUI.save();
        // если игрок вышел за пределы поля - дорисовать метки по краю, чтобы было ясно где он
        var markWidth = 5;
        var markHeight = 5;
        var xPosition = this.player.x;
        var yPosition = this.player.y;
        if (this.player.x > this.canvas.width || this.player.x < 0) {
            xPosition = this.player.x < 0 ? 5 : this.canvas.width - 5;
            var c = this.player.x < 0 ? 1 : (-1);

            var x2 = xPosition + (markWidth * c);
            ctxUI.beginPath();
            ctxUI.moveTo(xPosition, yPosition);
            ctxUI.lineTo(x2, yPosition + 5);
            ctxUI.lineTo(x2, yPosition - 5);
            ctxUI.fillStyle = 'rgb(255, 0, 0)';
            ctxUI.fill();
        }
        if (this.player.y > this.canvas.height || this.player.y < 0) {
            yPosition = this.player.y < 0 ? 5 : this.canvas.height - 5;
            var c = this.player.y < 0 ? 1 : (-1);

            var y2 = yPosition + (markHeight * c);
            ctxUI.beginPath();
            ctxUI.moveTo(xPosition, yPosition);
            ctxUI.lineTo(xPosition + 5, y2);
            ctxUI.lineTo(xPosition - 5, y2);
            ctxUI.fillStyle = 'rgb(255, 0, 0)';
            ctxUI.fill();
        }

        ctxUI.restore();
    }
};
