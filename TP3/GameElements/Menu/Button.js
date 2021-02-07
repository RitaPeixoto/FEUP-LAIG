/**
 * Button
 * @constructor
 * @param {*} scene 
 * @param {*} text - button text
 * @param {*} large - if it is large text or not
 */
class Button{
    /**
     * 
     
     */
    constructor(scene, text, large){
        this.scene = scene
        this.button = new MyCube(scene,1)
        this.buttonText = new MySpriteText(this.scene,text)
        this.picked = false;
        this.large = large;
        
        this.init()

    }
    init(){
        this.buttonMaterial = new CGFappearance(this.scene);
        this.buttonMaterial.setAmbient(1.0, 0.0, 0.0, 1);
        this.buttonMaterial.setDiffuse(1.0, 0.0, 0.0, 1);
        this.buttonMaterial.setSpecular(1.0, 0.0, 0.0, 1);
        this.buttonMaterial.setShininess(10.0);

        this.unavailableMaterial = new CGFappearance(this.scene);
        this.unavailableMaterial.setAmbient(0.92, 0.93, 0.95, 1);
        this.unavailableMaterial.setDiffuse(0.92, 0.93, 0.95, 1);
        this.unavailableMaterial.setSpecular(0.92, 0.93, 0.95, 1);
        this.unavailableMaterial.setEmission(0.0, 0.0, 0.0, 1);
        this.unavailableMaterial.setShininess(10.0);

        this.material = this.unavailableMaterial
    }

    pick(){
        this.picked = !this.picked
    }

    getText(){
        return this.buttonText.text
    }

    changeButtonText(text){
        this.buttonText.text = text
    }

    setAvailability(availability){
        this.availability = availability
        if(this.availability) this.material = this.buttonMaterial
        else this.material = this.unavailableMaterial
    }

    display(){
        this.scene.pushMatrix()
        this.scene.translate(1,0,1)

        if(!this.large)this.scene.scale(2,0.65,1)
        else this.scene.scale(3.9,0.65,1)

        if(this.picked) this.scene.scale(1,1,5)
        this.material.apply()
        this.button.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.translate(1.15,0.4,2)
        this.scene.scale(0.4,0.8,1)
        this.buttonText.display()
        this.scene.popMatrix()

        if(this.picked) this.pick()
    }
    
}