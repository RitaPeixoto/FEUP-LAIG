class GameBoard {
    constructor(scene, size) {
        this.scene = scene
        this.size = size
        this.boardBase = new MyCube(this.scene, 1)
        this.border1 = new MyCube(this.scene, 1)
        this.border2 = new MyCube(this.scene, 1)
        this.border3 = new MyCube(this.scene, 1)
        this.border4 = new MyCube(this.scene, 1)
        this.border = (this.size * 1.4 - this.size * 1.15) - 0.25

        this.higher = new Map()

        if (this.size == 4) this.higher = 1.77
        else if (this.size == 5) this.higher = 1.70
        else if (this.size == 6) this.higher = 1.65
        else if (this.size == 7) this.higher = 1.62
        else if (this.size == 8) this.higher = 1.58


    }

    display() {
        this.scene.pushMatrix()
        if (this.size == 4) this.scene.translate(-0.2, 0, 0)
        if (this.size == 6) this.scene.translate(0, 0, 0.2)
        if (this.size == 7) this.scene.translate(0, 0, 0.3)
        if (this.size == 8) this.scene.translate(0, 0, 0.45)
        this.scene.pushMatrix()
        this.scene.translate((this.size) / 2.0 * 1.4 - this.border, -0.3, (this.size / 2.0 * 1.4) - this.border);
        this.scene.scale(this.size * 1.4, 0.2, this.size * 1.4)
        this.boardBase.display()
        this.scene.popMatrix()


        this.scene.pushMatrix()
        this.scene.translate((this.size) / 2.0 * 1.4 - this.border, -0.2, -this.border - 0.5)
        this.scene.scale(this.size * 1.4, 1, 1)
        this.border1.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.translate((this.size) / 2.0 * 1.4 - this.border, -0.2, this.size * 1.4 - this.border)
        this.scene.scale(this.size * 1.4, 1, 1)
        this.border2.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        if (this.size == 4) this.scene.translate(0.4, 0, 0)
        this.scene.translate(-1.5, -0.2, (this.size / 2.0 * 1.4) - this.border - 0.25)
        this.scene.scale(1, 1, this.size * this.higher)
        this.scene.rotate(Math.PI / 2.0, 0, 1, 0)
        this.border3.display()
        this.scene.popMatrix()


        this.scene.pushMatrix()
        if (this.size == 6) this.scene.translate(0.4, 0, 0)
        if (this.size == 7) this.scene.translate(1.0, 0, 0)
        if (this.size == 8) this.scene.translate(1.4, 0, 0)
        this.scene.translate((this.size / 2.0 * 1.4) + 2.5, -0.2, (this.size / 2.0 * 1.4) - this.border - 0.25)
        this.scene.scale(1, 1, this.size * this.higher)
        this.scene.rotate(Math.PI / 2.0, 0, 1, 0)
        this.border4.display()
        this.scene.popMatrix()

        this.scene.popMatrix()
    }

}