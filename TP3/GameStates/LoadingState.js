/**
 * @abstract
 */

class LoadingState extends GameState {
    constructor(orchestrator) {
        super(orchestrator);
        this.boxOpen = false;
    }

    init() {
        this.orchestrator.prolog.boardRequest(this.orchestrator.boardSize);
    }


    handleReply(response) {
        this.orchestrator.gameBoard = new Board(this.orchestrator.scene, response);
        this.orchestrator.auxiliarBoard = new AuxiliarBoard(this.orchestrator.scene, response);

        this.orchestrator.changeTheme(this.orchestrator.scene.getCurrentTheme());
        let id = 1;


        let nTiles = response.length;
        let auxTiles = [];
        for (let i = 0; i < nTiles; i++) {
            for (let j = 0; j < nTiles; j++) {
                for (let k = 0; k < nTiles; k++) {
                    if ((id) > Math.pow(response.length, 2)) {
                        break;
                    }

                    auxTiles.push(new BoardTile(this.orchestrator.scene, this, 2, this.orchestrator.auxiliarBoardOffset[0] - 0.5 + k, this.orchestrator.auxiliarBoardOffset[1] - 0.5 + i, id, response[parseInt((id - 1) / response.length)][(id - 1) % response.length], this.orchestrator.auxiliarBoardOffset[2] - 0.5 + j));

                    let p = new Piece(this.orchestrator.scene, id, this.orchestrator.gameBoard.tiles[id - 1], response[parseInt((id - 1) / response.length)][(id - 1) % response.length]);
                    this.orchestrator.auxiliarBoard.tiles[id - 1].insertPiece(p);
                    id++;
                }
            }
        }
        this.orchestrator.loaded = true;

        id = 1;

        for (let i = response.length - 1; i >= 0; i--) {

            for (let j = response.length - 1; j >= 0; j--) {
                this.orchestrator.auxiliarBoard.tiles[id - 1].piece.createAnimation(auxTiles[id - 1], this.orchestrator.gameBoard.tiles[id - 1], id * 0.3);
                id++;
            }
        }

    }

    update(time) {
        if (!this.orchestrator.loaded) {
            return;
        }
        if (!this.boxOpen) {
            this.orchestrator.auxiliarBoard.board.open++;
            if (this.orchestrator.auxiliarBoard.board.open == 50) {
                this.boxOpen = true;
            }
            return;
        }


        let anyActive = false;
        if (this.orchestrator.paused) return

        for (let i of this.orchestrator.auxiliarBoard.tiles) {
            if (i.piece == null)
                continue;
            anyActive = true;
            i.piece.update(time);
            if (i.piece.animation.active) {
                if (i.piece.animation.ended) {
                    if (i.piece.isPicked())
                        i.piece.pick()
                    else
                        i.piece.floating()

                    i.piece.animation = null;
                    this.orchestrator.gameBoard.tiles[i.id - 1].insertPiece(i.piece);
                    i.unsetPiece();
                }
            }
        }
        if (!anyActive) {
            this.orchestrator.auxiliarBoard.board.open--;
            if (this.orchestrator.auxiliarBoard.board.open == 0)
                this.orchestrator.changeState(new ReadyState(this.orchestrator));
        }

    }

}
