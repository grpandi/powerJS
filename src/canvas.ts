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

    fill(x:number,y:number,w:number,h:number){
        if(this.ctx!=null){
            if(this.shape.fill.type="noFill"){
                this.ctx.globalAlpha = 0
                this.ctx.fill()
            } 
            if(this.shape.fill.type="solidFill"){
                this.ctx.fillStyle=this.shape.fill.val
                this.ctx.globalAlpha = this.shape.fill.alpha;
                this.ctx.fill()
            }
            if(this.shape.fill.type="gradientFill"){
                let angle = this.shape.fill.val.linang * Math.PI / 180
                let x2 = w*Math.cos(angle)
                let y2 = h*Math.sin(angle)
                const lineargradient = this.ctx.createLinearGradient(x, y, x2, y2);
                if(this.shape.fill.val.gradient){
                    for( let grad of this.shape.fill.val.gradient){
                        lineargradient.addColorStop(grad.pos/100,grad.clr)
                    }
                }
                this.ctx.fillStyle=lineargradient
                this.ctx.globalAlpha=this.shape.fill.val
                this.ctx.fill()
            }     
        }
        
    }
    stroke(x:number,y:number,w:number,h:number){
        if(this.ctx!=null){
            if(this.shape.stroke.fill.type="noFill"){
                this.ctx.globalAlpha = 0
                this.ctx.stroke()
            } 
            if(this.shape.stroke.fill.type="solidFill"){
                this.ctx.strokeStyle=this.shape.stroke.fill.val
                this.ctx.globalAlpha = this.shape.fill.alpha;
                this.ctx.stroke()
            }
            if(this.shape.stroke.fill.type="gradientFill"){
                let angle = this.shape.stroke.fill.val.linang * Math.PI / 180
                let x2 = w*Math.cos(angle)
                let y2 = h*Math.sin(angle)
                const lineargradient = this.ctx.createLinearGradient(x, y, x2, y2);
                if(this.shape.stroke.fill.val.gradient){
                    for( let grad of this.shape.stroke.fill.val.gradient){
                        lineargradient.addColorStop(grad.pos/100,grad.clr)
                    }
                }
                this.ctx.strokeStyle=lineargradient
                this.ctx.globalAlpha=this.shape.fill.val
                this.ctx.stroke()
            }     
        }

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
        this.fill(startX, startY, endX, endY)
        this.stroke(startX, startY, endX, endY)        
    }
    

    
    


}