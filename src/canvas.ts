import { Shape } from "./shape";

export class Canvas{
    cnv:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D|null
    widthRatio=1
    heightRatio=1
    widthOffset=0
    heightOffset=0
    aspectRatio = 1
    shape:Shape=new Shape()
    
    constructor(cnv:HTMLCanvasElement){
        this.cnv = cnv;
        this.ctx =cnv.getContext("2d")        
    }

    set setShape(shape:Shape){
        this.shape=shape
    }

    draw(){
        this.rect()
    }

    rect(){
        let startX = (this.shape.x*this.widthRatio)+this.widthOffset
        let startY = (this.shape.y*this.heightRatio)+this.heightOffset
        let endX = (this.shape.w*this.widthRatio)+this.widthOffset
        let endY = (this.shape.h*this.heightRatio)+this.heightOffset
        this.ctx?.beginPath()
        this.ctx?.moveTo(startX,startY)
        this.ctx?.lineTo(endX, startY)
        this.ctx?.lineTo(endX, endY)
        this.ctx?.lineTo(startX, endY)
        this.ctx?.closePath()
        this.fill()
        this.stroke()
        
    }
    fill(){
        if(this.ctx!=null){
            if(this.shape.fill.type="noFill"){
                this.ctx.fillStyle="#FFFFFF";
                this.ctx.globalAlpha = 0
                this.ctx.fill()
            }

            
        }
    }
    stroke(){

    }

    
    


}