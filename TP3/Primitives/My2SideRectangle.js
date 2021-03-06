/**
 * My2SideRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
class My2SideRectangle extends CGFobject {
    constructor(scene, x1, y1, x2, y2) {
        super(scene);
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            this.x1, this.y1, 0,	//0
            this.x2, this.y1, 0,	//1
            this.x1, this.y2, 0,	//2
            this.x2, this.y2, 0,	//3

            this.x1, this.y1, 0,	//4
            this.x2, this.y1, 0,	//5
            this.x1, this.y2, 0,	//6
            this.x2, this.y2, 0,	//7
        ];
        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2,
            1, 3, 2,

            6, 5, 4,
            6, 7, 5
        ];

        //Facing Z positive
        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,

            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1
        ];

        /*
        Texture coords (s,t)
        +----------> s
        |
        |
        |
        v
        t
        */

        this.texCoords = [
            0, 1,
            1, 1,
            0, 0,
            1, 0
        ]
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
     * @method updateTexCoords
     * Updates the list of texture coordinates of the rectangle
     * @param {Array} amplification - Array of texture coordinates, amplification[0] = afs, amplification[1] = aft
     */
    updateTexCoords(amplification) {
        let width = Math.abs(this.x2 - this.x1);
        let height = Math.abs(this.y2 - this.y1);


        this.texCoords = [
            0, height / amplification[1],
            width / amplification[0], height / amplification[1],
            0, 0,
            width / amplification[0], 0
        ];

        this.updateTexCoordsGLBuffers();
    }
}
