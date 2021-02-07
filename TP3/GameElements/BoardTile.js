/**
 * BoardTile
 * @constructor
 * @param scene - Reference to MyScene object
 * @param size- size of the tile
 * @param x - x position
 * @param y - y position
 * @param id - tile id
 */
class BoardTile extends CGFobject {
    constructor(scene, gameBoard, size, x, y, id, pieceColor, z = 0) {
        super(scene);
        this.size = size;
        this.x = x;
        this.y = y;
        this.z = z;
        this.id = id;
        this.gameBoard = gameBoard;
        this.plane = new MyPlane(this.scene, size, size);
        this.pieceColor = pieceColor;

        this.piece = null;
        this.removed = null
        this.highlight = false

        this.pieceMaterials = []
        this.init()
    }
    init() {
        this.pickedMaterial = new CGFappearance(this.scene);
        this.pickedMaterial.setAmbient(1.0, 0.0, 0.0, 1);
        this.pickedMaterial.setDiffuse(1.0, 0.0, 0.0, 1);
        this.pickedMaterial.setSpecular(1.0, 0.0, 0.0, 1);
        this.pickedMaterial.setShininess(10.0);

    }
    changeTheme(piece1, piece2, tile1, tile2) {
        this.pieceMaterials = []
        this.pieceMaterials.push(piece1);
        this.pieceMaterials.push(piece2);
        if (this.pieceColor == "black" && this.piece != null) {
            this.piece.changeTheme(piece1);
        }
        else if (this.pieceColor == "white" && this.piece != null) {
            this.piece.changeTheme(piece2);
        }
        if (this.pieceColor == 'black') {
            this.material = tile1[0];
            this.texture = tile1[1][0]
        }
        else if (this.pieceColor == 'white') {
            this.material = tile2[0];
            this.texture = tile2[1][0]
        }

    }

    insertPiece(piece) {
        if (this.pieceColor == 'black') {
            piece.changeTheme(this.pieceMaterials[0]);
        }
        else if (this.pieceColor == 'white') {
            piece.changeTheme(this.pieceMaterials[1]);
        }
        this.piece = piece;
        piece.tile = this;

    }

    setPiece(piece) {
        if (this.removed == null) this.removed = this.piece;
        this.piece = piece;
        this.piece.tile = this;

    }

    unsetPiece() {
        this.removed = this.piece;
        this.piece = null;
    }

    getPiece() {
        return this.piece;
    }

    highlight() {
        this.highlight = !this.highlight
    }
    unpick() {
        this.highlight = false
        this.piece.unpick()
    }

    display() {

        this.scene.pushMatrix();

        this.scene.translate(this.x, this.z, this.y); //move to its position    

        if (!this.highlight) {
            this.material.setTexture(this.texture)
            this.material.setTextureWrap('WRAP', 'WRAP')
            this.material.apply()
        }
        else this.pickedMaterial.apply()

        this.plane.display();

        if (this.piece != null) {
            this.scene.pushMatrix();
            this.scene.translate(0, 0.3, 0);
            this.piece.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();


    }



}

