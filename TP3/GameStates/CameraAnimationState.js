/**
 * 
 */
class CameraAnimationState extends GameState{
    constructor(orchestrator){
        super(orchestrator)
        this.orchestrator.updateInfo("")
        this.orchestrator.updateErrors("")
        this.orchestrator.updatePlayTime(0)
        this.orchestrator.scene.animateCamera()
        
    }


    init(){
        unColorTiles(this.orchestrator);
        return;
    }


    pickPiece(obj, customId){
        return;
    }



    update(time){

        if(this.orchestrator.scene.getCurrentCamera() == "player1"||this.orchestrator.scene.getCurrentCamera() == "player2"){
            let p1=this.orchestrator.scene.themeGraphs[this.orchestrator.scene.selectedTheme].views["player1"];
            let p2=this.orchestrator.scene.themeGraphs[this.orchestrator.scene.selectedTheme].views["player2"];
            console.log(p1);
            console.log(p2);
            if(this.orchestrator.scene.camera.active)
                this.orchestrator.scene.camera.update(time)

            if(this.orchestrator.scene.camera.active == false){
                this.orchestrator.changeState(new ReadyState(this.orchestrator));
            }
        }else{
            this.orchestrator.changeState(new ReadyState(this.orchestrator));
        }
            
        
    }

    checkTimeOut(time){}
    

}
