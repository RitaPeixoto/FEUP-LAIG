


class ReadyState extends GameState {
    constructor(orchestrator) {
        super(orchestrator)

    }

    init() {
        this.orchestrator.prolog.getMovablePiecesResquest(this.orchestrator.gameBoard, this.orchestrator.currentPlayer);
        this.orchestrator.updateInfo("Choose one of your pieces")
        this.orchestrator.updateErrors("")
        availableButtons(this.orchestrator, ["Undo", "Reset", "Pause", "Play", "Restart"])
    }

    handleReply(response) {
        unColorTiles(this.orchestrator);
        this.pickable = response;
        colorTiles(this.orchestrator, response)
    }

    /**
     * Verifies if the tile can be picked, if so goes to Choose next piece state
     * @param {*} obj 
     * @param {*} customId 
     */
    pickPiece(obj, customId) {
        if (this.orchestrator.currentPlayer != obj.player) { /*In this state player can only choose a piece that belongs to him */
            this.orchestrator.updateErrors("Can't choose this piece, this belongs to the other player")
            return;
        }

        this.x = Math.floor((customId - 1) / this.orchestrator.gameBoard.size);
        this.y = (customId - 1) % this.orchestrator.gameBoard.size;

        let comparableArray = [this.x, this.y, ""];
        let comparableArray2 = [this.x, this.y];

        if ((searchForArray(this.pickable, comparableArray) != -1) || (searchForArray(this.pickable, comparableArray2) != -1)) {
            obj.pick();
            this.orchestrator.previousPick = customId;
            this.orchestrator.previousObj = obj;
            this.orchestrator.startTile = obj.tile;
            this.orchestrator.changeState(new ChooseState(this.orchestrator))
        }

    }

    pickButton(obj, customId) {
        if (customId == 501) { //undo
            if (this.orchestrator.paused) return
            obj.pick()
            let move = this.orchestrator.gameSequence.getLastMove()

            if (move == -1) {
                this.orchestrator.updateErrors("No more moves to undo")
                return
            }

            this.orchestrator.previousObj = move.origin.piece;
            this.orchestrator.finalObj = move.destination.piece;
            this.orchestrator.initialTile = move.origin
            this.orchestrator.finalTile = move.destination


            move.destination.piece.createAnimation(move.destination, move.origin)
            move.origin.piece.createAnimation(move.origin, move.destination)

            this.orchestrator.undo()
            this.orchestrator.changeState(new AnimationState(this.orchestrator))

        }
        else if (customId == 502) { //reset
            obj.pick()
            this.orchestrator.reset()
        }
        else if (customId == 503) { //pause/play
            obj.pick()
            if (obj.getText() == "Pause") obj.changeButtonText("Play")
            else if (obj.getText() == "Play") obj.changeButtonText("Pause")
            this.orchestrator.pause()
        }
        else if (customId == 504) { //restart
            obj.pick()
            this.orchestrator.restart()
        }
        else return
    }

    checkTimeOut(time) {
        if (this.orchestrator.paused) return

        this.orchestrator.timeLeft -= (time - this.orchestrator.lastTime)

        if (this.orchestrator.timeLeft < 0) {
            this.orchestrator.updateErrors("You lost your turn")
            this.orchestrator.updatePlayTime(0)
            this.orchestrator.changePlayer()
            if(this.orchestrator.currentPlayer=="black")
                this.orchestrator.changeState(new CameraAnimationState(this.orchestrator,"player1"));
            else
                this.orchestrator.changeState(new CameraAnimationState(this.orchestrator,"player2")); //this is necessary to asks for the new choosable pieces
        }
        else this.orchestrator.updatePlayTime((this.orchestrator.timeLeft).toFixed(2))
    }
}