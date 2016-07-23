var can;
var ctx;
var player = new entity(20, 20);
var cells = [];
var enemies = [];
var velocity = 100;
var accel = 200;
var enemyMove = .9;
var gridSize = 24;
var cellSize = 28;
var damage = 200;
var timestamp;
var inputs = {
    left: false,
    up: false,
    right: false,
    down: false,
    dig: false
};

function init() {
    for(var x=0; x<gridSize; x++) {
        cells.push([]);
        for(var y=0; y<gridSize; y++) {
            if(x < gridSize / 2 - 2 || x > gridSize / 2 + 2 || y > gridSize/2 - 2) {
                cells[x].push(new entity(cellSize, cellSize));
                cells[x][y].x = x * cellSize;
                cells[x][y].y = y * cellSize;
            } else {
                cells[x].push(null);
            }
        }
    }

    can = document.getElementById('can');
    can.width = gridSize * cellSize;
    can.height = gridSize * cellSize;
    ctx = can.getContext('2d');
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
    player.x = can.width / 2;
    player.y = 0;
    enemies.push(new entity(20, 20, 10 * cellSize, 15 * cellSize));
    enemies.push(new entity(20, 20, 4 * cellSize, 15 * cellSize));
    cells[10][15] = null;
    cells[4][15] = null;
    for(var i=0; i<enemies.length; i++) {
        enemies[i].color = 'green';
    }
    timestamp = Date.now();

    loop();
}

function loop() {
    var enemy, vector;
    var now = Date.now();
    var delta = (now - timestamp) / 1000;
    timestamp = now;

    if(inputs.left) {
        player.vx -= accel * delta;
    } else if(inputs.right) {
        player.vx += accel * delta;
    }
    if(inputs.up) {
        player.vy -= accel * delta;
    } else if(inputs.down) {
        player.vy += accel * delta;
    } else {
        player.vy += accel * delta;
    }

    if(player.vx < -velocity) {
        player.vx = -velocity;
    } else if(player.vx > velocity) {
        player.vx = velocity;
    }
    if(player.vy < -velocity) {
        player.vy = -velocity;
    } else if(player.vy > velocity) {
        player.vy = velocity;
    }

    player.x += player.vx * delta;
    player.y += player.vy * delta;

    var cellX = Math.floor(player.x / cellSize);
    var cellY = Math.floor(player.y / cellSize);

    checkCollision(cellX, cellY, delta);
    checkCollision(cellX + 1, cellY, delta);
    checkCollision(cellX, cellY + 1, delta);
    checkCollision(cellX + 1, cellY + 1, delta);

    if(player.left() < 0) {
        player.left(0);
        player.vx = 0;
    } else if(player.right() > can.width) {
        player.right(can.width);
        player.vx = 0;
    }

    if(player.top() < 0) {
        player.top(0);
        player.vy = 0;
    } else if(player.bottom() > can.height) {
        player.bottom(can.height);
        player.vy = 0;
    }

    for(var i=0; i<enemies.length; i++) {
        enemy = enemies[i];
        vector = enemy.to(player);
        if(vector.x === 0 && vector.y === 0) {
            vector.x = 1;
            vector.y = 1;
        }
        enemy.vx += accel * enemyMove * vector.x * delta;
        enemy.vy += accel * enemyMove * vector.y * delta;
        if(enemy.vx > velocity * enemyMove) {
            enemy.vx = velocity * enemyMove;
        } else if(enemy.vx < -velocity * enemyMove) {
            enemy.vx = -velocity * enemyMove;
        }
        if(enemy.vy > velocity * enemyMove) {
            enemy.vy = velocity * enemyMove;
        } else if(enemy.vy < -velocity * enemyMove) {
            enemy.vy = -velocity * enemyMove;
        }
        enemy.x += enemy.vx * delta;
        enemy.y += enemy.vy * delta;

        var cellX = Math.floor(enemy.x / cellSize);
        var cellY = Math.floor(enemy.y / cellSize);

        enemyCollision(enemy, cellX, cellY);
        enemyCollision(enemy, cellX + 1, cellY);
        enemyCollision(enemy, cellX, cellY + 1);
        enemyCollision(enemy, cellX + 1, cellY + 1);
    }

    ctx.clearRect(0, 0, can.width, can.height);
    ctx.fillStyle = 'black';
    player.rect(ctx);
    for(var y=0; y<gridSize; y++) {
        for(var x=0; x<gridSize; x++) {
            if(cells[x][y]) {
                if(cells[x][y].health <= 50) {
                    ctx.fillStyle = 'orange';
                } else {
                    ctx.fillStyle = 'brown';
                }
                cells[x][y].rect(ctx);
            }
        }
    }
    ctx.fillStyle = 'green';
    for(var i=0; i<enemies.length; i++) {
        enemies[i].rect(ctx);
    }

    window.requestAnimationFrame(loop);
}

