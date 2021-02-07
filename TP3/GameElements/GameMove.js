/**
 * GameMove
 * @constructor
 * @param scene - Reference to MyScene object
 * @param piece
 * @param origin
 * @param destination
 * @param gameBoard
 */
class GameMove {
    constructor(scene, origin, destination, gameBoard) {
        this.scene = scene;

        this.origin = origin;
        this.destination = destination;
        this.active = true;
    }

    resetAnimation() {
        this.origin.piece.animation = null
        this.destination.piece.animation = null
    }

}