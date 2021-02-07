/**
 * Menu
 * @constructor
 * @param {*} scene 
 */
class Menu{
    constructor(scene){
        this.scene = scene
        this.menu = new MyCube(scene, 5)
        this.buttons = []
        this.init()
    }

    /**
     * @abstract
     */
    init(){}

    resetButtons(){
        this.buttons.forEach(element => {
            element.setAvailability(false)
        });
    }
    makeAvailable(button){
        for(let i = 0; i < this.buttons.length; i++){
            if(this.buttons[i].getText() == button)
                this.buttons[i].setAvailability(true)
        }
    }
    /**
     * @abstract
     */
    display(){}
    
}