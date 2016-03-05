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
    Game.setBoard(1, gameBoard);
}

/* Classes */

var Frog = function() {
    this.setup('frog', {});
    this.reload = this.reloadTime;
    this.x = Game.width / 2 - this.w / 2;
    this.y = Game.height - Game.playerOffset - this.h;

    this.step = function(dt) {
        if (Game.keys['up']) {
            this.y -= 48;
        }
        if (Game.keys['down']) {
            this.y += 48;
        }

        if (this.y < 0)
            this.y = 0;
        if (this.y > Game.height - this.h)
            this.y = Game.height - this.h;
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