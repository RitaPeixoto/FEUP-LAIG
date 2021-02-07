/**
 * @abstract
 */

class BotState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
    }

    init() {
        this.orchestrator.prolog.moveRequest(this.orchestrator.gameBoard, this.orchestrator.currentPlayer, this.orchestrator.AiLevel1, this.orchestrator.AiLevel2);
        this.orchestrator.updateInfo("Bot is choosing its next move")
        availableButtons(this.orchestrator, ["Undo", "Reset", "Pause", "Play", "Restart"])
    }

    handleReply(response) {
        let customId;
        let obj;

        for (let i in this.orchestrator.gameBoard.tiles) {
            let id = this.orchestrator.gameBoard.tiles[i].id;
            let piece = this.orchestrator.gameBoard.tiles[i].piece;
            if (((Math.floor((id - 1) / this.orchestrator.gameBoard.size)) == response[0][0]) && (((id - 1) % this.orchestrator.gameBoard.size) == response[0][1])) {
                this.orchestrator.previousPick = id;
                this.orchestrator.previousObj = piece;
                this.orchestrator.startTile = piece.tile;
            }
            if (((Math.floor((id - 1) / this.orchestrator.gameBoard.size)) == response[1][0]) && (((id - 1) % this.orchestrator.gameBoard.size) == response[1][1])) {
                customId = id;
                obj = piece;
                this.orchestrator.finalPick = customId;
                this.orchestrator.finalObj = obj;
                this.orchestrator.finalTile = obj.tile;
            }
        }
        this.orchestrator.previousObj.pick();
        obj.pick();


        this.orchestrator.gameSequence.addGameMove(new GameMove(this.orchestrator.scene, this.orchestrator.gameBoard.tiles[this.orchestrator.previousPick - 1], this.orchestrator.gameBoard.tiles[customId - 1]));
        this.orchestrator.previousObj.createAnimation(this.orchestrator.gameBoard.tiles[this.orchestrator.previousPick - 1], this.orchestrator.gameBoard.tiles[customId - 1]);//creates animation of first piece. custom id is the id of the last picked piece
        obj.createAnimation(this.orchestrator.gameBoard.tiles[customId - 1], this.orchestrator.gameBoard.tiles[this.orchestrator.previousPick - 1]);



        this.orchestrator.changeState(new AnimationState(this.orchestrator));
    }

    pickButton(obj, customId) {
        if (customId == 501) { //undo
            if (this.orchestrator.mode == 4) return //botvsbot no undo is available
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

}