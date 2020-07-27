var Player = {
    x: undefined,
    y: undefined,
    sizeX: 6,
    sizeY: 6,
    drawedX: undefined,
    drawedY: undefined,

    init: function(startX, startY) {
        this.x = startX;
        this.y = startY;
    },
    moveLeft: function() {
        this.x -= 1;
    },
    moveRight: function() {
        this.x += 1;
    },
    moveUp: function() {
        this.y -= 1;
    },
    moveDown: function() {
        this.y += 1;
    },

    update: function() {
        if (Keyboard.isDown(Keyboard.UP)) this.moveUp();
        if (Keyboard.isDown(Keyboard.LEFT)) this.moveLeft();
        if (Keyboard.isDown(Keyboard.DOWN)) this.moveDown();
        if (Keyboard.isDown(Keyboard.RIGHT)) this.moveRight();
    },

    /**
     *
     * @param ctx Canvas context
     */
    draw: function(ctx) {
        // сейчас игрок - это маленький квадратик
        // удалим старое изображение и нарисуем новую позицию
        if (this.drawedX && this.drawedY) {
            // ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.clearRect(this.drawedX - (this.sizeX/2), this.drawedY - (this.sizeY/2), this.sizeX, this.sizeY);
        }

        ctx.fillStyle = 'rgb(200, 0, 0)';
        ctx.fillRect(this.x - (this.sizeX/2), this.y - (this.sizeY/2), this.sizeX, this.sizeY);

        this.drawedX = this.x;
        this.drawedY = this.y;
    }
};
