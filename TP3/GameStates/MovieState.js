


class MovieState extends GameState {
    constructor(orchestrator) {
        super(orchestrator)
    }

    init() {
        if (!this.orchestrator.playingMovie)
            this.orchestrator.gameMovie()

        this.orchestrator.updateInfo("Playing game movie")
        this.orchestrator.updateErrors("")
        endavailableButtons(this.orchestrator, ["Pause", "Play", "Main Menu", "Restart"])
    }

    handleReply(response) { }

    pickButton(obj, customId) {
        if (customId == 505) {//play/pause
            obj.pick()
            if (obj.getText() == "Pause") obj.changeButtonText("Play")
            else if (obj.getText() == "Play") obj.changeButtonText("Pause")
            this.orchestrator.pause()
        }
        else if (customId == 506) {//restart game
            obj.pick()
            this.orchestrator.restart()
        }
        else if (customId == 507) {//new game
            obj.pick()
            this.orchestrator.reset()
        }
        else return
    }

    update(time) {
        if (!this.orchestrator.playingMovie) return
        let move = this.orchestrator.gameSequence.getCurrentMove()
        if (move) {
            this.orchestrator.previousObj = move.origin.piece;
            this.orchestrator.finalObj = move.destination.piece;
            this.orchestrator.initialTile = move.origin
            this.orchestrator.finalTile = move.destination
            move.origin.piece.createAnimation(move.origin, move.destination)
            move.destination.piece.createAnimation(move.destination, move.origin)
            this.orchestrator.gameSequence.updateCurrentMove()
            this.orchestrator.changeState(new AnimationState(this.orchestrator))
        }
        else {
            this.orchestrator.playingMovie = false
            this.orchestrator.endMenu.replay.changeButtonText("Play Movie")
            this.orchestrator.changeState(new GameOverState(this.orchestrator))
        }

        return;
    }


}