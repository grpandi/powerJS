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
    x=0
    y=0
    cx=0
    cy=0
    
    constructor(cnv:HTMLCanvasElement){
        this.cnv = cnv;
        this.ctx =cnv.getContext("2d")

    }

    set setShape(shape:Shape){
        this.shape=shape
    }

    fill(){
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
                let x2 = this.cx*Math.cos(angle)
                let y2 = this.cy*Math.sin(angle)
                const lineargradient = this.ctx.createLinearGradient(this.x, this.y, x2, y2);
                if(val.gradient){
                    for( let grad of val.gradient){
                        lineargradient.addColorStop(grad.pos/100,grad.clr)
                    }
                }
                this.ctx.fillStyle=lineargradient
                this.ctx.globalAlpha=this.shape.fill.alpha
                this.ctx.fill()
            }
            
            if(this.shape.fill.getType()=="imageFill"){
                this.getCrd()
                let imgId = this.shape.fill.getVal()
                if(this.shape.src=='slide'){
                    let img = new Image()
                    img.crossOrigin = "anonymous"
                    img.onload = () =>{
                        if (this.ctx) {
                            this.ctx.globalAlpha=this.shape.fill.alpha
                            this.ctx.drawImage(img, this.x, this.y,this.cx,this.cy);
                        }
                    }
                    img.src ="data:image/jpg;base64,"+ this.slide.images[imgId.src]
                }
                
            }
        }
        
    }
    stroke(){
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
                let x2 = this.cx*Math.cos(angle)
                let y2 = this.cy*Math.sin(angle)
                const lineargradient = this.ctx.createLinearGradient(this.x, this.y, x2, y2);
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
        // drawBG
        if (this.slide.bgShp!=null){
            this.shape = this.slide.bgShp
        }
        // this.bg()
        this.rect()

        // let sp = this.slide.getShapeById("5")
        // if(sp !=undefined){
        //     this.shape = sp
        //     this.rect()
        // }
        // let sp = this.slide.getShapeByName("Rectangle 4")
        // console.log(sp)
        // if(sp !=undefined){
        //     this.shape = sp
        //     this.rect()
        // }

        for (let sp of this.slide.shapes){
            this.shape = sp
            if(sp.prstGeom=='rect'){
                this.rect()
            }
            if(sp.prstGeom=='triangle'){
                this.triangle()
            }
            
        }
    }

    
    
    getCrd(){
        this.x =  Math.floor((this.shape.x*this.widthRatio)+this.widthOffset)
        this.y =  Math.floor((this.shape.y*this.heightRatio)+this.heightOffset)
        this.cx =  this.x + Math.floor((this.shape.w*this.widthRatio))
        this.cy = this.y + Math.floor((this.shape.h*this.heightRatio))
    }

    rect(){
        this.getCrd()
        this.ctx?.beginPath()
        this.ctx?.moveTo(this.x,this.y)
        this.ctx?.lineTo(this.cx, this.y)
        this.ctx?.lineTo(this.cx, this.cy)
        this.ctx?.lineTo(this.x, this.cy)
        this.ctx?.closePath()
        this.fill()
        this.stroke()       
    }

    triangle(){
        this.getCrd()
        let pos:any = 0.5
        if(this.shape.guide.length>0){
            if(this.shape.guide[0].name == 'adj'){
                let fmla = this.shape.guide[0].fmla
                if(fmla.includes('val')){
                    pos = parseInt(fmla.split(' ')[1])/100000
                }
            }
            
        }
        console.log(pos)
        let x2 = this.x + ((this.cx-this.x)*pos)
        this.ctx?.beginPath();
        this.ctx?.moveTo(this.x, this.cy); // Move to the first vertex
        this.ctx?.lineTo(x2, this.y); // Draw a line to the second vertex
        this.ctx?.lineTo(this.cx, this.cy); // Draw a line to the third vertex
        this.ctx?.closePath();    // Close the path to complete the triangle
        this.fill()
        this.stroke()
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