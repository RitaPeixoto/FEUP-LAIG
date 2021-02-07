/** 
 * Node - class that stores the node information
 */

class Node {
    /**
    * @constructor
    * @param nodeID - ID of the node 
    */

    constructor(nodeID) {

        this.nodeID = nodeID;
        this.children = []; //are other nodes 
        this.leafs = []; // are primitives 
        this.textureID = null;
        this.materialID = null;
        this.transformation = null;
        this.animation = null;

    }

    /* Sets and gets are not needed but we did it for readability */
    /*---------- SETS------------------- */
    setChildren(children) {
        this.children = children;
    }

    setLeafs(leafs) {
        this.leafs = leafs;
    }
    setTexture(textureID) {
        this.textureID = textureID;
    }

    setAnimation(animationID) {
        this.animation = animationID;
    }
    setMaterial(materialID) {
        this.materialID = materialID;
    }
    setTransformation(transformation) {
        this.transformation = transformation;
    }

    /*---------- GETS------------------- */
    getId() {
        return this.nodeID;
    }

    getChildren() {
        return this.children;
    }

    getLeafs() {
        return this.leafs;
    }

    getTexture() {
        return this.textureID;
    }

    getMaterial() {
        return this.materialID;
    }

    getTransformation() {
        return this.transformation
    }

    getAnimation() {
        return this.animation;
    }

}
