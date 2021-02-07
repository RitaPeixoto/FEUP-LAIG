const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var ANIMATIONS_INDEX = 6;
var SPRITESHEETS_INDEX = 7;
// var NODES_WITH_ANIMATION_INDEX = 7;
var NODES_INDEX = 6;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {

    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = []; //all nodes of the scene

        this.spriteanimations = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block. Also makes sure the tags are in the correct order and aren't missing
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf") //the file must begin and end with lsf tag, it's mandatory so we're ending the program
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "[FILE] Tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("[FILE] Tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "[FILE] Tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("[FILE] Tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "[FILE] Tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("[FILE] Tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "[FILE] Tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("[FILE] Tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "[FILE] Tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("[FILE] Tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "[FILE] Tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("[FILE] Tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }
        //<animations>
        var animations = false;
        if ((index = nodeNames.indexOf("animations")) == -1)
            this.onXMLMinorError("[FILE] Tag <animations> not defined");
        else {
            animations = true;
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("[FILE] Tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }
        //<spritesheets>
        var spritesheets = false;
        if ((index = nodeNames.indexOf("spritesheets")) == -1)
            this.onXMLMinorError("[FILE] Tag <spritesheets> not defined");
        else {
            spritesheets = true;
            if (index != SPRITESHEETS_INDEX)
                this.onXMLMinorError("[FILE] Tag <spritesheets> out of order");

            //Parse spritesheets block
            if ((error = this.parseSpritesheets(nodes[index])) != null)
                return error;
        }


        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "[FILE] Tag <nodes> missing";
        else {
            if (index != (NODES_INDEX + spritesheets + animations))
                this.onXMLMinorError("[FILE] Tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("All parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if (rootIndex == -1)
            return "[INITIALS] No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');

        if (id == null)
            return "[INITIALS] No root id defined for scene.";

        this.idRoot = id;


        // Get axis length        
        if (referenceIndex == -1)
            this.onXMLMinorError("[INITIALS] No axis_length defined for scene, assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');

        if (axis_length == null)
            this.onXMLMinorError("[INITIALS] No axis_length defined for scene, assuming 'length = 1'");
        else if (axis_length < 0)
            this.onXMLMinorError("[INITIALS] Invalid axis_length defined for scene, assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    //TO DO:store the default camera
    parseViews(viewsNode) {
        this.views = [];
        this.defaultCameraId = this.reader.getString(viewsNode, 'default');//the default camera id is stored in position 0

        if (this.defaultCameraId == null)
            this.onXMLError("[VIEWS] No default view defined, using a default");

        var children = viewsNode.children;
        var failed = 0, hasOne = null;

        for (let i = 0; i < children.length; i++) {

            var new_node = children[i];

            if (new_node.nodeName != "perspective" && new_node.nodeName != "ortho") { //check if tag is correctly defined
                this.onXMLMinorError("[VIEWS] Unknown tag in parsing: " + new_node.nodeName + ", skipping it");
                continue;
            }

            //check if node id doesn't already exist
            if (this.views[new_node.id] != null) {
                this.onXMLError("[VIEWS] Repeated id " + new_node.id + ", skipping it");
                continue;
            }

            if ((new_node.nodeName == "perspective" || new_node.nodeName == "ortho") && !failed) {
                var camera = this.parseCamera(new_node);
                if (camera != null)
                    this.views[new_node.id] = camera;
                else
                    failed = 1;
            }
            // if there isn't a fully right parsed view and this one hasn't failed, it means we have now a fully right parsed view
            if (failed == 0 && hasOne == null) {
                hasOne = new_node.id;
            }
            failed = 0;
        }
        //if there isn't a defined default camera
        if (this.views[this.defaultCameraId] == null) {
            this.onXMLError("[VIEWS] The assigned default view is not defined");
            if (hasOne != null) {//if there is at least one rightly parsed camera, the default one is one of those
                this.defaultCameraId = hasOne;
            }
            else {//it's defined a default camera
                this.views["default"] = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
                this.defaultCameraId = "default";
            }
        }

        this.log("Parsed views and cameras");
        return null;
    }

    /**   
   * Parses the camera information
   * @param new_node - new camera node 
   */

    parseCamera(new_node) {
        let parameters = new_node.children;
        let from = null;
        let to = null;
        let up = [0.0, 1.0, 0.0]; //default values, since it is optional to define it 

        for (let i = 0; i < parameters.length; i++) {//getting the value of each parameter, checking for errors
            let x = this.reader.getFloat(parameters[i], 'x');
            let y = this.reader.getFloat(parameters[i], 'y');
            let z = this.reader.getFloat(parameters[i], 'z');
            if (x == null || y == null || z == null || isNaN(x) || isNaN(y) || isNaN(z)) {
                this.onXMLError("[VIEWS] Wrong coordinates for camera " + new_node.id + ", skipping it.");
                return null;
            }

            if (parameters[i].nodeName == "from") {
                from = [x, y, z];
            }
            else if (parameters[i].nodeName == "to") {
                to = [x, y, z];
            }
            else if (parameters[i].nodeName == "up" && new_node.nodeName != "ortho") {
                this.onXMLMinorError("[VIEWS] \"up\" tag declared on non ortho cam");
            }
            else if ((parameters[i].nodeName == "up" && new_node.nodeName == "ortho")) {
                up = [x, y, z];
            }
            else {
                this.onXMLError("[VIEWS] unknown/missing tag <" + parameters[i].nodeName + ">");
                return null;
            }
        }

        if (new_node.nodeName == "perspective") {
            let angle = this.reader.getFloat(new_node, 'angle');
            let near = this.reader.getFloat(new_node, 'near');
            let far = this.reader.getFloat(new_node, 'far');

            if (isNaN(angle) || isNaN(near) || isNaN(far) || !Array.isArray(from) || !Array.isArray(to) || angle == null || near == null || far == null || from == null || to == null) {
                this.onXMLError("[VIEWS] Invalid values on perspective camera id: " + new_node.id + ", skipping it");
                return null;
            }
            if (near < 0 || far < 0 || angle < 0) {
                this.onXMLError("[VIEWS] Invalid values on perspective camera id: " + new_node.id + ", Values cannot be negative. Skipping it.");
                return null;
            }
            if (near > far) {
                this.onXMLError("[VIEWS] Invalid values on perspective camera id: " + new_node.id + ", value \"near\" must be inferior or equal to \"far\". Skipping it.");
                return null;
            }
            return new CGFcamera(angle * DEGREE_TO_RAD, near, far, vec3.fromValues(from[0], from[1], from[2]), vec3.fromValues(to[0], to[1], to[2]));
        }
        else if (new_node.nodeName == "ortho") {
            let left = this.reader.getFloat(new_node, 'left');
            let right = this.reader.getFloat(new_node, 'right');
            let bottom = this.reader.getFloat(new_node, 'bottom');
            let top = this.reader.getFloat(new_node, 'top');
            let near = this.reader.getFloat(new_node, 'near');
            let far = this.reader.getFloat(new_node, 'far');

            if (isNaN(left) || isNaN(right) || isNaN(bottom) || isNaN(top) || isNaN(near) || isNaN(far) || top == null || near == null || far == null || bottom == null || left == null || right == null || !Array.isArray(up)) {
                this.onXMLError("[VIEWS] Invalid values on ortho camera id: " + new_node.id + ", skipping it");
                return null;
            }
            if (near < 0 || far < 0) {
                this.onXMLError("[VIEWS] Invalid values on ortho camera id: " + new_node.id + ", Values cannot be negative. Skipping it.");
                return null;
            }
            if (near > far) {
                this.onXMLError("[VIEWS] Invalid values on ortho camera id: " + new_node.id + ", value \"near\" must be inferior or equal to \"far\". Skipping it.");
                return null;
            }
            return new CGFcameraOrtho(left, right, bottom, top, near, far, vec3.fromValues(from[0], from[1], from[2]), vec3.fromValues(to[0], to[1], to[2]), vec3.fromValues(up[0], up[1], up[2]));
        }
        else {
            this.onXMLError("[VIEWS] Exited parse camera because camera node not ortho or perspective");
            return null;
        }
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;
        var defaultAmbient = [0.2, 0.2, 0.2, 1.0];
        var defaultBackground = [0.58, 0, 0.83, 1.0];
        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        //if ambient is not defined or wrongly defined we use a default
        if (!Array.isArray(color)) {
            this.onXMLError("[ILLUMINATION] No ambient illumination defined, adding a default one");
            this.ambient = defaultAmbient;
        }
        else {
            this.ambient = color;
        }

        color = this.parseColor(children[backgroundIndex], "background");

        //if background is not defined or wrongly defined we use a default
        if (!Array.isArray(color)) {
            this.onXMLError("[ILLUMINATION] No background illumination defined, adding a default one");
            this.background = defaultBackground;
        }
        else
            this.background = color;

        this.log("Parsed Illumination.");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        var children = lightsNode.children;
        this.lights = [];
        var numLights = 0;
        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("[LIGHTS] Unknown tag <" + children[i].nodeName + ">, skipping it");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean", "position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null) {
                this.onXMLMinorError("[LIGHTS] No ID defined for light, skipping it");
                continue;
            }
            // Checks for repeated IDs.
            if (this.lights[lightId] != null) {
                this.onXMLMinorError("[LIGHTS] ID must be unique for each light (conflict: ID = " + lightId + "), skipping it");
                continue;
            }
            grandChildren = children[i].children;

            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string') {
                        this.onXMLMinorError(aux);
                        continue;
                    }


                    global.push(aux);
                }
                else {
                    this.onXMLMinorError("[LIGHTS] Light " + attributeNames[i] + " undefined for ID = " + lightId + ", skipping it");
                    continue;
                }
            }
            this.lights[lightId] = global;
            numLights++;
        }
        if (numLights == 0) {

            this.onXMLError("[LIGHTS] At least one light must be defined");
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];
            attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
            attributeTypes.push(...["boolean", "position", "color", "color", "color"]);
            var lightId = "UndefinedDefault";
            for (var j = 0; j < attributeNames.length; j++) {
                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = true;
                    else if (attributeTypes[j] == "position")
                        var aux = vec4.create(0, 0, 0, 1);
                    else
                        var aux = [0.6, 0.2, 0.6, 1];

                    if (typeof aux === 'string') {
                        this.onXMLMinorError(aux);
                        continue;
                    }


                    global.push(aux);
                }

            }
            this.lights["UndefinedDefault"] = global;
        }
        else if (numLights > 8)
            this.onXMLError("[LIGHTS] Too many lights defined; WebGL imposes a limit of 8 lights, we're only using the first 8");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        let texturesChildNodes = texturesNode.children;
        this.textures = [];
        let workingDirectory = "./scenes/";
        this.defaultTexture = null;
        this.textures["default"] = this.defaultTexture;

        //For each texture in textures block, check ID and file path
        if (texturesChildNodes.length == 0) {
            this.onXMLMinorError("[TEXTURE] No textures defined");
        }

        for (let i = 0; i < texturesChildNodes.length; i++) {
            if (texturesChildNodes[i].nodeName !== "texture") {
                this.onXMLMinorError("[TEXTURE] invalid node name, skipping it");
                continue;
            }

            let id = this.reader.getString(texturesChildNodes[i], 'id')

            if (id.length === 0) {
                this.onXMLMinorError("[TEXTURE] no texture ID defined, skipping it");
                continue;
            }
            if (this.textures[id] != null && id != "default") {
                this.onXMLMinorError("[TEXTURE] ID must be unique for each texture (conflict: ID = " + id + ") skipping it");
                continue;
            }

            let path = this.reader.getString(texturesChildNodes[i], 'path');

            if (!(path.includes("exture") || path.includes("mages"))) { //check if full path is defined, bewaring of capital leters in the beggining of folder name
                path = workingDirectory + "images/" + path;
            }

            if (path == null) { // if the path is null we ignore this texture
                this.onXMLMinorError("[TEXTURE] invalid path");
                continue;
            }

            this.textures[id] = new CGFtexture(this.scene, path);
        }
        this.log("Parsed Textures");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;
        var color = [];

        this.materials = [];

        this.defaultMaterial = new CGFappearance(this.scene);
        this.defaultMaterial.setShininess(1.0);
        this.defaultMaterial.setSpecular(1, 1, 1, 0.5);
        this.defaultMaterial.setDiffuse(1, 1, 1, 0.5);
        this.defaultMaterial.setAmbient(1, 1, 1, 0.5);
        this.defaultMaterial.setEmission(0.5, 0.5, 0.5, 1.0);
        this.materials["default"] = this.defaultMaterial;

        var grandChildren = []; //this will be the color parameter -> shininess, speccular etc.
        var nodeNames = [];

        // Any number of materials.

        if (children.length == 0) {
            return this.onXMLMinorError("[MATERIALS] No materials defined, it was defined a default");
        }

        let nMaterials = 0;
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "material") {
                this.onXMLMinorError("[MATERIALS] unknown tag <" + children[i].nodeName + ">, skipping it");
                continue;
            }

            // Get the id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null) {
                this.onXMLMinorError("[MATERIALS] No ID defined for material, skipping it");
                continue;
            }
            if (materialID.toLowerCase() == "null") {
                this.onXMLMinorError("[MATERIALS] Material id cannot be named null, skipping it");
                continue;
            }

            // Checks for repeated IDs.
            if (this.materials[materialID] != null && materialID != "default") {
                this.onXMLMinorError("[MATERIALS] ID must be unique for each material (conflict: ID = " + materialID + ")");
                continue;
            }

            grandChildren = children[i].children;
            let grandchildnames = [];


            for (let k = 0; k < grandChildren.length; k++)
                grandchildnames.push(grandChildren[k].nodeName)

            // Gets indexes of emission, ambient, diffuse, specular
            var emissionIdx = grandchildnames.indexOf("emissive");
            var ambientIdx = grandchildnames.indexOf("ambient");
            var diffuseIdx = grandchildnames.indexOf("diffuse");
            var specularIdx = grandchildnames.indexOf("specular");

            if (emissionIdx == -1) {
                this.onXMLMinorError("[MATERIALS] Missing emissive tag of the material " + materialID + ", skipping it");
                continue;
            }
            if (ambientIdx == -1) {
                this.onXMLMinorError("[MATERIALS] Missing ambient tag of the material " + materialID + ", skipping it");
                continue;
            }
            if (diffuseIdx == -1) {
                this.onXMLMinorError("[MATERIALS] Missing diffuse tag of the material " + materialID + ", skipping it");
                continue;
            }
            if (specularIdx == -1) {
                this.onXMLMinorError("[MATERIALS] Missing specular tag of the material " + materialID + ", skipping it");
                continue;
            }

            let shininess = null;
            let specular = [];
            let diffuse = [];
            let ambient = [];
            let emissive = [];

            for (let j = 0; j < grandChildren.length; j++) {

                if (grandChildren[j].nodeName == "shininess") {
                    shininess = this.reader.getFloat(grandChildren[j], "value");
                    if (shininess == null || isNaN(shininess)) {
                        this.onXMLMinorError("[MATERIALS] Unable to parse shininess of material " + materialID + ", skipping it");
                        continue;
                    }
                }
                else if (grandChildren[j].nodeName == "specular") {
                    specular = this.parseColor(grandChildren[j], "Specular component in id" + materialID);
                }
                else if (grandChildren[j].nodeName == "diffuse") {
                    diffuse = this.parseColor(grandChildren[j], "diffuse component in id" + materialID);
                }
                else if (grandChildren[j].nodeName == "ambient") {
                    ambient = this.parseColor(grandChildren[j], "ambient component in id" + materialID);
                }
                else if (grandChildren[j].nodeName == "emissive") {
                    emissive = this.parseColor(grandChildren[j], "emissive component in id" + materialID);
                }
                if (!Array.isArray(specular) || !Array.isArray(diffuse) || !Array.isArray(ambient) || !Array.isArray(emissive)) {
                    this.onXMLMinorError("[MATERIALS] Unable to parse components of material " + materialID + ", skipping it");
                    continue;
                }

                var material = new CGFappearance(this.scene);
                material.setShininess(shininess);
                material.setSpecular(specular[0], specular[1], specular[2], specular[3]);
                material.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
                material.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
                material.setEmission(emissive[0], emissive[1], emissive[2], emissive[3]);
                this.materials[materialID] = material;

                nMaterials++;
            }
        }
        if (nMaterials == 0) {
            this.onXMLError("[MATERIALS] No materials defined, a default one was defined");
        }

        this.log("Parsed materials");
        return null;
    }
    /**
   * Parses the <animations> block.
   * @param {animation block element} animationNodes
   */
    parseAnimations(animationNodes) {
        this.animations = [];
        var grandChildren = [];
        var children = animationNodes.children;

        for (let j = 0; j < children.length; j++) {
            if (children[j].nodeName != "animation") {
                this.onXMLMinorError("[ANIMATIONS] Unknown tag <" + children[j].nodeName + ">");
                continue;
            }
            var animationID = this.reader.getString(children[j], 'id');
            if (animationID == null) {
                this.onXMLMinorError("[ANIMATIONS] No ID defined for animation, skipping it");
                continue;

            }
            if (this.animations[animationID] != null) {
                this.onXMLMinorError("[ANIMATIONS] ID must be unique for each animation (conflict: ID = " + animationID + ")");
                continue;
            }
            var animation = new KeyFrameAnimation(this.scene, animationID);

            //Parsing keyframes
            grandChildren = children[j].children;
            let instants = [];
            let last_instant = 0;
            for (let i = 0; i < grandChildren.length; i++) {
                if (grandChildren[i].nodeName != "keyframe") {
                    this.onXMLMinorError("[ANIMATIONS] Unknown tag <" + grandChildren[i].nodeName + ">");
                    continue;
                }

                var keyframe = new KeyFrame();
                keyframe.instant = this.reader.getFloat(grandChildren[i], 'instant');

                if (keyframe.instant == null || isNaN(keyframe.instant) || keyframe.instant < 0) {
                    this.onXMLMinorError("[ANIMATIONS] Invalid/Missing value for keyframe instant of the animation " + animationID);
                    continue;
                }
                if (instants[keyframe.instant] != null) {//check repeated instants
                    this.onXMLError("[ANIMATIONS] Repeated keyframe instant on animation " + animationID);
                    continue;
                }
                if (keyframe.instant < last_instant) {
                    this.onXMLMinorError("[ANIMATIONS] Unordered keyframe instant on animation " + animationID + " in instant " + keyframe.instant + " coming only after instant " + last_instant + " but using it anyway");
                }

                last_instant = keyframe.instant;
                instants[keyframe.instant] = keyframe.instant;


                var grandgrandChildren = grandChildren[i].children;
                var xangle = null, yangle = null, zangle = null;

                for (var k = 0; k < grandgrandChildren.length; k++) {//we warn it's not in the expected order but we don't ignore it
                    if (grandgrandChildren.length > 5) {
                        this.onXMLError("[ANIMATIONS] Too many transformations declared in animation " + animationID + " skipping it");
                        break;
                    }
                    else if (grandgrandChildren[k].nodeName == "translation") {
                        if (k != 0) {
                            this.onXMLMinorError("[ANIMATIONS] Transformations out of order in animation " + animationID);
                        }

                        let coordinates = this.parseCoordinates3D(grandgrandChildren[k], "translate transformation for ID " + animationID + ", skipping it");
                        if (!Array.isArray(coordinates)) {
                            this.onXMLMinorError(coordinates);
                            break;
                        }
                        keyframe.translation = coordinates;

                    }
                    else if (grandgrandChildren[k].nodeName == "rotation") {
                        if (k != 1 && k != 2 && k != 3) {
                            this.onXMLMinorError("[ANIMATIONS] Transformations out of order in animation " + animationID);
                        }

                        let axis = this.reader.getString(grandgrandChildren[k], "axis");
                        let angle = this.reader.getFloat(grandgrandChildren[k], "angle");

                        if (axis == null || angle == null || isNaN(angle)) {
                            this.onXMLError("[ANIMATIONS] Wrong axis or angle on rotation of animation : " + animationID + ", skipping it");
                            continue;
                        }
                        else if (axis == "x") {
                            if (xangle != null) {//ignore it and stay with first one
                                this.onXMLError("[ANIMATIONS] Redefinition of x rotation of animation : " + animationID + ", skipping it");
                                continue;
                            }
                            else {
                                xangle = angle * DEGREE_TO_RAD;
                            }
                        }
                        else if (axis == "y") {
                            if (yangle != null) {
                                this.onXMLError("[ANIMATIONS] Redefinition of y rotation of animation : " + animationID + ", skipping it");
                                continue;
                            }
                            else {
                                yangle = angle * DEGREE_TO_RAD;
                            }
                        }
                        else if (axis == "z") {
                            if (zangle != null) {
                                this.onXMLError("[ANIMATIONS] Redefinition of z rotation of animation : " + animationID + ", skipping it");
                                continue;
                            }
                            else {
                                zangle = angle * DEGREE_TO_RAD;
                            }

                        }

                    }
                    else if (grandgrandChildren[k].nodeName == "scale") {
                        if (k != 4) {
                            this.onXMLMinorError("[ANIMATIONS] Transformations out of order in animation " + animationID);
                        }
                        let sx = this.reader.getFloat(grandgrandChildren[k], "sx");
                        let sy = this.reader.getFloat(grandgrandChildren[k], "sy");
                        let sz = this.reader.getFloat(grandgrandChildren[k], "sz");

                        if (sx == null || sy == null || sz == null || isNaN(sx) || isNaN(sy) || isNaN(sz)) {
                            this.onXMLError("[ANIMATIONS] missing/not number values for scale node: " + animationID + ", skipping it");
                            continue;
                        }
                        keyframe.scale = new vec3.fromValues(sx, sy, sz);

                    }
                    else {
                        this.onXMLMinorError("[ANIMATIONS] Unknown tag <" + grandgrandChildren[k].nodeName + ">");
                        break;
                    }
                }

                keyframe.rotation = new vec3.fromValues(xangle, yangle, zangle);
                //the new keyframe is added to the array
                animation.addKeyFrame(keyframe);
            }
            //the keyframeAnimation of animationId is added to the animations array
            this.animations[animationID] = animation;
        }
        this.log("Parsed Animations");
        return null;

    }
    /**
   * Parses the <animations> block.
   * @param {spritesheet block element} spritesheetNodes
   */
    parseSpritesheets(spritesheetNodes) {
        this.spritesheets = [];
        var children = spritesheetNodes.children;
        let workingDirectory = "./scenes/";

        if (spritesheetNodes.length == 0) {
            this.onXMLMinorError("[SPRITESHEETS] No spritesheets defined");
        }
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName !== "spritesheet") {
                this.onXMLMinorError("[SPRITESHEETS] Invalid node name, skipping it. Unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            let id = this.reader.getString(children[i], 'id');
            if (id.length === 0) {
                this.onXMLMinorError("[SPRITESHEETS] no spritesheet ID defined, skipping it");
                continue;
            }
            if (this.spritesheets[id] != null) {
                this.onXMLMinorError("[SPRITESHEETS] ID must be unique for each spritesheet (conflict: ID = " + id + ") skipping it");
                continue;
            }

            let path = this.reader.getString(children[i], 'path');

            if (!(path.includes("exture") || path.includes("mages"))) { //check if full path is defined, bewaring of capital leters in the beggining of folder name
                path = workingDirectory + "images/" + path;
            }

            if (path == null) { // if the path is null we ignore this spritesheet
                this.onXMLMinorError("[SPRITSHEETS] invalid path in spritesheet: " + id + " skipping it");
                continue;
            }

            let texture = new CGFtexture(this.scene, path);

            let sizeM = this.reader.getFloat(children[i], 'sizeM');
            if (sizeM == null || isNaN(sizeM)) {
                this.onXMLError("[SPRITESHEETS] Missing/not valid values for sizeM on spritesheet: " + id + ", skipping it");
                continue;
            }
            let sizeN = this.reader.getFloat(children[i], 'sizeN');
            if (sizeN == null || isNaN(sizeN)) {
                this.onXMLError("[SPRITESHEETS] Missing/not valid values for sizeN on spritesheet: " + id + ", skipping it");
                continue;
            }
            if (sizeM % 1 != 0 || sizeN % 1 != 0){
                this.onXMLError("[NODE] Wrong values for spritesheet size definition in spritesheet: " + id + ",values must be integers, skipping it");
                continue;
            }

            this.spritesheets[id] = new MySpritesheet(this.scene, id, texture, sizeM, sizeN);
        }

        this.log("Parsed Spritesheets");
        return null;
    }

    parseTransformations(transformations, nodeID) {

        let matrix = mat4.create();

        for (let j = 0; j < transformations.length; j++) {
            if (transformations[j].nodeName == "translation") {
                let coordinates = this.parseCoordinates3D(transformations[j], "translate transformation for ID " + nodeID + ", skipping it");
                if (!Array.isArray(coordinates)) {
                    this.onXMLMinorError(coordinates);
                    continue;
                }
                mat4.translate(matrix, matrix, coordinates);

            }
            else if (transformations[j].nodeName == "rotation") {
                let axis = this.reader.getString(transformations[j], "axis");
                let angle = this.reader.getFloat(transformations[j], "angle");

                if (axis == null || (axis != "x" && axis != "y" && axis != "z") || angle == null || isNaN(angle)) {
                    this.onXMLError("[NODE] wrong axis or angle on rotation node: " + nodeID + ", skipping it");
                    continue;
                }

                angle = angle * DEGREE_TO_RAD;
                mat4.rotate(matrix, matrix, angle, this.axisCoords[axis]);

            }
            else if (transformations[j].nodeName == "scale") {
                let sx = this.reader.getFloat(transformations[j], "sx");
                let sy = this.reader.getFloat(transformations[j], "sy");
                let sz = this.reader.getFloat(transformations[j], "sz");

                if (sx == null || sy == null || sz == null || isNaN(sx) || isNaN(sy) || isNaN(sz)) {
                    this.onXMLError("[NODE] missing/not number values for scale node: " + nodeID + ", skipping it");
                    continue;
                }

                mat4.scale(matrix, matrix, new vec3.fromValues(sx, sy, sz));
            }
            else {
                this.onXMLError("[NODE] unknown tag: " + transformations[j].nodeName);
            }
        }
        return matrix;
    }

    /**
   * Parses the <nodes> block.
   * @param {nodes block element} nodesNode
   */
    parseNodes(nodesNode) {
        var children = nodesNode.children;

        this.nodes = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "node") {
                this.onXMLMinorError("[NODE] Unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');
            if (nodeID == null)
                return "[NODE] No ID defined for nodeID";

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "[NODE] ID must be unique for each node (conflict: ID = " + nodeID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationsIndex = nodeNames.indexOf("transformations");
            var animationIndex = nodeNames.indexOf("animationref");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var descendantsIndex = nodeNames.indexOf("descendants");

            if (!(materialIndex < textureIndex < transformationsIndex < descendantsIndex) && ((animationIndex == -1) || (animationIndex = textureIndex + 1))) {
                this.onXMLMinorError("[NODES] Tags out of order in node: " + nodeID);
            }


            // Transformations
            let matrix = mat4.create();
            let transformations;
            if (transformationsIndex == -1) {
                this.onXMLMinorError("[NODE] Transformations not defined for node id: " + nodeID);
            }
            else {
                transformations = grandChildren[transformationsIndex].children;

                matrix = this.parseTransformations(transformations, nodeID);
            }


            // Material
            let materialID = this.reader.getString(grandChildren[materialIndex], "id");
            if (materialIndex == -1) {
                this.onXMLError("[NODES] Material not defined for node id: " + nodeID + "it's mandatory! Skipping it!");
                continue;
            }
            if (materialID == null) {
                this.onXMLMinorError("[NODES] Material ID is not valid. node ID: " + nodeID + ", setting default material");
                materialID = 'default';
            }
            if (materialID !== 'null') {//case material parameter does not exist 
                if (this.materials[materialID] == null) { //not on materials defined
                    this.onXMLMinorError("[NODE] Material with ID: " + materialID + " does not exist. Error on node: " + nodeID + " Assuming null");
                    materialID = 'null';
                }
            }

            // Texture
            let textureId;
            let afs = 1;
            let aft = 1; //if amplification is not defined, the next cycle wont run and this will be the default values

            if (textureIndex == -1) {
                this.onXMLError("[NODES] Material not defined for node id: " + nodeID + "it's mandatory! Skipping it!");
                continue;
            }
            else {
                textureId = this.reader.getString(grandChildren[textureIndex], "id");

                if (textureId == null) {//case material parameter does not exist
                    this.onXMLMinorError("[NODE] texture ID is not valid on node ID: " + nodeID + " setting default texture");
                    textureId = 'default';
                }

                if (textureId.toLowerCase() !== "null" && textureId.toLowerCase() !== "clear") {
                    if (this.textures[textureId] == null) {
                        this.onXMLMinorError("[NODE] Texture ID: " + textureId + " does not exist. Error on node: " + nodeID + " setting default texture");
                        textureId = 'default';
                    }
                }

                let amplificationNodes = grandChildren[textureIndex].children;

                if (amplificationNodes.length == 0) {
                    this.onXMLMinorError("[NODE] Missing amplification tags in nodeId " + nodeID + ". Assuming (1,1)");
                }
                else {

                    if (amplificationNodes[0].nodeName !== "amplification") {
                        this.onXMLMinorError("[NODE] Unknown section on textures children, where amplificaton should be. node Id: " + nodeID + ". Ignoring it and assuming (1,1)");
                    }
                    else {
                        afs = this.reader.getFloat(amplificationNodes[0], "afs");
                        aft = this.reader.getFloat(amplificationNodes[0], "aft");


                        if (aft == null || afs == null || isNaN(afs) || isNaN(aft) || afs == 0 || aft == 0) {
                            this.onXMLMinorError("[NODE] Wrong amplification values in node: " + nodeID + " Assuming (1,1)" + afs + " " + aft);
                            afs = 1;
                            aft = 1;
                        }
                    }

                }
            }

            //Animation (optional)
            let animationID = null;

            if (animationIndex != -1) {
                animationID = this.reader.getString(grandChildren[animationIndex], "id");

                if (animationID == null) {
                    this.onXMLMinorError("[NODES] Animation ID is not valid. node ID: " + nodeID + ", assuming null");
                }
                if (this.animations[animationID] == null) {
                    this.onXMLMinorError("[NODE] Animation with ID: " + animationID + " does not exist. Error on node: " + nodeID + " Assuming null");
                    animationID = null;
                }
            }


            // Descendants
            if (descendantsIndex == -1) {
                this.onXMLMinorError("[NODE] Descendants not defined for node id: " + nodeID + ", skipping it");
                continue;
            }

            let descendants = [];
            let primitives = [];
            let descendant = null;


            for (let j = 0; j < grandChildren[descendantsIndex].children.length; j++) {
                descendant = grandChildren[descendantsIndex].children[j];
                if (descendant.nodeName == "noderef") {
                    descendants.push(this.reader.getString(descendant, "id"));
                }
                else if (descendant.nodeName == "leaf") {
                    let type = (this.reader.getString(descendant, "type"));
                    switch (type) {
                        case "rectangle":
                            var x1 = this.reader.getFloat(descendant, "x1");
                            var y1 = this.reader.getFloat(descendant, "y1");
                            var x2 = this.reader.getFloat(descendant, "x2");
                            var y2 = this.reader.getFloat(descendant, "y2");
                            if (x1 == null || x2 == null || y1 == null || y2 == null) {
                                this.onXMLError("[NODE] Missing values for rectangle definition in nodeID: " + nodeID + ", skipping it");
                                continue;
                            }
                            else if (x1 == x2 || y1 == y2 || isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2)) {
                                this.onXMLError("[NODE] Invalid values for rectangle definition in nodeID: " + nodeID + ", skipping it");
                                continue;
                            }

                            let rectangle = new MyRectangle(this.scene, x1, y1, x2, y2);
                            rectangle.updateTexCoords([afs, aft]);
                            primitives.push(rectangle);
                            break;

                        case "cylinder":
                            var height = this.reader.getFloat(descendant, "height");
                            var topRadius = this.reader.getFloat(descendant, "topRadius");
                            var bottomRadius = this.reader.getFloat(descendant, "bottomRadius");
                            var stacks = this.reader.getFloat(descendant, "stacks");
                            var slices = this.reader.getFloat(descendant, "slices");
                            if (height == null || topRadius == null || bottomRadius == null || stacks == null || slices == null) {
                                this.onXMLError("[NODE] Missing parameters for triangle definition in nodeID: " + nodeID + ", skipping it");
                                continue;
                            }
                            else if (isNaN(height) || isNaN(topRadius) || isNaN(bottomRadius) || isNaN(stacks) || isNaN(slices)) {
                                this.onXMLError("[NODE] Invalid parameters for cylinder definition in nodeID: " + nodeID + ", skipping it");
                                continue;
                            }
                            if ((topRadius < 0 || bottomRadius < 0 || height <= 0 || slices <= 0) && stacks >= 0) {
                                this.onXMLError("[NODE] Wrongly defined cylinder in nodeID:" + nodeID + " Assuming 1 for all parameters");
                                height = topRadius = bottomRadius = stacks = slices = 1;
                            }
                            primitives.push(new MyCylinder(this.scene, height, topRadius, bottomRadius, stacks, slices));
                            break;

                        case "sphere":
                            var radius = this.reader.getFloat(descendant, "radius");
                            var slices = this.reader.getFloat(descendant, "slices");
                            var stacks = this.reader.getFloat(descendant, "stacks");
                            if (radius == null || slices == null || stacks == null) {
                                this.onXMLError("[NODE] Missing parameters for sphere definition in nodeID: " + nodeID + ", skipping it");
                                continue;
                            }
                            else if (isNaN(radius) || isNaN(slices) || isNaN(stacks)) {
                                this.onXMLError("[NODE] Invalid parameters for sphere definition in nodeID: " + nodeID + ", skipping it");
                                continue;
                            }
                            else if (radius * stacks * slices <= 0) {//can't have negative or zero values
                                this.onXMLError("[NODE] Wrongly defined sphere in nodeID:" + nodeID + " Assuming 1 for all parameters");
                                radius = stacks = slices = 1;
                            }
                            primitives.push(new MySphere(this.scene, radius, slices, stacks));
                            break;

                        case "torus":
                            var inner = this.reader.getFloat(descendant, "inner");
                            var outer = this.reader.getFloat(descendant, "outer");
                            var loops = this.reader.getFloat(descendant, "loops");
                            var slices = this.reader.getFloat(descendant, "slices");
                            if (inner == null || outer == null || loops == null || slices == null) {
                                this.onXMLError("[NODE] Missing parameters for torus definition in nodeID: " + nodeID + ", skipping it");
                                continue;
                            }
                            else if (isNaN(inner) || isNaN(outer) || isNaN(loops) || isNaN(slices)) {
                                this.onXMLError("[NODE] Invalid parameters for torus definition in nodeID: " + nodeID + ", skipping it");
                                continue;
                            }
                            else if (inner * outer * loops * slices <= 0) {//can't have negative or zero values
                                this.onXMLError("[NODE] Wrongly defined torus in nodeID:" + nodeID + " Assuming 1 for all parameters");
                                inner = outer = loops = slices = 1;
                            }
                            primitives.push(new MyTorus(this.scene, inner, outer, slices, loops));
                            break;

                        case "triangle":
                            var x1 = this.reader.getFloat(descendant, "x1");
                            var y1 = this.reader.getFloat(descendant, "y1");
                            var x2 = this.reader.getFloat(descendant, "x2");
                            var y2 = this.reader.getFloat(descendant, "y2");
                            var x3 = this.reader.getFloat(descendant, "x3");
                            var y3 = this.reader.getFloat(descendant, "y3");

                            if (isNaN(x1) || isNaN(x2) || isNaN(x3) || isNaN(y1) || isNaN(y2) || isNaN(y3)) {
                                this.onXMLError("[NODE] Invalid parameters for triangle definition in nodeID: " + nodeID + ", skipping it");
                                continue;
                            }
                            else if ((x1 == x2 && y1 == y2) || (x1 == x3 && y1 == y3) || (x2 == x3 && y2 == y3)) {
                                this.onXMLError("[NODE] Wrong parameters for triangle definition in nodeID: " + nodeID + ", skipping it");
                                continue;
                            }
                            else if (x1 == null || x2 == null || x3 == null || y1 == null || y2 == null || y3 == null) {
                                this.onXMLError("[NODE] Missing values for triangle definition in nodeID: " + nodeID + ", skipping it");
                                continue;
                            }

                            let triangle = new MyTriangle(this.scene, x1, y1, x2, y2, x3, y3);
                            triangle.updateTexCoords([afs, aft]);
                            primitives.push(triangle);
                            break;

                        case "spritetext":
                            var text = this.reader.getString(descendant, "text");
                            if (text == null) {
                                this.onXMLError("[NODE] Missing values for spritetext definition in nodeID: " + nodeID + ", skipping it");
                                continue;
                            }
                            let spriteText = new MySpriteText(this.scene, text);
                            primitives.push(spriteText);
                            break;

                        case "spriteanim":
                            let id = this.reader.getString(descendant, "ssid");
                            let startCell = this.reader.getFloat(descendant, "startCell");
                            let endCell = this.reader.getFloat(descendant, "endCell");
                            let duration = this.reader.getFloat(descendant, "duration");

                            if (startCell == null || isNaN(startCell)) {
                                startCell = 0;
                            }

                            if (id == null || startCell == null || isNaN(startCell) || startCell < 0 || endCell == null || isNaN(endCell) ||
                                endCell < startCell || duration < 0 || duration == null || isNaN(duration)) {
                                this.onXMLError("[NODE] Missing/Invalid values for spriteanim definition in nodeID: " + nodeID + ", skipping it");
                                continue;
                            }

                            if (startCell % 1 != 0 || endCell % 1 != 0){
                                this.onXMLError("[NODE] Wrong values for spriteanim definition in nodeID: " + nodeID + ",values must be integers, skipping it");
                                continue;
                            }

                            if (this.spritesheets[id] == null) {
                                this.onXMLError("[NODE] Wrong value for spriteanim ID in nodeID: " + nodeID + ", skipping it");
                                continue;
                            }

                            let spriteanim = new MySpriteAnimation(this.scene, this.spritesheets[id], startCell, endCell, duration);
                            primitives.push(spriteanim);
                            this.spriteanimations.push(spriteanim);
                            break;

                        case "plane":
                            let nPartsU = this.reader.getFloat(descendant, "npartsU");
                            let nPartsV = this.reader.getFloat(descendant, "npartsV");

                            if (nPartsU == null || nPartsV == null || isNaN(nPartsU) || isNaN(nPartsV) || nPartsU <= 0 || nPartsV <= 0) {
                                this.onXMLError("[NODE] Wrong values for plane definition in nodeID: " + nodeID + ", skipping it");
                                continue;
                            }
                            if (nPartsU % 1 != 0 || nPartsV % 1 != 0){
                                this.onXMLError("[NODE] Wrong values for plane definition in nodeID: " + nodeID + ",values must be integuers, skipping it");
                                continue;
                            }

                            let plane = new MyPlane(this.scene, nPartsU, nPartsV);
                            primitives.push(plane);
                            break;
                        case "patch":

                            let nPointsU = this.reader.getFloat(descendant, "npointsU");
                            let nPointsV = this.reader.getFloat(descendant, "npointsV");
                            let nPrtsU = this.reader.getFloat(descendant, "npartsU");
                            let nPrtsV = this.reader.getFloat(descendant, "npartsV");
                            
                            if (nPrtsU == null || nPrtsV == null || isNaN(nPrtsU) || isNaN(nPrtsV) || nPrtsU <= 0 || nPrtsV <= 0 || nPointsU == null || nPointsV == null || isNaN(nPointsU) || isNaN(nPointsV) || nPointsU <= 0 || nPointsV <= 0) {
                                this.onXMLError("[NODE] Wrong values for patch definition in nodeID: " + nodeID + ", skipping it");
                                continue;
                            }
                            if (nPointsU % 1 != 0 || nPointsV % 1 != 0 || nPrtsU % 1 != 0 || nPrtsV % 1 != 0){
                                this.onXMLError("[NODE] Wrong values for patch definition in nodeID: " + nodeID + ",values must be integuers, skipping it");
                                continue;
                            }

                            let controlPoints = [], controlPointsU = [], controlPointstemp = [];
                            let x, y, z;
                            let controlPointsNodes = descendant.children;

                            if (controlPointsNodes.length != (nPointsU * nPointsV)) {
                                this.onXMLError("[PATCH] wrong number of control points declared in nodeID:" + nodeID + ". Should be " + nPointsU * nPointsV + " are actually " + controlPointsNodes.length + ". Assuming 0 if any missing.");
                            }

                            for (let i = 0; i < (nPointsU * nPointsV); i++) {
                                if (i < controlPointsNodes.length) { //this means there are enough control points declared
                                    x = this.reader.getFloat(controlPointsNodes[i], "x");
                                    y = this.reader.getFloat(controlPointsNodes[i], "y");
                                    z = this.reader.getFloat(controlPointsNodes[i], "z");
                                    if (x == null || y == null || z == null || isNaN(x) || isNaN(y) || isNaN(z)) {
                                        this.onXMLError("[NODE] Wrong values for control point definition in nodeID: " + nodeID + ", in control point index " + i + ", skipping it");
                                        continue;
                                    }
                                } 
                                else { //this means there are control points missing so we'll assume them as zero
                                    x = 0;
                                    y = 0;
                                    z = 0;
                                }
                                controlPointstemp.push(x, y, z,1);
                                controlPointsU.push(controlPointstemp);

                                if (controlPointsU.length == nPointsV){
                                    controlPoints.push(controlPointsU);
                                    controlPointsU = [];
                                }
                                controlPointstemp = []                                
                            }

                            let patch = new MyPatch(this.scene, nPointsU, nPointsV, nPrtsU, nPrtsV, controlPoints);
                            primitives.push(patch);
                            break;

                        case "defbarrel":
                            let base = this.reader.getFloat(descendant, "base");
                            let middle = this.reader.getFloat(descendant, "middle");
                            let h = this.reader.getFloat(descendant, "height");
                            let sl = this.reader.getFloat(descendant, "slices");
                            let st = this.reader.getFloat(descendant, "stacks");

                            if( base == null || middle == null || h == null || sl == null || st == null){
                                this.onXMLError("[NODE] Missing values for barrel definition in nodeID: " + nodeID + ", skipping it");
                                continue;
                            }


                            if(isNaN(base) || isNaN(middle) || isNaN(h) || isNaN(sl) || isNaN(st)){
                                this.onXMLError("[NODE] Wrong values for barrel definition in nodeID: " + nodeID + ", skipping it");
                                continue;

                            }

                            if(base <= 0 || middle <= 0 || h <= 0 || sl <= 0 || st <= 0 ){
                                this.onXMLError("[NODE] Wrong values for barrel definition in nodeID: " + nodeID + ", skipping it");
                                continue;

                            }

                            if (sl % 1 != 0 || st % 1 != 0){
                                this.onXMLError("[NODE] Wrong values for barrel definition in nodeID: " + nodeID + ",stacks and slices values must be integuers, skipping it");
                                continue;
                            }

                            let defbarrel = new MyDefBarrel(this.scene, base, middle, h, sl, st);
                            primitives.push(defbarrel);
                            break;

                        default:
                            this.onXMLMinorError("[NODE] Unknown leaf type in node id: " + nodeID);
                    }

                }
                else {
                    this.onXMLMinorError("[NODE] Unknown descendent type in node id: " + nodeID + ", skipping it");
                    continue;
                }

            }
            if (descendants.length === 0 && primitives.length === 0) {
                this.onXMLError("[NODE] No descendants! Node id: " + nodeID);
                continue;
            }


            let node = new Node(nodeID);
            node.setChildren(descendants);
            node.setLeafs(primitives);
            node.setTexture(textureId);
            node.setMaterial(materialID);
            node.setTransformation(matrix);
            node.setAnimation(animationID);
            this.nodes[nodeID] = node;

        }
        this.log("Parsed nodes");

        return null;
    }
    /**
     * Parse a boolean from a node with ID = id
     * @param {block element} node
     * @param name - name of the tag
     * @param {message to be displayed in case of error} messageError
     */

    parseBoolean(node, name, messageError) {
        var boolVal = true;
        boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false))) {
            this.onXMLMinorError("[Boolean] Unable to parse value component " + messageError + "; assuming 'value = 1'");
            return true;
        }
        return boolVal;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "[COORDINATES] Unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "[COORDINATES] Unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "[COORDINATES] Unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "[COORDINATES] Unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return this.onXMLError("[COLOR] Unable to parse R component of the " + messageError);

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return this.onXMLError("[COLOR] Unable to parse G component of the " + messageError);

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return this.onXMLError("[COLOR] Unable to parse B component of the " + messageError);

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return this.onXMLError("[COLOR] Unable to parse A component of the " + messageError);

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */

    displayScene() {
        //To do: Create display loop for transversing the scene graph, calling the root node's display function
        var matId = this.nodes[this.idRoot].getMaterial();
        var texId = this.nodes[this.idRoot].getTexture();
        this.processNode(this.idRoot, texId, matId);
    }

    /**
     * Processes each node and its descendants, applying its textures, materials and transformations
     * @param id - id of the node
     * @param {CGFtexture} text
     * @param {CGFappearance} mat  
     */
    processNode(id, texId, matId) {
        let display = true;
        let node = this.nodes[id];

        if (node == null) { //node does not exist
            return 1;
        }

        this.scene.pushMatrix();

        let materialID = node.getMaterial();
        let textureID = node.getTexture();


        if (materialID == "null") { // get parent's material 
            if (matId != "null") {
                materialID = matId;
            }
            else {
                materialID = "default";
                if (id !== this.idRoot) { //no need for warning if its the root without material
                    console.warn("[PROCESS NODE] Using default material, consider checking material definitions in nodeId " + id);
                }
            }
        }

        if (this.materials[materialID] == -1) {//material does not exist
            console.warn("[PROCESS NODE] Material non existent in nodeId " + id) + " using default";
            materialID = "default";
        }


        let material = this.materials[materialID];
        if (textureID == "null") { // get parent's texture
            if (texId != "null") {
                textureID = texId;
            }
            else { // using default
                textureID = "default";
                console.warn("[PROCESS NODE] Using default texture, consider changing texture definitions or settings to \"clear\" in nodeId " + id);
            }
        }

        if (textureID == "clear") { //removing texture
            material.setTexture(null);
        }

        let texture = this.textures[textureID];
        material.setTexture(texture);


        material.setTextureWrap('REPEAT', 'REPEAT');
        material.apply();

        this.scene.multMatrix(node.getTransformation()); //apply transformation

        if (node.animation != null) { //it has animation defined
            this.animations[node.animation].apply();
            display = this.animations[node.animation].active;
        }

        if (display) {
            for (var i = 0; i < node.getLeafs().length; i++) { // if primitive, display 
                if (node.getLeafs()[i] instanceof MySpriteText) {
                    this.scene.pushMatrix(); //because we do a translation inside the display function of the spritetext
                    node.getLeafs()[i].display();
                    this.scene.popMatrix();
                }
                else {
                    node.getLeafs()[i].display();
                }
            }

            for (var i = 0; i < node.getChildren().length; i++) {// if node, recursive call
                this.scene.pushMatrix();
                let a = this.processNode(node.getChildren()[i], textureID, materialID);
                if (a == 1) { //the node does not exist
                    this.onXMLError("[PROCESS NODE] NodeID " + id + " has non existent child with id: " + node.getChildren()[i]);
                    node.children.splice(i, i + 1); //removes this node from the children so it's not printing the same message over and over again
                }
                this.scene.popMatrix();
            }
        }
        this.scene.popMatrix();
    }
}
