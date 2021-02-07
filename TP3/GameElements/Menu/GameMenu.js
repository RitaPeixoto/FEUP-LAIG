/**
 * Menu
 * @constructor
 * @param {*} scene 
 */
class GameMenu extends Menu{
    constructor(scene){
        super(scene)
    }

    init(){
        this.name = new MySpriteText(this.scene, "Menu")
        
        this.undo = new Button(this.scene, "Undo", false)      
        this.buttons.push(this.undo)
        this.reset = new Button(this.scene, "Reset", false)
        this.buttons.push(this.reset)
        this.pause = new Button(this.scene, "Pause", false)
        this.buttons.push(this.pause)
        this.restart = new Button(this.scene, "Restart", true)
        this.buttons.push(this.restart)
        
        this.menuMaterial = new CGFappearance(this.scene);
        this.menuMaterial.setShininess(1.0);
        this.menuMaterial.setSpecular(1, 1, 1, 0.5);
        this.menuMaterial.setDiffuse(1, 1, 1, 0.5);
        this.menuMaterial.setAmbient(1, 1, 1, 0.5);
        this.menuMaterial.setEmission(0.5, 0.5, 0.5, 1.0);

    }

    display(){
		this.scene.clearPickRegistration();
        
        this.scene.pushMatrix()
        this.menuMaterial.apply()
        this.menu.display()
        
        
        this.scene.pushMatrix()
        this.scene.translate(-2.20,0.2,1.5)
        this.scene.registerForPick(501, this.buttons[0])
        this.buttons[0].display()
        this.scene.popMatrix()
       

        this.scene.pushMatrix()
        this.scene.translate(0.25,0.2,1.5)
        this.scene.registerForPick(502, this.buttons[1])
        this.buttons[1].display()
        this.scene.popMatrix()



        this.scene.pushMatrix()
        this.scene.translate(-1,-0.7,1.5)
        this.scene.registerForPick(503, this.buttons[2])
        this.buttons[2].display()
        this.scene.popMatrix()
        
        this.scene.pushMatrix()
        this.scene.translate(-1.0,-1.6,1.5)
        this.scene.registerForPick(504, this.buttons[3])
        this.buttons[3].display()
        this.scene.popMatrix()



        this.scene.pushMatrix()
        this.scene.translate(0.5,2,3)
        this.name.display()
        this.scene.popMatrix()

        this.scene.popMatrix()
    }
    
}