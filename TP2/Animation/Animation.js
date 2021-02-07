/** 
 * Animation - class that stores the animation information
 * @constructor
 * @param scene - Reference to MyScene object
 * @param animationID - id of the animation
 */

class Animation{
    /**
    * @constructor
    * @param animationID - ID of the animation 
    */

    constructor(scene,animationID){
        this.scene = scene;
        this.animationID = animationID;
    }

    update(currentTime){}

    apply(){}
    
    
}