function checkCollision(x, y, delta) {
    if(x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
        var cell = cells[x][y];
        if(!cell) return;
        if(collide(player, cell)) {
            var vector = cell.to(player);
            if(vector.x === 0 && vector.y === 0) {
                vector.x = cell.width;
                vector.y = cell.height;
            } else {
                vector.x /= cell.width;
                vector.y /= cell.height;
            }
            var hit = false;
            if(Math.abs(vector.x) > Math.abs(vector.y)) {
                if(vector.x > 0) {
                    if(inputs.left) hit = true;
                    player.left(cell.right());
                } else {
                    if(inputs.right) hit = true;
                    player.right(cell.left());
                }
                if(player.y < cell.top() || player.y > cell.bottom()) hit = false;
                player.vx = 0;
            } else {
                if(vector.y > 0) {
                    if(inputs.up) hit = true;
                    player.top(cell.bottom());
                } else {
                    if(inputs.down) hit = true;
                    player.bottom(cell.top());
                }
                if(player.x < cell.left() || player.x > cell.right()) hit = false;
                player.vy = 0;
            }
            if(hit) {
                cell.health -= damage * delta;
                if(cell.health <= 0) {
                    cells[x][y] = null;
                }
            }
        }
    }
}

function enemyCollision(enemy, x, y) {
    if(x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
        var cell = cells[x][y];
        if(!cell) return;
        if(collide(enemy, cell)) {
            var dx = (cell.x - enemy.x) / cell.width;
            var dy = (cell.y - enemy.y) / cell.height;
            if(Math.abs(dx) > Math.abs(dy)) {
                if(dx > 0) {
                    enemy.right(cell.left());
                } else {
                    enemy.left(cell.right());
                }
                enemy.vx = 0;
            } else {
                if(dy > 0) {
                    enemy.bottom(cell.top());
                } else {
                    enemy.top(cell.bottom());
                }
                enemy.vy = 0;
            }
        }
    }
}

function keyDown(e) {
    e.preventDefault();
    switch(e.keyCode) {
        case 37:
            inputs.left = true;
            break;
        case 38:
            inputs.up = true;
            break;
        case 39:
            inputs.right = true;
            break;
        case 40:
            inputs.down = true;
            break;
        case 32:
            inputs.dig = true;
            break;
    }
}

function keyUp(e) {
    e.preventDefault();
    switch(e.keyCode) {
        case 37:
            inputs.left = false;
            break;
        case 38:
            inputs.up = false;
            break;
        case 39:
            inputs.right = false;
            break;
        case 40:
            inputs.down = false;
            break;
        case 32:
            inputs.dig = false;
            break;
    }
}

function collide(a, b) {
    if(a.left() > b.right()) return false;
    if(a.top() > b.bottom()) return false;
    if(a.right() < b.left()) return false;
    if(a.bottom() < b.top()) return false;
    return true;
}
