/**
 * Frogger Game.
 * @autor: Álvar Soler
 *
 */


var sprites = {
    frog: {
        sx: 0,
        sy: 0,
        w: 48,
        h: 48,
        frames: 1
    },
    bg: {
        sx: 433,
        sy: 0,
        w: 320,
        h: 480,
        frames: 1
    },
    car1: {
        sx: 143,
        sy: 0,
        w: 48,
        h: 48,
        frames: 1
    },
    car2: {
        sx: 191,
        sy: 0,
        w: 48,
        h: 48,
        frames: 1
    },
    car3: {
        sx: 239,
        sy: 0,
        w: 96,
        h: 48,
        frames: 1
    },
    car4: {
        sx: 335,
        sy: 0,
        w: 48,
        h: 48,
        frames: 1
    },
    car5: {
        sx: 383,
        sy: 0,
        w: 48,
        h: 48,
        frames: 1
    },
    trunk: {
        sx: 288,
        sy: 383,
        w: 142,
        h: 48,
        frames: 1
    },
    death: {
        sx: 0,
        sy: 143,
        w: 48,
        h: 48,
        frames: 4
    },
    bird: {
        sx: 149,
        sy: 57,
        w: 32,
        h: 24,
        frames: 2
    }
};

var spawnObjects = {
    car1: {
        sprite: 'car1',
        speed: -200
    },
    car2: {
        sprite: 'car2',
        speed: 200
    },
    car3: {
        sprite: 'car3',
        speed: -200
    },
    car4: {
        sprite: 'car4',
        speed: -300
    },
    log1: {
        sprite: 'log',
        row: 0,
        speed: -200
    },
    log2: {
        sprite: 'log',
        row: 1,
        speed: 155
    },
    log3: {
        sprite: 'log',
        row: 2,
        speed: -120
    }

};


var FROG = 1,
    LOG = 2,
    CAR = 4,
    WATER = 8,
    INSECT = 16;

var level = [];
var startGame = function() {
    Game.setBoard(1, new TitleScreen("Froggerr",
        "Press space to start playing",
        playGame));
    Game.lives = 3;

    level = [
        // gap spawn
        [3, new Car(spawnObjects.car1.sprite, spawnObjects.car1.speed)],
        [2.5, new Car(spawnObjects.car2.sprite, spawnObjects.car2.speed)],
        [3.5, new Car(spawnObjects.car3.sprite, spawnObjects.car3.speed)],
        [4, new Car(spawnObjects.car4.sprite, spawnObjects.car4.speed)],
        [3, new Log(spawnObjects.log1.row, spawnObjects.log1.speed)],
        [5, new Log(spawnObjects.log2.row, spawnObjects.log2.speed)],
        [4, new Log(spawnObjects.log3.row, spawnObjects.log3.speed)]
    ];


};
var lostGame = function() {
    Game.setBoard(1, new TitleScreen("YOU LOST",
        "looser", startGame));
};
var winGame = function() {
    Game.setBoard(1, new TitleScreen("YOU WIN",
        "Congrats!", startGame));

};
var playGame = function() {
    var bgBoard = new GameBoard();
    bgBoard.add(new Background());
    Game.setBoard(0, bgBoard);
    var gameBoard = new GameBoard();
    gameBoard.add(new Level(level));
    gameBoard.add(new Frog());
    gameBoard.add(new Bird());
    gameBoard.add(new Home());
    gameBoard.add(new Water());
    Game.setBoard(1, gameBoard);
};

/* Classes */
var Bird = function() {
    this.setup('bird', {
        frame: 0,
        f: 0,
        zIndex: 5
    });
    this.ySpeed = -55;
    this.x = Game.width / 2 + 48 * 2;
    this.y = Game.height;
    this.zIndex = 6;
};

Bird.prototype = new Sprite();
Bird.prototype.step = function(dt) {
    if (this.y + this.h < 0) {
        this.board.remove(this);
    }
    this.f += dt;
    if (this.f >= 1 / 4) {
        this.f -= 1 / 4;
        this.frame++;
    }
    if (this.frame > sprites.bird.frames)
        this.frame = 0;
    this.y += this.ySpeed * dt;
    var col = this.board.collide(this, FROG);
    if (col) {
        col.hit();
    }

};

var Spawner = function(data) {
    this.gap = data[0];
    this.obj = data[1];
    this.zIndex = 0;
    this.t = 0;
}

Spawner.prototype = new Sprite();
Spawner.prototype.draw = function() {};
Spawner.prototype.step = function(dt) {
    this.t += dt;
    if (this.t >= this.gap) {
        this.board.add(Object.create(this.obj));
        this.t -= this.gap;
    }
};


var Level = function(levelData) {
    this.levelData = levelData;
    this.t = 0;
};

Level.prototype = new Sprite();
Level.prototype.draw = function() {};
Level.prototype.step = function(dt) {
    if (this.t == 0) {
        for (var i = 0; i < this.levelData.length; i++) {
            // mirar como hacer esto automático
            this.board.add(new Spawner(this.levelData[i]));
        }
        this.t++;
    }
};


