var Sprite = {
    context: null,
    width: null,
    height: null,
    image: null,

    init: function(context, width, height, image) {
        this.context = context;
        this.width = width;
        this.height = height;
        this.image = image;
    }
};