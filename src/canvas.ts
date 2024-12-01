
export class Canvas{
    cnv:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D|null
    widthRatio=1
    heightRatio=1
    widthOffset=0
    heightOffset=0
    aspectRatio = 1
    
    constructor(cnv:HTMLCanvasElement){
        this.cnv = cnv;
        this.ctx =cnv.getContext("2d")        
    }


    rect(x:number, y:number, cx:number, cy:number){
        this.ctx?.beginPath()
        let startX = (x*this.widthRatio)+this.widthOffset
        let startY = (y*this.heightRatio)+this.heightOffset
        let endX = (cx*this.widthRatio)+this.widthOffset
        let endY = (cy*this.heightRatio)+this.heightOffset
        this.ctx?.rect(startX,startY,endX,endY)
    }
    fill(clr:object){
        
    }

    
    


}