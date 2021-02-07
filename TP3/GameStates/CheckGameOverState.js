class CheckGameOverState extends GameState {
    constructor(orchestrator) {
        super(orchestrator)
    }

    init() {
        this.orchestrator.updatePlayTime(0)
        /* Update score */
        this.orchestrator.prolog.getcurrentscore(this.orchestrator.gameBoard, "black")
        this.orchestrator.prolog.getcurrentscore(this.orchestrator.gameBoard, "white")
        this.orchestrator.prolog.getGameOver(this.orchestrator.gameBoard, this.orchestrator.currentPlayer) //check if game is over
        this.aux = 1
        availableButtons(this.orchestrator, [])
    }

    handleReply(response) {
        if (this.aux <= 2) this.orchestrator.updateScore(this.aux, response)
        else this.checkGameOver(response)
        this.aux++
    }

    checkGameOver(response) {
        if (response == '') { //if response is null goes back to ready state
            this.orchestrator.changePlayer();
            if(this.orchestrator.currentPlayer==="black"){
                console.log("player black");
                this.orchestrator.changeState(new CameraAnimationState(this.orchestrator,"player1"));}
            else{
                console.log("player white");
                this.orchestrator.changeState(new CameraAnimationState(this.orchestrator,"player2"));
            }
        }
        else {//if there is a winner goes to gameover state
            this.orchestrator.gameOver = true
            this.orchestrator.changeState(new GameOverState(this.orchestrator))
        }

    }

}