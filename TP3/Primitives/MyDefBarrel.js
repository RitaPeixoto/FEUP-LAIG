/**
 * MyDefBarrel
 * @constructor
 * @param scene - Reference to MyScene object
 * @param base - radius of the base
 * @param middle - radius of the middle section
 * @param height - height of the barrel
 * @param slices - parts per section
 * @param stacks - sections along height
 */

class MyDefBarrel extends CGFobject {
    constructor(scene, base, middle, height, slices, stacks) {
        super(scene);

        this.base = base;
        this.middle = middle;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.h = (4 / 3) * this.base;
        this.H = (4 / 3) * (this.middle - this.base);

        let hipotenuse = Math.sqrt(Math.pow(this.middle, 2) + Math.pow((this.height / 2), 2));
        this.angle = Math.acos(this.base / hipotenuse) + Math.asin(this.base / hipotenuse);


        this.initBuffers();
    }

    initBuffers() {


        this.controlPoints = [
            [ //P4
                [this.base, 0, 0, 1],//Q1
                [this.base + this.H, 0, this.H / Math.tan(this.angle), 1],//Q2
                [this.base + this.H, 0, this.height - this.H / Math.tan(this.angle), 1],//Q3
                [this.base, 0, this.height, 1],//Q4

            ],
            [ //P3
                [this.base, this.h, 0, 1],
                [this.base + this.H, (4 / 3) * (this.base + this.H), this.H / Math.tan(this.angle), 1],
                [this.base + this.H, (4 / 3) * (this.base + this.H), this.height - this.H / Math.tan(this.angle), 1],
                [this.base, this.h, this.height, 1],
            ],
            [ //P2
                [-this.base, this.h, 0, 1],
                [-this.base - this.H, (4 / 3) * (this.base + this.H), this.H / Math.tan(this.angle), 1],
                [-this.base - this.H, (4 / 3) * (this.base + this.H), this.height - this.H / Math.tan(this.angle), 1],
                [-this.base, this.h, this.height, 1],

            ],
            [ //P1
                [-this.base, 0, 0, 1],//Q1
                [-this.base - this.H, 0, this.H / Math.tan(this.angle), 1],//Q2
                [-this.base - this.H, 0, this.height - this.H / Math.tan(this.angle), 1],//Q3
                [-this.base, 0, this.height, 1],//Q4

            ],
        ];

        this.defbarrel = new MyPatch(this.scene, 4, 4, this.stacks, this.slices, this.controlPoints);


    }
    display() {

        this.defbarrel.display();
        this.scene.pushMatrix();

        this.scene.rotate(Math.PI, 0.0, 0.0, 1.0);
        this.defbarrel.display();

        this.scene.popMatrix();

    }

    /**
     * @method updateTexCoords
     * Updates the list of texture coordinates of the rectangle
     * @param {Array} coords - Array of texture coordinates
     */
    updateTexCoords(coords) {
        this.texCoords = [...coords];
        this.updateTexCoordsGLBuffers();
    }



}
