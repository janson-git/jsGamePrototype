var Player = {
    x: undefined,
    y: undefined,
    sizeX: 6,
    sizeY: 6,
    drawedX: undefined,
    drawedY: undefined,
    direction: undefined,
    speed: 0, // m/sec
    acceleration: 15, // m/sec^2
    deceleration: 30, // m/sec^2
    rotateSpeed: Math.PI / 2, // Radians per second
    lastTick: undefined,

    init: function(startX, startY, direction) {
        this.x = startX;
        this.y = startY;
        this.direction = direction;
    },
    turnLeft: function(tDiff) {
        this.direction += (this.rotateSpeed * tDiff);
        if (this.direction > Direction.MAX_VALUE) {
            this.direction = this.direction - Direction.MAX_VALUE;
        }
    },
    turnRight: function(tDiff) {
        this.direction -= (this.rotateSpeed * tDiff);
        if (this.direction < 0) {
            this.direction = Direction.MAX_VALUE - (this.direction);
        }
    },
    speedUp: function(tDiff) {
        this.speed += (this.acceleration * tDiff);
    },
    speedDown: function(tDiff) {
        this.speed -= (this.deceleration * tDiff);
    },
    break: function(tDiff) {
        if (this.speed === 0) {
            return;
        }
        var coeff = this.speed > 0 ? 1 : -1;
        this.speed -= (coeff * this.deceleration * tDiff);
        if (this.speed < 0) {
            this.speed = 0;
        }
    },

    update: function( lastTick ) {
        if (this.lastTick === undefined) {
            this.lastTick = lastTick;
        }

        var tDiff = (lastTick - this.lastTick) / 1000;

        if (Keyboard.isDown(Keyboard.UP)) this.speedUp(tDiff);
        if (Keyboard.isDown(Keyboard.LEFT)) this.turnLeft(tDiff);
        if (Keyboard.isDown(Keyboard.DOWN)) this.speedDown(tDiff);
        if (Keyboard.isDown(Keyboard.SPACE)) this.break(tDiff);
        if (Keyboard.isDown(Keyboard.RIGHT)) this.turnRight(tDiff);

        var v = this.speed * tDiff;
        this.x = this.x + (v * Math.sin(this.direction));
        this.y = this.y + (v * Math.cos(this.direction));

        this.lastTick = lastTick;
    },

    /**
     *
     * @param ctx Canvas context
     */
    draw: function(ctx) {
        // сейчас игрок - это маленький квадратик
        // удалим старое изображение и нарисуем новую позицию
        // if (this.drawedX && this.drawedY) {
        //     // ctx.fillStyle = 'rgb(255, 255, 255)';
        //     ctx.clearRect(this.drawedX - (this.sizeX/2), this.drawedY - (this.sizeY/2), this.sizeX, this.sizeY);
        // }

        ctx.fillStyle = 'rgb(200, 0, 0)';
        ctx.fillRect(this.x - (this.sizeX/2), this.y - (this.sizeY/2), this.sizeX, this.sizeY);

        this.drawedX = this.x;
        this.drawedY = this.y;
    }
};
