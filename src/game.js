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


var playGame = function() {
    var bgBoard = new GameBoard();
    bgBoard.add(new Background());
    Game.setBoard(0, bgBoard);
    var gameBoard = new GameBoard();
    gameBoard.add(new Frog());
    gameBoard.add(new Car());
    gameBoard.add(new Car());
    Game.setBoard(1, gameBoard);
}

/* Classes */

var Car = function() {
    var seed = Math.random();
    this.setup('car' + (Math.floor(seed * 5) + 1), {

    });

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

    this.y = Game.height - 48 - ((Math.floor(seed * 4) + 1) * 48);

    this.step = function(dt) {
        this.x += this.xVel * dt;
        if (this.x + this.width < 0 || this.x > Game.width)
            this.board.remove(this);
    };

};

Car.prototype = new Sprite();

var Frog = function() {
    this.setup('frog', {
        reloadTime: 0.25
    });
    this.reload = this.reloadTime;
    this.x = Game.width / 2 - this.w / 2;
    this.y = Game.height - this.h;

    this.step = function(dt) {
        this.reload -= dt;
        if (this.reload <= 0) {
            if (Game.keys['up']) {
                this.reload = this.reloadTime;
                this.y -= this.h;

            }
            if (Game.keys['down']) {
                this.reload = this.reloadTime;
                this.y += this.h;
            }
            if (Game.keys['right']) {
                this.reload = this.reloadTime;
                this.x += this.w;
            }

            if (Game.keys['left']) {
                this.reload = this.reloadTime;
                this.x -= this.w;
            }


            if (this.y < 0) this.y = 0;
            else if (this.y > Game.height - this.h) this.y = Game.height - this.h;
            if (this.x < 0) this.x = 0;
            else if (this.x > Game.width - this.w) this.x = Game.width - this.w;
        }
    };
};

Frog.prototype = new Sprite();

var Background = function() {
    this.setup('bg', {});
    this.x = 0;
    this.y = 0;
    this.step = function(dt) {};
};

Background.prototype = new Sprite();

window.addEventListener("load", function() {
    Game.initialize("game", sprites, playGame);
});