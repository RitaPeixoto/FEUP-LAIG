/*
- Base at origin
- central axis coinciding with Zz axis
- height: size in the zz axis direction
- base: radius of the base (Z = 0)
- top: radius of the top (Z = height)
- slices: n of divisions around the circumference
- stacks: n of divisions along the Z axis
- must have top and bottom
*/
/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param height - height of the cylinder
 * @param topRadius - radius of the top base
 * @param bottomRadius - radius of the bottom base
 * @param stacks - sections along height
 * @param slices - parts per section
 */

class MyCylinder extends CGFobject {
	constructor(scene, height, topRadius, bottomRadius, stacks, slices) {
		super(scene);
		this.height = height;
		this.cylinderBody = new MyCylinderBody(scene, height, topRadius, bottomRadius, stacks, slices);
		this.topCircle = new MyCircle(scene, topRadius, slices);
		this.bottomCircle = new MyCircle(scene, bottomRadius, slices);


	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.cylinderBody.updateTexCoords(coords);
		this.topCircle.updateTexCoords(coords);
		this.bottomCircle.updateTexCoords(coords);
	}


	display() {
		this.scene.pushMatrix();
		this.cylinderBody.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.rotate(Math.PI, 1, 0, 0)
		this.bottomCircle.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0, 0, this.height);
		this.topCircle.display();
		this.scene.popMatrix();

	}

}

/**
 * MyCylinderBody
 * @constructor
 * @param scene - Reference to MyScene object
 * @param height - height of the cylinder
 * @param topRadius - radius of the top base
 * @param bottomRadius - radius of the bottom base
 * @param stacks - sections along height
 * @param slices - parts per section
 */

class MyCylinderBody extends CGFobject {
	constructor(scene, height, topRadius, bottomRadius, stacks, slices) {
		super(scene);
		this.height = height;
		this.topRadius = topRadius;
		this.bottomRadius = bottomRadius;
		this.stacks = stacks;
		this.slices = slices;

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		var ang = 2.0 * Math.PI / this.slices;



		for (var stack = 0; stack <= this.stacks; stack++) {
			var aux_ang = 0.0;
			var r = (this.topRadius - this.bottomRadius) * (stack / this.stacks) + this.bottomRadius;
			var z = this.height * stack / this.stacks;

			for (slice = 0; slice <= this.slices; slice++) {
				var x = Math.cos(aux_ang) * r;
				var y = Math.sin(aux_ang) * r;

				this.vertices.push(x, y, z);
				let size = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
				this.normals.push(x / size, y / size, 0);
				// this.normals.push(x, y, 0);
				aux_ang += ang;
			}

		}

		for (var stack = 0; stack < this.stacks; stack++) {
			for (var slice = 0; slice < this.slices; slice++) {
				var i1 = slice + stack * (this.slices + 1);
				var i2 = slice + stack * (this.slices + 1) + 1;
				var i3 = slice + (stack + 1) * (this.slices + 1);
				var i4 = slice + (stack + 1) * (this.slices + 1) + 1;
				this.indices.push(i4, i3, i1);
				this.indices.push(i1, i2, i4);
			}
		}

		for (var stack = 0; stack <= this.stacks; stack++) {
			for (var slice = 0; slice <= this.slices; slice++) {
				this.texCoords.push(1 - slice / this.slices, 1 - stack / this.stacks);
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		//this.enableNormalViz();
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

