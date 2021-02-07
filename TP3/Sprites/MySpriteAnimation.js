
/** 
 * MySpriteAnimation - class that stores 
 */

class MySpriteAnimation {
    /**
    * @constructor
    * @param scene - Reference to MyScene object
    * @param spritesheet - Reference to spritesheet
    * @param startCell - cell of the spritesheet where the animation starts
    * @param endCell - cell of the spritesheet where the animation starts
    * @param duration - duration of the full animation
    */

    constructor(scene, spritesheet, startCell, endCell, duration){
        this.scene = scene;

        this.spritesheet = spritesheet;
        this.startCell = startCell;
        this.endCell = endCell;
        this.duration = duration;
        
        this.retangle = new MyRectangle(this.scene,-0.5, -0.5, 0.5, 0.5);

        this.lastTime = 0;
        this.elapsedTime = 0;
        this.nCells = endCell - startCell + 1;
        this.currentIndex = 0;  
        this.activeState = 0;

        this.spriteTime = this.duration/this.nCells;
        
    }

    update(currentTime){

        this.lastTime = currentTime;
        
        //calculate elapsedTime
        let instant = this.lastTime % this.duration;
        
        //calculate which state is active, using elapsed time, duration, n of cells
        //save current state and other variables ( index of current sprite)        
        this.activeState = Math.floor(instant / this.spriteTime) + this.startCell;
        
    }

    display(){
     
        this.scene.gl.enable(this.scene.gl.BLEND); // enables blending
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);// defines the blending function


        this.spritesheet.activate();
        this.spritesheet.activateCellP(this.activeState); /* pass the shader the offset */
        this.retangle.display();//display base geometry
        this.scene.setActiveShader(this.scene.defaultShader); //set default shader



        this.scene.gl.disable(this.scene.gl.BLEND);        // disables blending
            
    } 
    
}
