/** 
 * Node - class that stores the node information
 */

class Node{
    /**
    * @constructor
    * @param nodeID - ID of the node 
    */

    constructor(nodeID){
        this.nodeID= nodeID;
        this.children = []; //are other nodes 
        this.leafs = []; // are primitives 
        this.textureID = null;
        this.materialID = null;
        this.transformation = null;

    }

    getId(){
        return this.nodeID;
    }

    setChildren(children){
        this.children = children;
    }


    setLeafs(leafs){
        this.leafs = leafs;
    }

    getChildren(){
        return this.children;
    }

    getLeafs(){
        return this.leafs;
    }

    setTexture(textureID){
        this.textureID=textureID;
    }

    getTexture(){
        return this.textureID;
    }

    setMaterial(materialID){
        this.materialID=materialID;
    }

    getMaterial(){
        return this.materialID;
    }

    setTransformation(transformation){
        this.transformation=transformation;
    }

    getTransformation(){
        return this.transformation
    }
    
    
}
