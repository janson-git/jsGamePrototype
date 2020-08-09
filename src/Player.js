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
    spriteImage: 'img/boatsSpriteListTransparent.png',
    spriteRotateSize: 11.25, // 11.25 градусов на спрайт
    currentSpriteIndex: 0,
    spriteConfig: {
        // Каждый спрайт показывает угол, от которого + и - на 6 градусов его и рисуем
        0: {sx: 0, sy: 0, h: 24, w: 17, mirror: false}, // 0 градусов
        1: {sx: 20, sy: 0, h: 24, w: 18, mirror: false}, // 11.25 градусов
        2: {sx: 41, sy: 0, h: 24, w: 19, mirror: false}, // 22.50 градуса
        3: {sx: 62, sy: 0, h: 24, w: 20, mirror: false}, // 33.75 градусов
        4: {sx: 85, sy: 2, h: 20, w: 23, mirror: false}, // 45 градусов
        5: {sx: 111, sy: 3, h: 20, w: 24, mirror: false}, // 56.25 градусов
        6: {sx: 138, sy: 3, h: 20, w: 24, mirror: false}, // 67.5 градусов
        7: {sx: 166, sy: 4, h: 20, w: 26, mirror: false}, // 78.75 градусов
        8: {sx: 195, sy: 5, h: 19, w: 26, mirror: false}, // 90 градусов
        9: {sx: 224, sy: 4, h: 20, w: 26, mirror: false}, // 101.25 градусов
        10: {sx: 253, sy: 4, h: 20, w: 26, mirror: false}, // 112.5 градусов
        11: {sx: 282, sy: 3, h: 21, w: 24, mirror: false}, // 123.75 градусов
        12: {sx: 308, sy: 2, h: 21, w: 24, mirror: false}, // 135 градусов
        13: {sx: 334, sy: 2, h: 22, w: 20, mirror: false}, // 146.25 градусов
        14: {sx: 357, sy: 1, h: 23, w: 19, mirror: false}, // 157.5 градусов
        15: {sx: 378, sy: 0, h: 24, w: 18, mirror: false}, // 168.75 градусов
        16: {sx: 398, sy: 0, h: 24, w: 17, mirror: false}, // 180 градусов
        // Для углов свыше 180 и до 360 - отображаем отражённые спрайты
        17: {sx: 378, sy: 0, h: 24, w: 18, mirror: true}, // 191.25 градусов
        18: {sx: 357, sy: 1, h: 23, w: 19, mirror: true}, // 202.5 градусов
        19: {sx: 334, sy: 2, h: 22, w: 20, mirror: true}, // 213.75 градусов
        20: {sx: 308, sy: 2, h: 21, w: 24, mirror: true}, // 225 градусов
        21: {sx: 282, sy: 3, h: 21, w: 24, mirror: true}, // 236.25 градусов
        22: {sx: 253, sy: 4, h: 21, w: 26, mirror: true}, // 247.5 градусов
        23: {sx: 224, sy: 4, h: 20, w: 26, mirror: true}, // 258.75 градусов
        24: {sx: 195, sy: 5, h: 19, w: 26, mirror: true}, // 270 градусов
        25: {sx: 166, sy: 4, h: 20, w: 26, mirror: true}, // 281.25 градусов
        26: {sx: 138, sy: 3, h: 20, w: 24, mirror: true}, // 292.5 градусов
        27: {sx: 111, sy: 3, h: 20, w: 24, mirror: true}, // 303.75 градусов
        28: {sx: 85, sy: 2, h: 20, w: 23, mirror: true}, // 315 градусов
        29: {sx: 62, sy: 0, h: 24, w: 20, mirror: true}, // 326.25 градусов
        30: {sx: 41, sy: 0, h: 24, w: 19, mirror: true}, // 337.5 градуса
        31: {sx: 20, sy: 0, h: 24, w: 18, mirror: true}, // 348.75 градусов
    },

    getSpriteConfig() {
        var that = this;
        var config = this.spriteConfig[0];
        var directionInDeg = this.direction * 180 / Math.PI;

        var halfStep = this.spriteRotateSize / 2;
        // 5.625 - половина от шага поворота. Спрайт смотрит в определённый угол и плюс-минус половина шага.
        var index = 0;

        if ( (directionInDeg > (360 - halfStep)) || directionInDeg < halfStep) {
            index = 0;
        } else if ( (directionInDeg > (11.25 - halfStep)) && (directionInDeg < (11.25 + halfStep)) ) {
            index = 1;
        } else if (directionInDeg > (22.5 - halfStep) && directionInDeg < (22.5 + halfStep)) {
            index = 2;
        } else if (directionInDeg > (33.75 - halfStep) && directionInDeg < (33.75 + halfStep)) {
            index = 3;
        } else if (directionInDeg > (45 - halfStep) && directionInDeg < (45 + halfStep)) {
            index = 4;
        } else if (directionInDeg > (56.25 - halfStep) && directionInDeg < (56.25 + halfStep)) {
            index = 5;
        } else if (directionInDeg > (67.5 - halfStep) && directionInDeg < (67.5 + halfStep)) {
            index = 6;
        } else if (directionInDeg > (78.75 - halfStep) && directionInDeg < (78.75 + halfStep)) {
            index = 7;
        } else if (directionInDeg > (90 - halfStep) && directionInDeg < (90 + halfStep)) {
            index = 8;
        } else if (directionInDeg > (101.25 - halfStep) && directionInDeg < (101.25 + halfStep)) {
            index = 9;
        } else if (directionInDeg > (112.5 - halfStep) && directionInDeg < (112.5 + halfStep)) {
            index = 10;
        } else if (directionInDeg > (123.75 - halfStep) && directionInDeg < (123.75 + halfStep)) {
            index = 11;
        } else if (directionInDeg > (135 - halfStep) && directionInDeg < (135 + halfStep)) {
            index = 12;
        } else if (directionInDeg > (146.25 - halfStep) && directionInDeg < (146.25 + halfStep)) {
            index = 13;
        } else if (directionInDeg > (157.5 - halfStep) && directionInDeg < (157.5 + halfStep)) {
            index = 14;
        } else if (directionInDeg > (168.75 - halfStep) && directionInDeg < (168.75 + halfStep)) {
            index = 15;
        } else if (directionInDeg > (180 - halfStep) && directionInDeg < (180 + halfStep)) {
            index = 16;
        } else if (directionInDeg > (191.25 - halfStep) && directionInDeg < (191.25 + halfStep)) {
            index = 17;
        } else if (directionInDeg > (202.5 - halfStep) && directionInDeg < (202.5 + halfStep)) {
            index = 18;
        } else if (directionInDeg > (213.75 - halfStep) && directionInDeg < (213.75 + halfStep)) {
            index = 19;
        } else if (directionInDeg > (225 - halfStep) && directionInDeg < (225 + halfStep)) {
            index = 20;
        } else if (directionInDeg > (236.25 - halfStep) && directionInDeg < (236.25 + halfStep)) {
            index = 21;
        } else if (directionInDeg > (247.5 - halfStep) && directionInDeg < (247.5 + halfStep)) {
            index = 22;
        } else if (directionInDeg > (258.75 - halfStep) && directionInDeg < (258.75 + halfStep)) {
            index = 23;
        } else if (directionInDeg > (270 - halfStep) && directionInDeg < (270 + halfStep)) {
            index = 24;
        } else if (directionInDeg > (281.25 - halfStep) && directionInDeg < (281.25 + halfStep)) {
            index = 25;
        } else if (directionInDeg > (292.5 - halfStep) && directionInDeg < (292.5 + halfStep)) {
            index = 26;
        } else if (directionInDeg > (303.75 - halfStep) && directionInDeg < (303.75 + halfStep)) {
            index = 27;
        } else if (directionInDeg > (315 - halfStep) && directionInDeg < (315 + halfStep)) {
            index = 28;
        } else if (directionInDeg > (326.25 - halfStep) && directionInDeg < (326.25 + halfStep)) {
            index = 29;
        } else if (directionInDeg > (337.5 - halfStep) && directionInDeg < (337.5 + halfStep)) {
            index = 30;
        } else if (directionInDeg > (348.75 - halfStep) && directionInDeg < (348.75 + halfStep)) {
            index = 31;
        }

        config = that.spriteConfig[index];
        this.currentSpriteIndex = index;

        return config;
    },

    init: function(startX, startY, direction) {
        this.x = startX;
        this.y = startY;
        this.direction = direction;
    },
    turnLeft: function(tDiff) {
        this.direction -= (this.rotateSpeed * tDiff);
        if (this.direction < 0) {
            this.direction = Direction.MAX_VALUE - (this.direction);
        }
    },
    turnRight: function(tDiff) {
        this.direction += (this.rotateSpeed * tDiff);
        if (this.direction > Direction.MAX_VALUE) {
            this.direction = this.direction - Direction.MAX_VALUE;
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
        this.y = this.y + (-1 * v * Math.cos(this.direction)); // в canvas ось Y - идёт вниз. А мы хотим рисовать вверх.

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

        // ctx.fillStyle = 'rgb(200, 0, 0)';
        // ctx.fillRect(this.x - (this.sizeX/2), this.y - (this.sizeY/2), this.sizeX, this.sizeY);

        // рисуем нужный спрайт
        var spriteConfig = this.getSpriteConfig();
        this.drawSprite(ctx, spriteConfig);

        this.drawedX = this.x;
        this.drawedY = this.y;
    },

    drawSprite: function(ctx, sprite, dX = 0, dY = 0) {
        ctx.save();

        // откуда рисуем спрайт
        ctx.translate(this.x, this.y);

        if (sprite.mirror === true) {
            // зеркалируем
            ctx.scale(-1, 1);
        }

        ctx.drawImage(
            Game.boatsSpriteList,
            // фактически нужно будет отрисовывать спрайт, чтобы текущее положение игрока проходило через его центр
            sprite.sx, sprite.sy, sprite.w, sprite.h, -sprite.w / 2, -sprite.h / 2, sprite.w, sprite.h
        );

        ctx.restore();
    }
};
