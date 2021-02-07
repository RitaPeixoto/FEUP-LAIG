/**
 * MyCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyHalfCube extends CGFobject {
    constructor(scene, size, open = 0) {
        super(scene);
        this.size = size;
        this.open = open
        this.rectangle = new My2SideRectangle(this.scene, -0.5, -0.5, 0.5, 0.5);

    }


    display() {
        this.scene.pushMatrix()
        this.scene.scale(this.size, this.size, this.size)
        this.scene.pushMatrix()

        //Right
        this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.scale(1, 0.5, 1);
        this.scene.translate(0, this.size / 2, 0);
        this.rectangle.display();
        this.scene.popMatrix();

        //Back
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.5);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(1, 0.5, 1);
        this.scene.translate(0, this.size / 2, 0);
        this.rectangle.display();
        this.scene.popMatrix();

        //Left
        this.scene.pushMatrix();
        this.scene.translate(-0.5, 0, 0);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.scene.scale(1, 0.5, 1);
        this.scene.translate(0, this.size / 2, 0);
        this.rectangle.display();
        this.scene.popMatrix();

        //Front
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.scene.scale(1, 0.5, 1);
        this.scene.translate(0, this.size / 2, 0);
        this.rectangle.display();
        this.scene.popMatrix();


        //Bottom
        this.scene.pushMatrix();
        this.scene.translate(0, -0.25, 0);
        this.scene.translate(0, this.size / 4, 0)
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.rectangle.display();
        this.scene.popMatrix();

        this.scene.popMatrix()



        //other half
        this.scene.pushMatrix()
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.translate(0, -this.size / 2 - this.size * this.open * 0.01, 0);

        //Right
        this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.scale(1, 0.5, 1);
        this.scene.translate(0, this.size / 2, 0);
        this.rectangle.display();
        this.scene.popMatrix();

        //Back
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.5);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(1, 0.5, 1);
        this.scene.translate(0, this.size / 2, 0);
        this.rectangle.display();
        this.scene.popMatrix();

        //Left
        this.scene.pushMatrix();
        this.scene.translate(-0.5, 0, 0);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.scene.scale(1, 0.5, 1);
        this.scene.translate(0, this.size / 2, 0);
        this.rectangle.display();
        this.scene.popMatrix();

        //Front
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.scene.scale(1, 0.5, 1);
        this.scene.translate(0, this.size / 2, 0);
        this.rectangle.display();
        this.scene.popMatrix();


        //Bottom
        this.scene.pushMatrix();
        this.scene.translate(0, -0.25, 0);
        this.scene.translate(0, this.size / 4, 0)
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.rectangle.display();
        this.scene.popMatrix();

        this.scene.popMatrix()
        this.scene.popMatrix()

    }



}