
/** 
 * MySpriteText - class that stores 
 */

class MySpriteText {
    /**
    * @constructor
    * @param scene - Reference to MyScene object
    * @param {string} text - text that this spriteText represents
    */

    constructor(scene, text){
        this.scene = scene;
        this.text = text;

        /*Creates the geometry where the characters will be mapped */
        this.retangle = new MyRectangle(this.scene,-0.5, -0.5, 0.5, 0.5);  
        this.texture = new CGFtexture(this.scene, "./scenes/shaders/board.png");
        
        /* Variable that maps the character sprite to the font spritesheet grid */
        this.textToIndex ={
            ' ':32, '!':33,'"':34, '#':35, '$':36, '%':37, '&':38, '\'':39, '(':40, ')':41, '*':42, '+':43, ',':44, '-':45, '.':46, '/':47,
            '0':48, '1':49, '2':50, '3':51, '4':52, '5':53, '6':54, '7':55, '8':56, '9':57, ':':58, ';':59, '<':60, '=':61, '>':62, '?':63,
            '@':64, 'A':65, 'B':66, 'C':67, 'D':68, 'E':69, 'F':70, 'G':71, 'H':72, 'I':73, 'J':74, 'K':75, 'L':76, 'M':77, 'N':78, 'O':79, 
            'P':80, 'Q':81, 'R':82, 'S':83, 'T':84, 'U':85, 'V':86, 'W':87, 'X':88,'Y':89, 'Z':90, '[':91, '\\':92, ']':93, '^':94, '_':95, 
            '`':96, 'a':97, 'b':98, 'c':99, 'd':100, 'e':101, 'f':102, 'g':103, 'h':104, 'i':105, 'j':106, 'k':107, 'l':108, 'm':109, 'n':110, 'o':111,
            'p':112, 'q':113, 'r':114, 's':115, 't':116, 'u':117, 'v':118, 'w':119, 'x':120, 'y':121, 'z':122,'{':123, '|':124, '}':125, '~':126, 
            '€':128, 'º':186, 'ª':170, 
            'À':192, 'Á':193, 'Â':194, 'Ã':195, 'Ä':196, 'Ç':199, 'È':200, 'É':201, 'Ê':202, 'Ë':203, 'Ì':204, 'Í':205, 'Î':206, 'Ï':207,
            'Ò':210, 'Ó':211, 'Ô':212, 'Õ':213, 'Ö':214, 'Ù':217, 'Ú':218, 'Û':219, 'Ü':220,
            'à':224, 'á':225, 'â':226, 'ã':227, 'ä':228, 'ç':231, 'è':232, 'é':233, 'ê':234, 'ë':235, 'ì':236, 'í':237, 'î':238, 'ï':239,
            'ò':242, 'ó':243, 'ô':244, 'õ':245, 'ö':246, 'ù':249, 'ú':250, 'û':251, 'ü':252
        };


       /* another font
            this.textToIndex = {'0':0, '1':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '!':10, '?':11, '@':12, '#':13, '$':14, '%':15,
            '&':16, '\'':17, '"':18, '(':19, ')':20, '+':21, '-':22, '=':23, ',':24, '.':25, 'A':26, 'B':27, 'C':28, 'D':29, 'E':30, 'F':31, 'G':32,
            'H':33, 'I':34, 'J':35, 'K':36, 'L':37, 'M':38, 'N':39, 'O':40, 'P':41, 'Q':42, 'R':43, 'S':44, 'T':45, 'U':46, 'V':47, 'W':48, 'X':49,
            'Y':50, 'Z':51, 'a':52, 'b':53, 'c':54, 'd':55, 'e':56, 'f':57, 'g':58, 'h':59, 'i':60, 'j':61, 'k':62, 'l':63, 'm':64, 'n':65, 'o':66,
            'p':67, 'q':68, 'r':69, 's':70, 't':71, 'u':72, 'v':73, 'w':74, 'x':75, 'y':76, 'z':77, '<':78, '>':79, '[':80, ']':81, '{':82, '}':83, 
            '\\':84, '/':85, '`':86, 'á':87, 'ã':88, 'à':89, 'é':90, 'ë':91, 'è':92, 'í':93, 'ó':94, 'õ':95, 'ú':96, 'ù':97, 'ü':98, 'ñ':99, 'Ç':100,
            'ç':101, '¡':102, '¿':103, '©':104, '®':105, '™':106, '·':107, '§':108, '†':109, '‡':110, '‐':111, '‒':112, '¶':113, '÷':114, '°':115, 
            '¤':116, '¢':117, 'ß':118, 'Þ':119, ':':120, ';':121, '^':122, '~':123, '♂':124, '♀':125, '♥':126, '♪':127, '♫':128, '☼':129};
        */
         /*initializes the spritesheet */
        this.spritesheet = new MySpritesheet(scene, "font", this.texture, 16, 16);

        /* initialize shaders is in XMLScene because there is only one shader, no need to be creating one everytime we have a new sprite */
    }
     /**
    * @getCharacterPosition returns the index of character sprite in the font spritesheet grid
    * @param char - character sprite
    */

    getCharacterPosition(char){
        return this.textToIndex[char];
    }

    /**
    * @display function in where the created geomtry will be drawn repetidely for each character
    */

    display(){

        this.scene.translate(-this.text.length/2,-0.5,0);

        this.scene.gl.enable(this.scene.gl.BLEND); // enables blending
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);// defines the blending function



        this.spritesheet.activate();
       
         for (let i of this.text){
                let positionInSprite = this.getCharacterPosition(i); //get character's sprite 

                if(positionInSprite == null) return; //if it not exists

                this.spritesheet.activateCellP(positionInSprite); // pass the shader the offset 
                
                this.retangle.display();//display base geometry
                this.scene.translate(1,0,0); // addind space between letters
         }

         this.scene.setActiveShader(this.scene.defaultShader); //set default shader




        this.scene.gl.disable(this.scene.gl.BLEND);        // disables blending

    }
    
    
}
