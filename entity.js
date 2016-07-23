function entity(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x || 0;
    this.y = y || 0;
    this.vx = 0;
    this.vy = 0;
    this.color = 'black';
    this.health = 100;

    this.getLeft = function() {
        return this.x;
    }
    this.getTop = function() {
        return this.y;
    }
    this.getRight = function() {
        return this.x + this.width;
    }
    this.getBottom = function() {
        return this.y + this.height;
    }
    this.getMidX = function() {
        return this.x + this.width / 2;
    }
    this.getMidY = function() {
        return this.y + this.height / 2;
    }

    this.setLeft = function(val) {
        this.x = val;
    }
    this.setTop = function(val) {
        this.y = val;
    }
    this.setRight = function(val) {
        this.x = val - this.width;
    }
    this.setBottom = function(val) {
        this.y = val - this.height;
    }
}
