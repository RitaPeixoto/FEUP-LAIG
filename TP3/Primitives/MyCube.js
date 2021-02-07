/**
 * MyCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyCube extends CGFobject {
    constructor(scene, size) {
        super(scene);
        this.size = size;
        this.rectangle = new My2SideRectangle(this.scene, -0.5, -0.5, 0.5, 0.5);

    }


    display() {
        this.scene.pushMatrix()
        this.scene.scale(this.size, this.size, this.size)

        //Right
        this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.rectangle.display();
        this.scene.popMatrix();

        //Back
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.5);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.rectangle.display();
        this.scene.popMatrix();

        //Left
        this.scene.pushMatrix();
        this.scene.translate(-0.5, 0, 0);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.rectangle.display();
        this.scene.popMatrix();

        //Front
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.rectangle.display();
        this.scene.popMatrix();

        //Top
        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.rectangle.display();
        this.scene.popMatrix();

        //Bottom
        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.rectangle.display();
        this.scene.popMatrix();

        this.scene.popMatrix()

    }



}