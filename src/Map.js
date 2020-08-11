var map = {
    cols: 8,
    rows: 6,
    tsize: 64,
    // layers: [[
    //     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    //     1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    //     1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    //     1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    //     1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    //     1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
    //     1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1,
    //     1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1,
    //     1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1,
    //     1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    //     1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    //     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
    // ], [
    //     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    //     1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    //     1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    //     1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    //     1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    //     1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
    //     1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1,
    //     1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1,
    //     1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1,
    //     1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    //     1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    //     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
    // ]],
    layers: [[
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 1, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
    ], [
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 1, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
    ]],
    getTile: function (layer, col, row) {
        return this.layers[layer][row * map.cols + col];
    },
    isSolidTileAtXY: function (x, y) {
        var col = Math.floor(x / this.tsize);
        var row = Math.floor(y / this.tsize);

        // tiles 1 are solid -- the rest are walkable
        // loop through all layers and return TRUE if any tile is solid
        return this.layers.reduce(function (res, layer, index) {
            var tile = this.getTile(index, col, row);
            var isSolid = tile === 1;
            return res || isSolid;
        }.bind(this), false);
    },
    getCol: function (x) {
        return Math.floor(x / this.tsize);
    },
    getRow: function (y) {
        return Math.floor(y / this.tsize);
    },
    getX: function (col) {
        return col * this.tsize;
    },
    getY: function (row) {
        return row * this.tsize;
    }
};

function Camera(map, width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.maxX = map.cols * map.tsize - width;
    this.maxY = map.rows * map.tsize - height;
}
Camera.prototype.follow = function (sprite) {
    this.following = sprite;
    sprite.screenX = 0;
    sprite.screenY = 0;
};

Camera.prototype.update = function () {
    // assume followed sprite should be placed at the center of the screen
    // whenever possible
    this.following.screenX = this.width / 2;
    this.following.screenY = this.height / 2;

    // make the camera follow the sprite
    this.x = this.following.x - this.width / 2;
    this.y = this.following.y - this.height / 2;
    // clamp values
    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));

    // in map corners, the sprite cannot be placed in the center of the screen
    // and we have to change its screen coordinates

    // left and right sides
    if (this.following.x < this.width / 2 ||
        this.following.x > this.maxX + this.width / 2) {
        this.following.screenX = this.following.x - this.x;
    }
    // top and bottom sides
    if (this.following.y < this.height / 2 ||
        this.following.y > this.maxY + this.height / 2) {
        this.following.screenY = this.following.y - this.y;
    }
};

Camera.prototype.move = function (lastTick, player) {
    if (this.lastTick === undefined) {
        this.lastTick = lastTick;
    }
    var tDiff = (lastTick - this.lastTick) / 1000;

    var v = player.speed * tDiff;
    this.x += (v * Math.sin(player.direction));
    this.y += ((-1) * v * Math.cos(player.direction)); // в canvas ось Y - идёт вниз. А мы хотим рисовать вверх.

    this.lastTick = lastTick;

    // move camera
    // this.x += dirx * Camera.SPEED * delta;
    // this.y += diry * Camera.SPEED * delta;
    // clamp values
    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));
};
