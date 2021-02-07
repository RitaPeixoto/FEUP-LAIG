class GameOverState extends GameState {
    constructor(orchestrator) {
        super(orchestrator)
    }

    init() {
        this.orchestrator.updatePlayTime(0)
        this.orchestrator.prolog.getWinner(this.orchestrator.gameBoard, this.orchestrator.currentPlayer)
        this.orchestrator.updateErrors("")
        endavailableButtons(this.orchestrator, ["Play Movie", "Main Menu", "Restart"])
    }

    handleReply(response) {
        this.winner = response;
        let winner = null
        if (this.winner == "black") winner = "1"
        else if (this.winner == "white") winner = "2"

        this.orchestrator.updateInfo("Player " + winner + " won")

    }

    pickButton(obj, customId) {
        if (customId == 505) {//play movie
            obj.pick()
            obj.changeButtonText("Pause")
            this.orchestrator.changeState(new MovieState(this.orchestrator))
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
        return;
    }

    checkTimeOut(time) { }
}