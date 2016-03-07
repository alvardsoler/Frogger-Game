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
    }
};

var FROG = 1,
    CAR = 2,
    LOG = 3,
    WATER = 4;

var startGame = function() {
    Game.setBoard(0, new TitleScreen("Froggerr",
        "Press space to start playing",
        playGame));

};
var lostGame = function() {
    Game.setBoard(0, new TitleScreen("YOU LOST", "looser lol", startGame));
};
var winGame = function() {
    Game.setBoard(0, new TitleScreen("YOU WIN", "xd xd xd", startGame));
}
var playGame = function() {
    var bgBoard = new GameBoard();
    bgBoard.add(new Background());
    Game.setBoard(0, bgBoard);
    var gameBoard = new GameBoard();
    gameBoard.add(new Spawner());

    gameBoard.add(new Frog());
    gameBoard.add(new Home());
    gameBoard.add(new Water());

    Game.setBoard(1, gameBoard);
};

/* Classes */

var Spawner = function() {
    this.logs_respawn = 2;
    this.cars_respawn = 2;
    this.logsCounter = 0;
    this.carsCounter = 0;
    // Objetos a clonar
    this.log1 = new Log(0, 200);
    this.log2 = new Log(1, -175);
    this.log3 = new Log(2, 150);
    this.car1 = new Car(1, 200);
    this.car2 = new Car(2, -200);
    this.car3 = new Car(3, -200);
    this.car4 = new Car(4, 200);

};
Spawner.prototype = new Sprite();

Spawner.prototype.draw = function() {};
Spawner.prototype.step = function(dt) {
    this.logsCounter += dt;
    this.carsCounter += dt;
    if (this.logsCounter > this.logs_respawn) {
        this.board.add(Object.create(this.log1));
        this.board.add(Object.create(this.log2));
        this.board.add(Object.create(this.log3));
        this.logsCounter -= this.logs_respawn;
    }
    if (this.carsCounter > this.cars_respawn) {
        this.board.add(Object.create(this.car1));
        this.board.add(Object.create(this.car2));
        this.board.add(Object.create(this.car3));
        this.board.add(Object.create(this.car4));
        this.carsCounter -= this.cars_respawn;
    }
};


var Log = function(row, speed) {
    var seed = Math.random();
    this.setup('trunk', {});

    this.xVel = speed;
    this.x = (speed > 0) ? 0 : Game.width;
    this.y = 48 + row * 48;
    /*
    if ((Math.floor(seed * 2) + 1) == 1) {
        // se mueve de izquierda a derecha
        this.xVel = (Math.floor(seed * 150) + 100);
        console.log(this.xVel);
        this.x = 0;
    } else {
        //se mueve de derecha a izquierda
        this.xVel = -(Math.floor(seed * 150) + 100);
        console.log(this.xVel);
        this.x = Game.width;
    }

    this.y = 48 + ((Math.floor(seed * 3)) * 48);*/
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


var Car = function(row, speed) {
    var seed = Math.random();
    this.setup('car' + (row + 1), {});
    this.xVel = speed;
    this.x = (speed > 0) ? 0 : Game.width;
    /*
    if ((Math.floor(seed * 2) + 1) == 1) {
        // se mueve de izquierda a derecha
        this.xVel = (Math.floor(seed * 150) + 100);
        console.log(this.xVel);
        this.x = 0;
    } else {
        //se mueve de derecha a izquierda
        this.xVel = -(Math.floor(seed * 150) + 100);
        console.log(this.xVel);
        this.x = Game.width;
    }*/

    this.y = Game.height - 48 - (row * 48);
};
Car.prototype = new Sprite();
Car.prototype.type = CAR;

Car.prototype.step = function(dt) {
    this.x += this.xVel * dt;
    if (this.x + this.width < 0 || this.x > Game.width)
        this.board.remove(this);

    var collision = this.board.collide(this, FROG);
    if (collision) {
        this.board.remove(collision);
        this.board.add(new Death(collision));
    }
};




var Frog = function() {
    this.setup('frog', {
        reloadTime: 0.25,
        vx: 0
    });
    this.reload = this.reloadTime;
    this.x = Game.width / 2 - this.w / 2;
    this.y = Game.height - this.h;
    //this.y = 0;
}
Frog.prototype = new Sprite();
Frog.prototype.type = FROG;
Frog.prototype.onLog = function(vLog) {
    this.vx = vLog;
};

Frog.prototype.step = function(dt) {
    var col = this.board.collide(this);
    if (col.type === WATER) {
        this.board.remove(this);
        this.board.add(new Death(this));
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
        } else if (Game.keys['right']) {
            this.reload = this.reloadTime;
            this.x += this.w;
        } else if (Game.keys['left']) {
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
};
Home.prototype = new Sprite();
Home.prototype.step = function(dt) {
    var col = this.board.collide(this, FROG);
    if (col && col.type === FROG) {
        this.board.remove(col);
        winGame();
    }

};
Home.prototype.draw = function() {

};


var Death = function(frog) {
    this.setup('death', {
        frame: 0,
        f: 0
    });
    this.x = frog.x;
    this.y = frog.y;
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
        lostGame();
    }
};
var Water = function() {
    this.y = 48;
    this.x = 0;
    this.w = Game.width;
    this.h = 48 * 3;
    //this.h = 0;
};

Water.prototype = new Sprite();
Water.prototype.type = WATER;
Water.prototype.draw = function() {};
Water.prototype.step = function(dt) {

};

var Background = function() {
    this.setup('bg', {});
    this.x = 0;
    this.y = 0;
};


Background.prototype = new Sprite();
Background.prototype.step = function(dt) {};

window.addEventListener("load", function() {

    Game.initialize("game", sprites, startGame);
});