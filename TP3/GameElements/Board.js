/**
 * Board
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordinate corner 1
 * @param y1 - y coordinate corner 1
 * @param x2 - x coordinate corner 2
 * @param y2 - y coordinate corner 2
 */
class Board extends CGFobject {
    constructor(scene, array) {
        super(scene);

        this.boardRepresentation = array
        this.size = array.length;
        this.board = new GameBoard(this.scene, this.size)
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
                this.tiles.push(new BoardTile(this.scene, this, 2, i * 1.15, j * 1.15, id, array[i][j]));
                id++;
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

    unpick() {
        this.tiles.forEach(element => {
            element.unpick()
        });
    }

    /**
     * Resets the board to its initial state
     */
    clone() {
        let k = 0
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.tiles[k].piece = new Piece(this.scene, this.tiles[k].id, this.tiles[k], this.boardRepresentation[i][j])
                k++

            }
        }

    }

    display() {
        let id = 1;

        this.scene.pushMatrix()
        this.boardMaterial.apply()
        this.board.display()
        this.scene.popMatrix()

        this.scene.pushMatrix();
        for (let cell = 0; cell < this.tiles.length; cell++) {
            this.scene.registerForPick(id, this.tiles[cell]);
            if (this.tiles[cell].piece != null) {
                this.scene.registerForPick(id, this.tiles[cell].piece);
                id++;
            }
            else id++;
            this.tiles[cell].display(); //each tile 
        }

        this.scene.popMatrix()

    }

}

