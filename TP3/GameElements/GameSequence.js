
/**
 * GameSequence
 * @constructor
 * @param scene - Reference to MyScene object
 */
class GameSequence {
    constructor(scene) {
        this.scene = scene;
        this.moves = [];
        this.currentMove = 0;
    }
    addGameMove(move) {
        this.moves.push(move);
        this.currentMove = this.moves.length - 1;
    }

    setCurrentMove(currentMove) {
        this.currentMove = currentMove
    }

    getCurrentMove() {
        if (this.moves.length !== 0)
            return this.moves[this.currentMove];
    }

    getLastMove() {
        if (this.moves.length !== 0)
            return this.moves[this.currentMove]
        return -1
    }
    updateCurrentMove() {
        this.currentMove++
    }

    undo() {
        if (this.moves.length < 1) return -1
        this.moves.pop()
        this.currentMove = this.currentMove == 0 ? 0 : this.currentMove - 1
    }

    reset() {
        this.moves = []
        this.currentMove = 0
    }

    moveReplay() {
        this.moves.forEach(move => {
            move.resetAnimation()
        });
        this.currentMove = 0
    }

}