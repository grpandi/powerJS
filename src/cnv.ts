import { Shape } from "./shape";
import { Slide } from "./slide";
import { Fill, Color } from "./style";

export class Cn{
    cnv:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D|null
    widthRatio=1
    heightRatio=1
    widthOffset=0
    heightOffset=0
    aspectRatio = 1
    shape:Shape=new Shape()
    slide:Slide = new Slide()
    
    constructor(cnv:HTMLCanvasElement){
        this.cnv = cnv;
        this.ctx =cnv.getContext("2d")

    }

    set setShape(shape:Shape){
        this.shape=shape
    }

    fill(x:number,y:number,w:number,h:number){
        console.log(x,y,w,h)
        if(this.ctx!=null){
            if(this.shape.fill.getType()=="noFill"){
                this.ctx.globalAlpha = 0
                this.ctx.fill()
            } 
            if(this.shape.fill.getType()=="solidFill"){
                this.ctx.fillStyle=this.shape.fill.getVal()
                this.ctx.globalAlpha = this.shape.fill.alpha;
                this.ctx.fill()
            }
            if(this.shape.fill.getType()=="gradientFill"){
                let val:any = this.shape.fill.getVal()
                let angle = val.linang * Math.PI / 180
                let x2 = w*Math.cos(angle)
                let y2 = h*Math.sin(angle)
                const lineargradient = this.ctx.createLinearGradient(x, y, x2, y2);
                if(val.gradient){
                    for( let grad of val.gradient){
                        console.log(grad.clr)
                        lineargradient.addColorStop(grad.pos/100,grad.clr)
                    }
                }
                this.ctx.fillStyle=lineargradient
                this.ctx.globalAlpha=this.shape.fill.alpha
                this.ctx.fill()
            }
            
            if(this.shape.fill.getType()=="imageFill"){
                let startX = (this.shape.x*this.widthRatio)+this.widthOffset
                let startY = (this.shape.y*this.heightRatio)+this.heightOffset
                let endX = (this.shape.w*this.widthRatio)-this.widthOffset
                let endY = (this.shape.h*this.heightRatio)-this.heightOffset
                let imgId = this.shape.fill.getVal()
                if(this.shape.src=='slide'){
                    let img = new Image()
                    img.crossOrigin = "anonymous"
                    img.onload = () =>{
                        if (this.ctx) {
                            this.ctx.globalAlpha=this.shape.fill.alpha
                            this.ctx.drawImage(img, x, y,w,h-this.heightOffset);
                        }
                    }
                    img.src ="data:image/jpg;base64,"+ this.slide.images[imgId.src]
                }
                
            }
        }
        
    }
    stroke(x:number,y:number,w:number,h:number){
        if(this.ctx!=null){
            if(this.shape.stroke.fill.getType()=="noFill"){
                this.ctx.globalAlpha = 0
                this.ctx.stroke()
            } 
            if(this.shape.stroke.fill.getType()=="solidFill"){
                this.ctx.strokeStyle=this.shape.stroke.fill.getVal()
                this.ctx.globalAlpha = this.shape.fill.alpha;
                this.ctx.stroke()
            }
            if(this.shape.stroke.fill.getType()=="gradientFill"){
                let val = this.shape.stroke.fill.getVal()
                let angle = val.linang * Math.PI / 180
                let x2 = w*Math.cos(angle)
                let y2 = h*Math.sin(angle)
                const lineargradient = this.ctx.createLinearGradient(x, y, x2, y2);
                if(val.gradient){
                    for( let grad of val.gradient){
                        lineargradient.addColorStop(grad.pos/100,grad.clr)
                    }
                }
                this.ctx.strokeStyle=lineargradient
                this.ctx.globalAlpha=this.shape.stroke.fill.alpha
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
        let endX = (this.shape.w*this.widthRatio)-this.widthOffset
        let endY = (this.shape.h*this.heightRatio)-this.heightOffset
        this.ctx?.beginPath()
        this.ctx?.moveTo(startX,startY)
        this.ctx?.lineTo(endX, startY)
        this.ctx?.lineTo(endX, endY)
        this.ctx?.lineTo(startX, endY)
        this.ctx?.closePath()
        this.fill(startX, startY, endX, endY)
        this.stroke(startX, startY, endX, endY)        
    }

    drawSlide(){
        // 1. get Color Map
        let clrMap = this.slide.clrMap
        if(clrMap==null){
            clrMap = this.slide.layout?.clrMap
        }
        if(clrMap==null){
            clrMap = this.slide.layout?.master?.clrMap
        }
           
        // 2. get BG
        let bg = this.slide.getbgObj()
        let src = 'slide'
        if(bg==null){
            bg = this.slide.layout?.getbgObj()
            src = 'layout'
        }
        if(bg==null){
            bg = this.slide.layout?.master?.getbgObj()
            src = 'master'
        }
        let ShpWidth = this.cnv.width/this.widthRatio
        let ShpHeight = this.cnv.height/this.heightRatio
        let BGShape= new Shape(0,0,ShpWidth, ShpHeight)
        BGShape.src = src
        BGShape.stroke.fill.fillType='noFill'
        if(bg['elements'][0]['name'] == 'p:bgPr'){ 
            BGShape.fill=new Fill(bg['elements'][0]['elements'][0], clrMap, this.slide.layout?.master?.theme)
        }
        if(bg['elements'][0]['name'] == 'p:bgRef'){
            // no fill object in bg Object, add color to fill object
            BGShape.fill.fillType="solidFill"
            let clrObj = bg['elements'][0]['elements'][0]
            let color=new Color(clrObj,clrMap,this.slide.layout?.master?.theme)
            BGShape.fill.fillVal =color.getColor()     
        }
        this.shape=BGShape
        this.draw()
    }
    

    
    


}