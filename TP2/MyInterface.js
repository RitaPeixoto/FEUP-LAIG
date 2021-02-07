/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    };
    /**
     * 
     * @param {*} views - views defined in the scene
     */
    createInterface(views){
        this.addAxisCheckBox();
        this.addLightsCheckbox();
        this.addLightsFolder();
        this.addCamerasDropDown(views);
    }

    addLightsFolder(){
        var  group = this.gui.addFolder("Lights");
        //group.open(), is comment for preference, can be uncommented
        const lights = this.scene.graph.lights;
        for(var key in lights){
            if(lights.hasOwnProperty(key)){
                /*Forming a map this.scene.lightValues that store in the enable value of a given key */
                this.scene.lightValues[key] = lights[key][0];
                group.add(this.scene.lightValues, key).onChange(this.scene.setLights.bind(this.scene));
            }
        }   
        
    }
    /**
     * 
     * @param {*} views - views defined in the scene
     */
    addCamerasDropDown(views){
        var viewValues = [];
        for(var key in views){
            if(views.hasOwnProperty(key)){
                viewValues.push(key)
            }   
        }
        //setting the cameras dropdown 
        this.gui.add(this.scene, "cameraID", viewValues).onChange(val => this.scene.updateCamera(val)).name("Camera");
        //this.gui.add(this.scene, 'camera', this.scene.objectIDs).name('Selected Object').onChange(this.scene.updateObjectComplexity.bind(this.scene));
    }

    addAxisCheckBox(){
        //setting the displayaxis checkbox
        this.gui.add(this.scene,'displayAxis').name("Display Axis");
    }
    addLightsCheckbox(){
        //setting the displaylights checkbox
        this.gui.add(this.scene,'displayLights').name("Display Lights").onChange(val => this.scene.setLights());
    }
}
