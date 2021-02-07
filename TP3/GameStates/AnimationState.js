/**
 * 
 */
class AnimationState extends GameState {
    constructor(orchestrator) {
        super(orchestrator)

        if (!this.orchestrator.playingMovie) this.orchestrator.updateInfo("Moving Pieces")
        this.orchestrator.updateErrors("")
        this.orchestrator.updatePlayTime(0)
    }

    init() {
        unColorTiles(this.orchestrator);
        if (this.orchestrator.playingMovie) endavailableButtons(this.orchestrator, ["Pause", "Play", "Restart", "Main Menu"])
        availableButtons(this.orchestrator, ["Pause", "Play", "Restart", "Reset"])
    }

    pickButton(obj, customId) {
        if (!this.orchestrator.playingMovie) {
            if (customId == 503) {
                if (obj.getText() == "Pause") obj.changeButtonText("Play")
                else if (obj.getText() == "Play") obj.changeButtonText("Pause")
                obj.pick()
                this.orchestrator.pause()
            }
            else return
        }
        else {
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


    }

    update(time) {
        if (this.orchestrator.previousObj.animation == null && this.orchestrator.finalObj.animation == null) return //just for precaution

        if (this.orchestrator.paused) return

        this.orchestrator.previousObj.update(time)
        this.orchestrator.finalObj.update(time)

        if (this.orchestrator.previousObj.animation.active) {
            if (this.orchestrator.previousObj.animation.ended) {
                if (this.orchestrator.previousObj.isPicked()) this.orchestrator.previousObj.pick()
                else this.orchestrator.previousObj.floating()
            }
        }

        if (this.orchestrator.finalObj.animation.active) {
            if (this.orchestrator.finalObj.animation.ended) {
                if (this.orchestrator.finalObj.isPicked()) this.orchestrator.finalObj.pick()
                else this.orchestrator.finalObj.floating()
            }
        }
        if (this.orchestrator.previousObj.animation.ended && this.orchestrator.finalObj.animation.ended) {
            this.orchestrator.previousObj.animation = null
            this.orchestrator.finalObj.animation = null
            this.orchestrator.gameBoard.switchTiles(this.orchestrator.previousObj.initialTile, this.orchestrator.previousObj.finalTile);
            if (!this.orchestrator.playingMovie)
                this.orchestrator.changeState(new CheckGameOverState(this.orchestrator));
            else this.orchestrator.changeState(new MovieState(this.orchestrator));
        }

    }



}