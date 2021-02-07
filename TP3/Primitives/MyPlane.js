/**
 * MyPlane
 * @constructor
 * @param scene - Reference to MyScene object
 * @param nPartsU - number of divisions in U direction
 * @param nPartsV - number of divisions in V direction
 */
/*
    Generate a plane of dimension 1x1 units, based on XZ, centered on the origin and with the visible face pointing to Y
*/

class MyPlane extends CGFobject {
    constructor(scene, nPartsU, nPartsV) {
        super(scene);

        this.nPartsU = nPartsU;
        this.nPartsV = nPartsV;

        this.init();
    }

    init() {
        this.controlPoints = [
            // U = 0
            [ // V = 0..1;
                [-0.5, 0.0, 0.5, 1],
                [-0.5, 0.0, -0.5, 1]

            ],
            // U = 1
            [ // V = 0..1
                [0.5, 0.0, 0.5, 1],
                [0.5, 0.0, -0.5, 1]
            ]
        ]


        let nurbs = new CGFnurbsSurface(1, 1, this.controlPoints);

        this.plane = new CGFnurbsObject(this.scene, this.nPartsU, this.nPartsV, nurbs);

    }

    display() {
        this.plane.display();
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

