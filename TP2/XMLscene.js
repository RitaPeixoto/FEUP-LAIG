/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();
        
        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.lightValues = [];

        this.axis = new CGFaxis(this);
        this.displayAxis = false;
        this.displayLights = false;

        //init shaders
        this.shader = new CGFshader(this.gl, "./scenes/shaders/shader.vert","./scenes/shaders/shader.frag");

        this.setUpdatePeriod(1000/60);
        this.initialTime = 0;

        this.loadingProgressObject = new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress = 0;

        this.defaultAppearance = new CGFappearance(this);

        

    }

    /**
     * Initializes the default camera.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
        this.interface.setActiveCamera(this.camera);
    }
    /**
     * Initializes the scene cameras.
     */

    initXMLCameras(){
        this.cameraID=this.graph.defaultCameraId;
        this.camera = this.graph.views[this.graph.defaultCameraId];
        this.interface.setActiveCamera(this.default);
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.
        
        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.
                
            if (this.graph.lights.hasOwnProperty(key)) {
                
                var graphLight = this.graph.lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);
                
                if(this.displayLights){
                    this.lights[i].setVisible(true);
                }
                else
                    this.lights[i].setVisible(false);
               
                
                if (this.lights[i][0]){
                    this.lights[i].enable();
                }
                else{
                    this.lights[i].disable();
                }
                this.lights[i].update();

                i++;
            }
        }
    }
    /**
     * Update the current camera according to a change in the  cameras dropdown in the interface
     */
    updateCamera(newCamera) {
        this.cameraID = newCamera;
        this.camera = this.graph.views[this.cameraID];
        this.interface.setActiveCamera(this.camera);
    }
    /**
     * Enables the lights accordingly to the lights chosen in the interface
     */
    setLights() {
        var i = 0;
        // Lights index.
        
        // Reads the lights from the lightValues map.
        for (var key in this.lightValues) {
            if (this.lightValues.hasOwnProperty(key)) {
                this.lights[i].setVisible(this.displayLights);
                if (this.lightValues[key]){
                    this.lights[i].enable();
                }
                else{
                    this.lights[i].disable();
                }		
    
                this.lights[i].update();
    
                i++;
            }
        }
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        //default appearance
        this.gl.clearColor(...this.graph.background);

        this.setGlobalAmbientLight(...this.graph.ambient);  

        
        //cameras
        this.initCameras();

        this.initXMLCameras();

        //initializing the interface elements
        this.interface.createInterface(this.graph.views); 
      
        //lights
        this.initLights();

        this.setUpdatePeriod(100);

        this.sceneInited = true;
    }

     update(time){
        if(this.initialTime == 0){
            this.initialTime = time/1000;
        }
    
       let delta = (time/1000) - this.initialTime;
       
        //console.log(delta);
        //updates animations based on current time
         if(this.sceneInited){

             if(this.graph.animations == undefined) return;

             for(let animation in this.graph.animations){ //update keyframeanimations
                this.graph.animations[animation].update(delta); // delta is the time in seconds since the beginning of the program
             }

             if(this.graph.spriteanimations == undefined) return;
             
             for(let i = 0; i < this.graph.spriteanimations.length; i++){ //update spriteanimations
                 this.graph.spriteanimations[i].update(delta);
             }
         }
     }



    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.setLights();
        
        this.pushMatrix();
        
   
        if (this.sceneInited) {
            // Draw axis
            if(this.displayAxis)
                this.axis.display();

            this.defaultAppearance.apply();
            
            //set the active camera, necessary for being able to move the camera around
            this.interface.setActiveCamera(this.camera);

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }
        else{
            // Show some "loading" visuals
            this.setDefaultAppearance();

            this.rotate(-this.loadingProgress/10.0,0,0,1);
            
            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}