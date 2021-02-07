/**
 * MyPatch
 * @constructor
 * @param scene - Reference to MyScene object
 * @param nPointsU - number of points in U direction
 * @param nPointsV - number of points in V direction 
 * @param nPartsU - number of divisions in U direction
 * @param nPartsV - number of divisions in V direction
 * @param controlPoints - control points
 */

class MyPatch extends CGFobject {
    constructor(scene, nPointsU, nPointsV, nPartsU, nPartsV, controlPoints) {
        super(scene);

        this.nPointsU = nPointsU;
        this.nPointsV = nPointsV;
        this.nPartsU = nPartsU;
        this.nPartsV = nPartsV;
        this.controlPoints = controlPoints;

        this.init();
    }

    init() {

        let nurbs = new CGFnurbsSurface(this.nPointsU - 1, this.nPointsV - 1, this.controlPoints);

        this.patch = new CGFnurbsObject(this.scene, this.nPartsU, this.nPartsV, nurbs);

    }

    display() {
        this.patch.display();
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
