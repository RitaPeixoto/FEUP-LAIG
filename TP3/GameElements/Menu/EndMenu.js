/**
 * EndMenu
 * @constructor
 * @param {*} scene 
 */
class EndMenu extends Menu{
    
    constructor(scene){
        super(scene)
    }

    init(){
        this.name = new MySpriteText(this.scene, "Menu")

        this.replay = new Button(this.scene, "Play Movie", true)      
        this.buttons.push(this.replay)
        this.newgame = new Button(this.scene, "Restart", true)
        this.buttons.push(this.newgame)
        this.main = new Button(this.scene, "Main Menu", true)
        this.buttons.push(this.main)


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
        this.scene.translate(-1,0.2,1.5)
        this.scene.registerForPick(505, this.buttons[0])
        this.buttons[0].display()
        this.scene.popMatrix()
       

        this.scene.pushMatrix()
        this.scene.translate(-1,-0.8,1.5)
        this.scene.registerForPick(506, this.buttons[1])
        this.buttons[1].display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.translate(-1,-1.8,1.5)
        this.scene.registerForPick(507, this.buttons[2])
        this.buttons[2].display()
        this.scene.popMatrix()
        
        this.scene.pushMatrix()
        this.scene.translate(0.5,2,3)
        this.name.display()
        this.scene.popMatrix()

        this.scene.popMatrix()
    }
    
}