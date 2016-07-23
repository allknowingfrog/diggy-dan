function entity(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x || 0;
    this.y = y || 0;
    this.vx = 0;
    this.vy = 0;
    this.health = 100;

    var halfWidth = width / 2;
    var halfHeight = height / 2;

    this.left = function(val) {
        if(typeof val === 'number') {
            this.x = val + halfWidth;
        } else {
            return this.x - halfWidth;
        }
    };

    this.top = function(val) {
        if(typeof val === 'number') {
            this.y = val + halfHeight;
        } else {
            return this.y - halfHeight;
        }
    };

    this.right = function(val) {
        if(typeof val === 'number') {
            this.x = val - halfWidth;
        } else {
            return this.x + halfWidth;
        }
    };

    this.bottom = function(val) {
        if(typeof val === 'number') {
            this.y = val - halfHeight;
        } else {
            return this.y + halfHeight;
        }
    };

    this.to = function(obj) {
        var dx = obj.x - this.x;
        var dy = obj.y - this.y;
        var ax = Math.abs(dx);
        var ay = Math.abs(dy);
        if(ax > ay) {
            dy /= ax;
            dx /= ax;
        } else if(ay > 0) {
            dx /= ay;
            dy /= ay;
        } else {
            dx = 0;
            dy = 0;
        }

        return {x: dx, y: dy};
    }

    this.rect = function(ctx) {
        ctx.fillRect(this.x - halfWidth, this.y - halfHeight, width, height);
    };
}
