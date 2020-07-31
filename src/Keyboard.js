
var Keyboard = {
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32,

    isDown: function(keyCode) {
        return this._pressed[keyCode];
    },
    onKeydown: function(event) {
        //console.log(event.keyCode, event.key);
        this._pressed[event.keyCode] = true;
    },
    onKeyup: function(event) {
        delete this._pressed[event.keyCode];
    }
};

