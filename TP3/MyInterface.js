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
        this.scene.gui = this;
        this.processKeyboard = function () { };
        this.activeKeys = {};
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    };


    /**
     * 
     * @param {*} views - views defined in the scene
     */
    createInterface(lights, views, themes) {
        //this.addAxisCheckBox()
        this.addQuit()
        this.addPlayTime()
        this.addSpeed()
        this.addThemeDropDown(themes)
        this.addLightsFolder(lights)
        this.addCamerasDropDown(views)


    }

    updateInterface(lights, views) {
        if (this.camerasDropDown) {
            this.gui.remove(this.group2)
            this.addCamerasDropDown(views)
        }
        if (this.group) {
            this.gui.removeFolder(this.group)
            this.addLightsFolder(lights)
        }
    }

    addLightsFolder(lights) {
        this.group = this.gui.addFolder("Lights");
        this.addLightsCheckbox()
        //group.open(), is comment for preference, can be uncommented

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                /*Forming a map this.scene.lightValues that store in the enable value of a given key */
                this.scene.lightValues[key] = lights[key][0];
                this.group.add(this.scene.lightValues, key).onChange(this.scene.setLights.bind(this.scene));
            }
        }

    }
    /**
     * 
     * @param {*} views - views defined in the scene
     */
    addCamerasDropDown(views) {
        this.group2 = this.gui.addFolder("Views");
        var viewValues = [];
        for (var key in views) {
            if (views.hasOwnProperty(key)) {
                viewValues.push(key)
            }
        }
        //setting the cameras dropdown 
        this.group2.add(this.scene, "cameraID", viewValues).onChange(val => this.scene.updateCamera()).name("Camera")
    }

    addThemeDropDown(themes) {
        this.gui.add(this.scene, "selectedScene", themes).onChange(val => this.scene.changeTheme(val)).name("Selected theme");
    }
    /*addAxisCheckBox() {
        //setting the displayaxis checkbox
        this.gui.add(this.scene, 'displayAxis').name("Display Axis");
    }*/
    addLightsCheckbox() {
        //setting the displaylights checkbox
        this.group.add(this.scene, 'displayLights').name("Display Lights").onChange(val => this.scene.setLights());
    }


    addQuit() {
        this.gui.add(this.scene.orchestrator, 'quit').name('Quit')
    }

    addPlayTime() {
        this.gui.add(this.scene, 'playTime', 10, 120, 10).name("PlayTime").onChange(this.scene.updatePlayTime.bind(this.scene));
    }
    addSpeed() {
        this.gui.add(this.scene, 'speed', 1, 10, 0.5).name("Animation Speed")
    }

}
