/** 
 * KeyFrame - class that stores the keyframe information
 */

class KeyFrame {
    /**
    * @constructor
    */

    constructor(){
        this.instant = 0;
        this.translation = new vec3.fromValues(0,0,0);
        this.rotation = new vec3.fromValues(0,0,0);
        this.scale = new vec3.fromValues(1,1,1);
    }
    
}