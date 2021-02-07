/**
 * GameOrchestrator
 * @constructor
 * @param scene - Reference to MyScene object
 */

class GameOrchestrator {
    constructor(scene, player1, player2, boardSize, playTime) {
        this.scene = scene;
        this.boardSize = boardSize;
        this.prolog = new PrologInterface(this);

        this.auxiliarBoard = null;//=new Board(this.scene, [["white", "black", "white", "black"], ["black", "white", "black", "white"], ["white", "black", "white", "black"], ["black", "white", "black", "white"]]);//new MyCube(this.scene,5);
        this.gameBoard = null;//new Board(this.scene, [["white", "black", "white", "black"], ["black", "white", "black", "white"], ["white", "black", "white", "black"], ["black", "white", "black", "white"]]);
        //this.gameBoard = new Board(this.scene, [["white","black"],["white", "black"]]);
        this.mode = { pvp: 1, pvc: 2, cvp: 3, cvc: 4 }

        if (player1.type == "p" && player2.type == "p") this.changeMode(this.mode.pvp);
        else if (player1.type == "c" && player2.type == "p") this.changeMode(this.mode.cvp);
        else if (player1.type == "p" && player2.type == "c") this.changeMode(this.mode.pvc);
        else if (player1.type == "c" && player2.type == "c") this.changeMode(this.mode.cvc);

        this.difficulty = { easy: 1, difficult: 2 }

        if (player1.type == "c") {
            if (player1.difficulty == "easy") this.AiLevel1 = (this.difficulty.easy)
            else if (player1.difficulty == "difficult") this.AiLevel1 = (this.difficulty.difficult)
        }
        else this.AiLevel1 = null
        if (player2.type == "c") {
            if (player2.difficulty == "easy") this.AiLevel2 = (this.difficulty.easy)
            else if (player2.difficulty == "difficult") this.AiLevel2 = (this.difficulty.difficult)
        }
        else this.AiLevel2 = null



        //this.auxBoard = new Board(this.scene, x1,y1,x2,y2);
        this.loaded = false;
        this.tilesLoaded = false;

        this.previousPick = null
        this.previousObj = null
        this.finalPick = null
        this.finalObj = null
        this.startTile = null
        this.finalTile = null
        this.auxiliarBoardOffset = [15, 0, 0];
        this.menu = null

        this.currentPlayer = "black";

        //this.changeState(new ReadyState(this));
        this.changeState(new LoadingState(this));

        this.init()

        this.playTime = playTime
        this.timeLeft = this.playTime
        this.lastTime = 0

        this.boardTranslation = 0
        if (this.boardSize == 6) this.boardTranslation = 1
        else if (this.boardSize == 4) this.boardTranslation = 2
        else if (this.boardSize == 8) this.boardTranslation = -0.5

        this.menuTranslation1 = 0
        if (this.boardSize != 5) this.menuTranslation1 = 1.5

        this.menuTranslation2 = 1.6
        if (this.boardSize == 4) this.menuTranslation2 = 3

    }
    init() {
        this.currentPlayer = "black";
        this.updateCurrentPlayer(this.currentPlayer)
        this.updateScore(1, 0)
        this.updateScore(2, 0)
        this.gameSequence = new GameSequence(this.scene)
        this.menu = new GameMenu(this.scene)
        this.endMenu = new EndMenu(this.scene)
        this.paused = false
        this.gameOver = false
        this.playingMovie = false
        this.lastTime = 0
        this.timeLeft = this.playTime
        this.winner = null

    }

    changePlayer() {
        this.currentPlayer = this.currentPlayer == "black" ? "white" : "black"
        this.updateCurrentPlayer(this.currentPlayer)
        this.timeLeft = this.playTime
        this.updatePlayTime(this.timeLeft)
    }

    changeState(state) {
        if (state instanceof ReadyState) {
            if (this.mode == 2) {
                if (this.currentPlayer == "white") {
                    state = new BotState(this)
                }
            } else if (this.mode == 3) {
                if (this.currentPlayer == "black") {
                    state = new BotState(this)
                }
            } else if (this.mode == 4) {
                state = new BotState(this)
            }
        }
        this.state = state;
        this.state.init();
    }

