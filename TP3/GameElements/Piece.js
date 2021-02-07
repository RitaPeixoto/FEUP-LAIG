/**
 * Piece
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id
 * @param tile 
 * @param player - number of the player
 */

this.aux = 1
class Piece {
    constructor(scene, id, tile, player) {
        this.scene = scene;
        this.id = id;
        this.tile = tile;
        this.player = player;

        this.type = null;
        this.initMaterials();

        //if player is 1 pieces are black, if player is 2 pieces are white
        this.color = this.material;

        this.picked = false;
        this.float = false
        this.previousColor = null;

        this.animation = null;
        this.firstInstant = false;

        this.selectHeight = 0.4
    }

    initMaterials() {
        if (this.player == "black") {
            this.material = new CGFappearance(this.scene);
            this.material.setAmbient(0.0, 0.0, 0.0, 1);
            this.material.setDiffuse(0.0, 0.0, 0.0, 1);
            this.material.setSpecular(0.0, 0.0, 0.0, 1);
            this.material.setShininess(10.0);
        }
        else if (this.player == "white") {
            this.material = new CGFappearance(this.scene);
            this.material.setAmbient(1.0, 1.0, 1.0, 1);
            this.material.setDiffuse(1.0, 1.0, 1.0, 1);
            this.material.setSpecular(1.0, 1.0, 1.0, 1);
            this.material.setShininess(10.0);
        }

        this.pickedMaterial = new CGFappearance(this.scene);
        this.pickedMaterial.setAmbient(1.0, 0.0, 0.0, 1);
        this.pickedMaterial.setDiffuse(1.0, 0.0, 0.0, 1);
        this.pickedMaterial.setSpecular(1.0, 0.0, 0.0, 1);
        this.pickedMaterial.setShininess(10.0);
    }

    changeTheme(themePiece) {
        //pieces.push([pieceType, material, texture]);
        this.setType(themePiece[0]);
        this.color = themePiece[1];
        this.material = themePiece[1];

    }

    setType(type) { this.type = type; }

    getType() { return this.type; }

    getPlayer() { return this.player; }

    isPicked() { return this.picked; }

    pick() {
        if (!this.picked) {
            //this.color = this.pickedMaterial;
            this.picked = true;
        }
        else {
            this.color = this.material;
            this.picked = false
        }
        this.floating()
    }

    unpick() {
        this.picked = false
    }
    floating() {
        this.float = !this.float
    }

    createAnimation(initialTile, finalTile, begin = 0) {
        this.firstInstant = true;
        this.finalTile = finalTile;
        this.initialTile = initialTile;
        let speed = this.scene.speed
        let duration = Math.sqrt(Math.pow(finalTile.x - initialTile.x, 2) + Math.pow(finalTile.y - initialTile.y, 2)) / speed;
        if (duration == 0) duration += 1


        this.animation = new PieceAnimation(this.scene, "pieceAnimation", this.player);
        let start = new KeyFrame()
        start.translation = new vec3.fromValues(0, this.selectHeight, 0)
        start.instant = 0 + begin;
        this.animation.addKeyFrame(start);


        let end = new KeyFrame();
        end.translation = new vec3.fromValues(finalTile.x - initialTile.x, 0, finalTile.y - initialTile.y);
        end.instant = duration + begin;
        this.animation.addKeyFrame(end);

        return duration;
    }

    update(time) {
        if (this.animation != null)
            this.animation.update(time)
    }

    display() {

        this.scene.pushMatrix();
        this.color.apply();

        if (this.picked) {
            this.scene.translate(0, this.selectHeight, 0);
        }

        this.displayPiece();
        this.scene.pushMatrix();
        if (this.type instanceof MyCylinder) {
            this.scene.translate(0, -0.30, 0);
            this.scene.rotate(-Math.PI / 2.0, 1, 0, 0);
        }
        this.type.display()
        this.scene.popMatrix();

        this.scene.popMatrix();

    }

    displayPiece() {
        if (this.animation != null) {
            this.animation.apply()
        }
    }


}