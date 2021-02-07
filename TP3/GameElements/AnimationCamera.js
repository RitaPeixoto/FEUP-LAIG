/** 
 * CameraAnimation - class that stores the keyframe animation information
 */

class AnimationCamera extends CGFcamera{
    constructor(orchestrator, far, fov, near, position, target){
        super(fov,near, far, position, target)

        this.orchestrator = orchestrator
        this.animationTime = 2.5
        this.elapsedTime = 0
        this.lastTime = 0
        this.angle = 0
        this.active = false


    }

    activateCamera(){
        this.elapsedTime = 0
        this.angle = 0
        this.lastTime = 0
        this.active = true
    }


    update(currentTime){
        
        if(this.active){
            if (this.lastTime == 0){
                this.lastTime = currentTime;
            }
            this.elapsedTime += (currentTime - this.lastTime)
            if(this.elapsedTime >= this.animationTime){
                if(this.orchestrator.currentPlayer=="black"){
                    this.setPosition(this.orchestrator.scene.themeGraphs[this.orchestrator.scene.selectedTheme].views["player1"].position)
                    this.setTarget(this.orchestrator.scene.themeGraphs[this.orchestrator.scene.selectedTheme].views["player1"].target)
                }else if(this.orchestrator.currentPlayer=="white"){
                    this.setPosition(this.orchestrator.scene.themeGraphs[this.orchestrator.scene.selectedTheme].views["player2"].position)
                    this.setTarget(this.orchestrator.scene.themeGraphs[this.orchestrator.scene.selectedTheme].views["player2"].target)
                }
                this.active = false
                return
            }

            let interpolationAmount = Math.min(this.elapsedTime/this.animationTime,1)
            let easingFactor = easeInOutCubic(interpolationAmount)

            let i = Math.PI * easingFactor - this.angle
            let finalpos;
            let finaltarget;
            let translatePos=[0,0,0,0];
            let translateTarget=[0,0,0,0];

            if(this.orchestrator.currentPlayer=="black"){
                finalpos=this.orchestrator.scene.themeGraphs[this.orchestrator.scene.selectedTheme].views["player1"].position;
                finaltarget=this.orchestrator.scene.themeGraphs[this.orchestrator.scene.selectedTheme].views["player1"].target;
            }else if(this.orchestrator.currentPlayer=="white"){
                finalpos=this.orchestrator.scene.themeGraphs[this.orchestrator.scene.selectedTheme].views["player2"].position;
                finaltarget=this.orchestrator.scene.themeGraphs[this.orchestrator.scene.selectedTheme].views["player2"].target;
            }

            vec4.lerp(translatePos,this.position,finalpos,interpolationAmount);
            vec4.lerp(translateTarget, this.target,finaltarget,interpolationAmount);

            this.setPosition(translatePos);
            this.setTarget(translateTarget);
            this.angle += i
        }
      
    }
    
}
