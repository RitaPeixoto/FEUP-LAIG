/** 
 * KeyFrameAnimation - class that stores the keyframe animation information
 */

class KeyFrameAnimation extends Animation{
    /**
    * @constructor
    * @param scene - Reference to MyScene object
    * @param animationID - ID of the animation 
    */

    constructor(scene,animationID){
        super(scene, animationID);

        this.keyframes = [];
        
        
        //variables where the current animation is being stored
        this.animationTranslation = vec3.create();
        this.animationRotation = vec3.create();
        this.animationScale = new vec3.fromValues(1,1,1);
        
        this.startTime = 0;
        this.endTime = 0;
        this.elapsedTime = 0;
        this.lastTime = 0;

        this.keyframeStartIndex = 0;
        this.keyframeEndIndex = 1;

        this.active = false;
        this.ended = false; 
    }

    addKeyFrame(keyFrame){

        this.keyframes.push(keyFrame);
        
        //to make sure it's in ascending time order
        this.keyframes.sort(function(a, b){ return a.instant - b.instant });
        
        this.startTime = this.keyframes[0].instant;
        this.endTime = this.keyframes[this.keyframes.length - 1].instant;

    }


    update(currentTime){
        //if animation reached the end, return
        if(this.ended) return;
        
        if (this.lastTime == 0){
            this.lastTime = currentTime;
        }

        //update elapsedTime based on lastTime and update lastTime
        this.elapsedTime += (currentTime - this.lastTime);
        this.lastTime = currentTime;

        //check if the keyframe should be active or not
        if(!this.active){
            
            if(this.elapsedTime >= this.startTime){ // only becomes visible after first keyframe instant
                this.active = true;
                // this.elapsedTime=0;
                return;
            }
            else 
                return;
        }

        //check if the animation should be active
        if(this.elapsedTime < this.startTime && !this.ended) return;
       
        //End of animation 
        if(this.elapsedTime >= this.endTime){
            this.ended = true; //the animation has ended but the object remains with the values of the geometric transformations of the  last keyframe
        }
        
        if(this.elapsedTime == this.keyframes[this.keyframeStartIndex].instant){// no need for interpolation, its in a matching keyframe instant
            this.animationTranslation = this.keyframes[this.keyframeStartIndex].translation;
            this.animationRotation = new vec3.fromValues(this.keyframes[this.keyframeStartIndex].rotation[0],this.keyframes[this.keyframeStartIndex].rotation[1],this.keyframes[this.keyframeStartIndex].rotation[2]);
            this.animationScale = this.keyframes[this.keyframeStartIndex].scale;
            return;
        }
        else if(this.elapsedTime == this.keyframes[this.keyframeEndIndex].instant){// no need for interpolation, its in a matching keyframe instant
            this.animationTranslation = this.keyframes[this.keyframeEndIndex].translation;
            this.animationRotation = new vec3.fromValues(this.keyframes[this.keyframeEndIndex].rotation[0],this.keyframes[this.keyframeEndIndex].rotation[1],this.keyframes[this.keyframeEndIndex].rotation[2]);
            this.animationScale = this.keyframes[this.keyframeEndIndex].scale;
            return;
        }

        //find the keyframes to interpolate between

        if (this.elapsedTime > this.keyframes[this.keyframeEndIndex].instant) {
            if (this.keyframes.length <= this.keyframeEndIndex + 1) {
                this.ended = true;
            } else {
                this.keyframeEndIndex++;
                this.keyframeStartIndex++;
            }
        }   
         
        /* INTERPOLATION */
        //It's not the end so we need to do interpolation
        let keyframeStartInstant = this.keyframes[this.keyframeStartIndex].instant;
        let keyframeEndInstant = this.keyframes[this.keyframeEndIndex].instant;
        let interpolationAmount = Math.min((this.elapsedTime - keyframeStartInstant) / (keyframeEndInstant-keyframeStartInstant),1);

        vec3.lerp(this.animationTranslation,this.keyframes[this.keyframeStartIndex].translation, this.keyframes[this.keyframeEndIndex].translation,interpolationAmount);

        vec3.lerp(this.animationRotation,this.keyframes[this.keyframeStartIndex].rotation, this.keyframes[this.keyframeEndIndex].rotation,interpolationAmount);
        
        vec3.lerp(this.animationScale,this.keyframes[this.keyframeStartIndex].scale, this.keyframes[this.keyframeEndIndex].scale,interpolationAmount);
    }

    apply(){

        this.scene.translate(this.animationTranslation[0],this.animationTranslation[1],this.animationTranslation[2]);
        this.scene.rotate(this.animationRotation[0],1,0,0);
        this.scene.rotate(this.animationRotation[1],0,1,0);
        this.scene.rotate(this.animationRotation[2],0,0,1);
        this.scene.scale(this.animationScale[0],this.animationScale[1],this.animationScale[2]); 

    }
    
    
}