var Log = function(row, speed) {
    var seed = Math.random();
    this.setup('trunk', {
        zIndex: 1
    });
    this.xVel = speed;
    this.x = (speed > 0) ? 0 : Game.width;
    this.y = 48 + row * 48;
};

Log.prototype = new Sprite();
Log.prototype.type = LOG;
Log.prototype.step = function(dt) {
    this.x += this.xVel * dt;
    if (this.x + this.width < 0 || this.x > Game.width)
        this.board.remove(this);

    var frog = this.board.collide(this, FROG);
    if (frog)
        frog.onLog(this.xVel);

};


var Car = function(sprite, speed) {
    this.setup(sprite, {
        zIndex: 5
    });
    this.xVel = speed;
    this.x = (speed > 0) ? 0 : Game.width;

    this.y = Game.height - 48 - (parseInt(sprite[3]) * 48);
};
Car.prototype = new Sprite();
Car.prototype.type = CAR;

Car.prototype.step = function(dt) {
    this.x += this.xVel * dt;
    if (this.x + this.width < 0 || this.x > Game.width)
        this.board.remove(this);

    var collision = this.board.collide(this, FROG);
    if (collision) {
        collision.hit();
        this.board.remove(this);
    }
};



var Frog = function() {
    this.setup('frog', {
        reloadTime: 0.25,
        vx: 0,
        zIndex: 4
    });
    this.START_POINT = {
        x: (Game.width / 2 - this.w / 2),
        y: Game.height - this.h
    };
    this.reload = this.reloadTime;
    this.x = this.START_POINT.x;
    this.y = this.START_POINT.y;
    this.lifes = Game.lives;
    //this.y = 0;
}
Frog.prototype = new Sprite();
Frog.prototype.type = FROG;
Frog.prototype.onLog = function(vLog) {
    this.vx = vLog;
};


Frog.prototype.hit = function() {
    Game.lives--;
    if (this.board.remove(this)) {
        this.board.add(new Death(this));
    }

};

Frog.prototype.step = function(dt) {
    if (this.board.collide(this, WATER) && !this.board.collide(this, LOG)) {
        this.hit();
    }
    this.reload -= dt;
    if (this.reload <= 0) {
        // Movimiento por el tronco
        this.x += this.vx * dt;


        if (Game.keys['up']) {
            this.reload = this.reloadTime;
            this.y -= this.h;
        } else if (Game.keys['down']) {
            this.reload = this.reloadTime;
            this.y += this.h;
        } else if (Game.keys['right'] && this.x + this.w <= Game.width - this.w) {
            this.reload = this.reloadTime;
            this.x += this.w;
        } else if (Game.keys['left'] && this.x - this.w >= 0) {
            this.reload = this.reloadTime;
            this.x -= this.w;
        }


        if (this.y < 0) this.y = 0;
        else if (this.y > Game.height - this.h) this.y = Game.height - this.h;
        if (this.x < 0) this.x = 0;
        else if (this.x > Game.width - this.w) this.x = Game.width - this.w;
    }
    this.vx = 0;
};
var Home = function() {
    this.x = 0;
    this.y = 0;
    this.w = Game.width;
    this.h = 48;
    this.zIndex = 0;
    this.t = 0;

};
Home.prototype = new Sprite();
Home.prototype.step = function(dt) {
    var col = this.board.collide(this, FROG);
    if (col && col.type === FROG) {
        this.t += dt;
        if (this.t >= 0.5) {
            this.board.remove(col);
            winGame();
        }

    }

};
Home.prototype.draw = function() {

};


var Death = function(frog) {
    this.setup('death', {
        frame: 0,
        f: 0,
        zIndex: 5
    });
    this.frog = frog;
    this.x = frog.x;
    this.y = frog.y;
    this.end = false;
};

Death.prototype = new Sprite();
Death.prototype.step = function(dt) {
    this.f += dt;
    if (this.f >= 1 / 4) {
        this.f -= 1 / 4;
        this.frame++;
    }

    if (this.frame > sprites['death'].frames) {
        this.board.remove(this);
        if (!this.end)
            if (Game.lives <= 0) {
                lostGame();
            } else {
                this.board.add(new Frog());
            }
        this.end = true;

    }
};
var Water = function() {
    this.y = 48;
    this.x = 0;
    this.w = Game.width;
    this.h = 48 * 3;
    this.zIndex = 0;
};

Water.prototype = new Sprite();
Water.prototype.type = WATER;
Water.prototype.draw = function() {};
Water.prototype.step = function(dt) {

};

var Background = function() {
    this.setup('bg', {
        zIndex: 0
    });
    this.x = 0;
    this.y = 0;
};


Background.prototype = new Sprite();
Background.prototype.step = function(dt) {};

window.addEventListener("load", function() {

    Game.initialize("game", sprites, startGame);
});