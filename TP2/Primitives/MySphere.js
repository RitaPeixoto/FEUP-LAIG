 /**
  * MySphere
  * @method constructor
  * @param  {CGFscene} scene - MyScene object
  * @param  {integer} radius - radius of the sphere
  * @param  {integer} slices - number of "sides" around the Z axis
  * @param  {integer} stacks - number of divisions along the Z axis, from the center to the poles (half of sphere)
     */

class MySphere extends CGFobject {
  
    constructor(scene, radius, slices, stacks) {
      super(scene);
      this.radius = radius;
      this.latDivs = stacks * 2;
      this.longDivs = slices;
  
      this.initBuffers();
    }
  
    /**
     * @method initBuffers
     * Initializes the sphere buffers
     */
    initBuffers() {
      this.vertices = [];
      this.indices = [];
      this.normals = [];
      this.texCoords = [];
  
      var phi = 0;
      var theta = 0;
      var phiInc = Math.PI / this.latDivs;
      var thetaInc = (2 * Math.PI) / this.longDivs;
      var latVertices = this.longDivs + 1;
      
      var textureLong = 0;
      var textureLat = 0;
      var genericTextureLong = 1/this.longDivs;
      var genericTextureLat = 1/this.latDivs; 
  
  
  
      // build an all-around stack at a time, starting on "north pole" and proceeding "south"
      for (let latitude = 0; latitude <= this.latDivs; latitude++) {
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);
  
        // in each stack, build all the slices around, starting on longitude 0
        theta = 0;
        textureLong = 0;
        
        for (let longitude = 0; longitude <= this.longDivs; longitude++) {
          //--- Vertices coordinates
          var x = Math.cos(theta) * sinPhi * this.radius;
          var y = Math.sin(theta) * sinPhi * this.radius; 
          var z = cosPhi * this.radius;
          this.vertices.push(x, y, z);
  
          //--- Indices
          if (latitude < this.latDivs && longitude < this.longDivs) {
            var current = latitude * latVertices + longitude;
            var next = current + latVertices;
            // pushing two triangles using indices from this round (current, current+1)
            // and the ones directly south (next, next+1)
            // (i.e. one full round of slices ahead)
            
            this.indices.push( current + 1, current, next);
            this.indices.push( current + 1, next, next +1);
          }
  
          //--- Normals
          // at each vertex, the direction of the normal is equal to 
          // the vector from the center of the sphere to the vertex.
          // in a sphere of radius equal to one, the vector length is one.
          // therefore, the value of the normal is equal to the position vector
          let normalizationAux = Math.sqrt(x*x + y*y + z*z);
          
          this.normals.push(x/normalizationAux, y/normalizationAux, z/normalizationAux);

          
          this.texCoords.push(textureLong, textureLat);
  
  
          theta += thetaInc;
          textureLong += genericTextureLong;
          
        }
        phi += phiInc;
        textureLat += genericTextureLat; 
      }
  
  
      this.primitiveType = this.scene.gl.TRIANGLES;
      this.initGLBuffers();
    }

    /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
    updateTexCoords(coords) {
      this.texCoords = [...coords];
      this.updateTexCoordsGLBuffers();
    }
  
  }