    handleReply(response) {
        this.state.handleReply(response)
    }

    /**
     * Updates animations
     * @param {*} time 
     */
    update(time) {
        if (this.loaded) {
            this.state.update(time)
            this.checkTimeOut(time)
            this.lastTime = time
        }
    }

    setTheme(theme) {
        this.theme = theme;
    }

    setPlayTime(time) {
        this.playTime = time
    }

    changeTheme(theme) {
        this.theme = theme;
        this.gameBoard.changeTheme(theme.board);
        this.auxiliarBoard.changeTheme(theme.board);
    }
    changeMode(mode) {
        this.mode = mode;
    }
    undo() {
        let res = this.gameSequence.undo()
        if (res == -1) this.updateErrors("No moves to undo")
    }

    reset() {
        location.reload()
    }

    quit() {
        this.prolog.close()
    }

    pause() {
        if (!this.paused) this.info = document.querySelector('div #info').textContent
        this.paused = !this.paused
        this.paused ? this.updateInfo("Game is paused") : this.updateInfo(this.info)
    }

    restart() {
        this.gameBoard.clone()
        this.gameBoard.unpick()
        this.changeTheme(this.scene.getCurrentTheme())
        let c = (this.currentPlayer == "white")
        this.init()
        c ? this.changeState(new CameraAnimationState(this,"player1")) : this.changeState(new ReadyState(this))
    }


    gameMovie() {
        this.gameBoard.clone()
        this.playingMovie = true
        this.changeTheme(this.scene.getCurrentTheme())
        this.gameSequence.moveReplay()
    }

    updateErrors(error) {
        document.getElementById("errors").innerText = error
    }
    updateInfo(info) {
        document.getElementById("info").innerText = info
    }
    updateScore(player, score) {
        if (player == 1) document.getElementById("player1-score").innerText = score
        else if (player == 2) document.getElementById("player2-score").innerText = score
    }

    updateCurrentPlayer(player) {
        let p = player == "black" ? 1 : 2
        document.getElementById("player").innerText = p
    }

    updatePlayTime(time) {
        document.getElementById("time").innerText = time
    }

    checkTimeOut(time) {
        this.state.checkTimeOut(time)
    }


    /**
     * Manages the picking
     * @param {*} mode 
     * @param {*} results 
     */
    managePick(mode, results) {
        if (mode == false) {  /* && some other game conditions */
            if (results != null && results.length > 0) { // any results?
                for (var i = 0; i < results.length; i++) {
                    var obj = results[i][0]; // get object from result
                    if (obj) { // exists?
                        var customId = results[i][1] // get id
                        this.pickedPiece(obj, customId);

                    }
                }
                // clear results
                results.splice(0, results.length);
            }
        }
    }

    /**
     * When picking is done, acts accordingly
     * @param {*} obj 
     * @param {*} customId 
     */
    pickedPiece(obj, customId) {
        if (obj instanceof Piece) this.state.pickPiece(obj, customId);
        else if (obj instanceof Button) this.state.pickButton(obj, customId)
    }

    display() {
        this.scene.pushMatrix();
        if (this.loaded) {
            this.scene.pushMatrix();
            this.scene.translate(this.auxiliarBoardOffset[0], this.auxiliarBoardOffset[1], this.auxiliarBoardOffset[2]);
            this.auxiliarBoard.display();
            this.scene.popMatrix();


            this.scene.pushMatrix();
            this.scene.translate(0, 0, this.boardTranslation)
            this.gameBoard.display();
            this.scene.popMatrix();
        }

        this.scene.pushMatrix();
        this.scene.translate(-1.80, 2.8, 2.1)
        this.scene.rotate(Math.PI / 2.0, 0, 1, 0)
        this.scene.scale(0.98, 1, 0.14)
        this.scene.pushMatrix()
        this.scene.translate(-this.menuTranslation1, 0, this.menuTranslation2)
        if (this.gameOver) this.endMenu.display()
        else {
            this.menu.display()
        }
        this.scene.popMatrix()
        this.scene.popMatrix()

        this.scene.popMatrix()
    }




}