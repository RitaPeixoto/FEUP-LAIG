#ifdef GL_ES
precision highp float;
#endif

//input variables
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float scaleM;
uniform float scaleN;
uniform float offsetM;
uniform float offsetN;

//

varying vec2 vTextureCoord;


void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition , 1.0) ;  //output vertex position

    vTextureCoord = ( aTextureCoord * vec2(scaleM,scaleN) ) + vec2(offsetM, offsetN);
    //the vector we're multiplying acts like a focus in the image, if > 1, then since it is on repeat it will make multiple squares with the shader
    //if < 1 it will focus on a part of the shader
    //the vector add will give the need offset to select the specific part of the sprite we want
}