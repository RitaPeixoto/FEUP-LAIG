/**
 * Board
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordinate corner 1
 * @param y1 - y coordinate corner 1
 * @param x2 - x coordinate corner 2
 * @param y2 - y coordinate corner 2
 */
class AuxiliarBoard extends CGFobject {
    constructor(scene, array) {
        super(scene);

        this.boardRepresentation = array

        let numberPieces = Math.pow(array.length, 2);
        this.size = Math.ceil(Math.pow(numberPieces, (1 / 3)));
        //this.size = array.length;

        this.board = new MyHalfCube(this.scene, 1.6);
        this.tiles = [];

        this.init(array);
    }

    init(array) {
        this.createBoardTiles(array);
        this.boardMaterial = new CGFappearance(this.scene);
        this.boardMaterial.setShininess(1.0);
        this.boardMaterial.setSpecular(1, 1, 1, 0.5);
        this.boardMaterial.setDiffuse(1, 1, 1, 0.5);
        this.boardMaterial.setAmbient(1, 1, 1, 0.5);
        this.boardMaterial.setEmission(0.5, 0.5, 0.5, 1.0);
        this.boardMaterial.loadTexture('./scenes/images/board6.jpg');
        this.boardMaterial.setTextureWrap('REPEAT', 'REPEAT');
    }

    changeTheme(theme) {

        //this.boardMaterial = theme[0];
        //this.boardTexture = theme[1][0];
        //this.boardMaterial.setTexture(this.boardTexture);
        //this.boardMaterial.setTextureWrap('REPEAT', 'REPEAT');

        let piece1 = theme[2];
        let piece2 = theme[3];
        let tile1 = theme[4];
        let tile2 = theme[5];
        for (let tile of this.tiles) tile.changeTheme(piece1, piece2, tile1, tile2);

    }

    createBoardTiles(array) {
        let id = 1
        let nTiles = this.size;
        for (let i = 0; i < nTiles; i++) {
            for (let j = 0; j < nTiles; j++) {
                for (let k = 0; k < nTiles; k++) {
                    if ((id) > Math.pow(array.length, 2)) {
                        break;
                    }
                    this.tiles.push(new BoardTile(this.scene, this, 2, k - 0.5, j - 0.5, id, array[parseInt((id - 1) / array.length)][(id - 1) % array.length], i));
                    id++;
                }
            }
        }
    }

    setTiles(tiles) {
        this.tiles = tiles
    }

    addPieceToTile(piece, tile) {
        tile.setPiece(piece);
    }

    removePieceFromTile(tile) {
        tile.unsetPiece();
    }
    switchTiles(initial, final) {
        this.removePieceFromTile(initial)
        this.removePieceFromTile(final);
        this.addPieceToTile(initial.removed, final);
        this.addPieceToTile(final.removed, initial);
        initial.removed = null;
        final.removed = null;

    }
    getPieceOfTile(tile) {
        return tile.getPiece();
    }

    getTileOfPiece(piece) {
        for (t in this.tiles) {
            if (t.piece == piece) return t;
        }
    }

    getTileWithCoordinates(x, y) {
        return this.tiles(x * this.size + y)
    }

    movePiece(tile1, tile2, pieceDest, pieceOrig) {
        this.addPieceToTile(pieceDest, tile1);
        this.addPieceToTile(pieceOrig, tile2);

    }
    unpick() {
        this.tiles.forEach(element => {
            element.unpick()
        });
    }
    update(time) {
        /*for(var tile of this.tiles){
            if(tile.piece != null){
                if(tile.piece.animation != null){
                    tile.piece.update(time);
                }
            }
        }*/
    }
    /**
     * Resets the board to its initial state
     */
    clone() {
        let k = 0
        for (let i = 0; i < this.boardRepresentation.length; i++) {
            for (let j = 0; j < this.boardRepresentation.length; j++) {
                this.tiles[k].piece = new Piece(this.scene, this.tiles[k].id, this.tiles[k], this.boardRepresentation[i][j])
            }
        }
    }

    display() {
        let id = 1;
        this.scene.pushMatrix();
        this.scene.translate(3.5, 0, 1);
        this.scene.pushMatrix()
        this.boardMaterial.apply()
        this.scene.scale(this.size, this.size, this.size)
        this.scene.translate(0, -0.25, 0);
        this.board.display()
        this.scene.popMatrix()

        this.scene.pushMatrix();
        for (let cell = 0; cell < this.tiles.length; cell++) {
            this.scene.pushMatrix()
            this.scene.translate(-0.5, 0, -0.5);
            this.tiles[cell].display(); //each tile 
            this.scene.popMatrix();
        }


        this.scene.popMatrix()
        this.scene.popMatrix();

    }

}

