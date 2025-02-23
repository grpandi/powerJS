import { Shape } from "./shape";
import { Slide } from "./slide";
import { Fill, Color } from "./style";

export class Cn{
    cnv:HTMLCanvasElement;
    ctx!: CanvasRenderingContext2D;
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
    lines:any = {}
    
    constructor(cnv:HTMLCanvasElement){
        this.cnv = cnv;
        let ctx = cnv.getContext("2d")
        if(ctx!=null){
            this.ctx = ctx
        }

    }

    set setShape(shape:Shape){
        this.shape=shape
        this.lines = {}
        this.getCrd()
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
                this.getCrd()
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
            this.ctx.setLineDash(this.shape.stroke.dash)
            if(this.shape.stroke.fill.getType()=="noFill"){
                this.ctx.globalAlpha = 0
                this.ctx.stroke()
            } 
            if(this.shape.stroke.fill.getType()=="solidFill"){
                this.ctx.strokeStyle=this.shape.stroke.fill.getVal()
                this.ctx.globalAlpha = this.shape.stroke.fill.alpha;
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
            this.getCrd()
            this.rect()
        }
        // this.bg()
        

        for (let sp of this.slide.shapes){
            this.shape = sp
            this.getCrd()
            if(sp.prstGeom=='rect'){
                this.rect()
                this.drawText()
            }
            if(sp.prstGeom=='triangle'){
                this.triangle()
                this.drawText()
            }
            if(sp.prstGeom=='roundRect'){
                this.drawRoundedRect()
                this.drawText()
            }
            if(sp.prstGeom=='ellipse'){
                this.ellipse()
                this.drawText()
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
        this.ctx?.beginPath()
        this.ctx?.moveTo(this.x,this.y)
        this.ctx?.lineTo(this.cx, this.y)
        this.ctx?.lineTo(this.cx, this.cy)
        this.ctx?.lineTo(this.x, this.cy)
        this.ctx?.closePath()
        this.fill()
        this.stroke()       
    }

    drawRoundedRect() {
        let radRatio = 1
        if(this.shape.guide.length>0){
            if(this.shape.guide[0].name == 'adj'){
                let fmla = this.shape.guide[0].fmla
                if(fmla.includes('val')){
                    radRatio = parseInt(fmla.split(' ')[1])/100000
                }
            }            
        }
        let height = this.cy-this.y
        let width = this.cx-this.x
        let radius = Math.floor(Math.min(height,width)*radRatio)
        this.ctx?.beginPath();
        // Top left corner
        this.ctx?.moveTo(this.x + radius, this.y);
        // Top edge and top right corner
        this.ctx?.arcTo(this.x +width, this.y, this.x + width, this.y + height, radius);
        // Right edge and bottom right corner
        this.ctx?.arcTo(this.x + width, this.y + height, this.x, this.y + height, radius);
        // Bottom edge and bottom left corner
        this.ctx?.arcTo(this.x, this.y + height, this.x, this.y, radius);
        // Left edge and top left corner
        this.ctx?.arcTo(this.x, this.y, this.x + width, this.y, radius);
        this.ctx?.closePath();
        this.fill()
        this.stroke()
      }

    triangle(){
        let pos:any = 0.5
        if(this.shape.guide.length>0){
            if(this.shape.guide[0].name == 'adj'){
                let fmla = this.shape.guide[0].fmla
                if(fmla.includes('val')){
                    pos = parseInt(fmla.split(' ')[1])/100000
                }
            }            
        }
        let x2 = this.x + ((this.cx-this.x)*pos)
        this.ctx?.beginPath();
        this.ctx?.moveTo(this.x, this.cy); // Move to the first vertex
        this.ctx?.lineTo(x2, this.y); // Draw a line to the second vertex
        this.ctx?.lineTo(this.cx, this.cy); // Draw a line to the third vertex
        this.ctx?.closePath();    // Close the path to complete the triangle
        this.fill()
        this.stroke()
    }

    ellipse(){
        const radiusX = (this.cx-this.x)/2; // Horizontal radius
        const radiusY = (this.cy-this.y)/2;  // Vertical radius
        const centerX = this.x +radiusX; // X coordinate of the center
        const centerY = this.y + radiusY; // Y coordinate of the center
        const rotation = 0;  // Rotation in radians (0 for no rotation)
        const startAngle = 0; // Start angle in radians
        const endAngle = 2 * Math.PI; // End angle in radians (full ellipse)
        const anticlockwise = false; // Direction of drawing (false for clockwise)

        // Draw the ellipse
        this.ctx?.beginPath();
        this.ctx?.ellipse(centerX, centerY, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
        this.ctx?.closePath();
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
    

    // Text functions
    drawText(){
        // get base xy for each Paragraph
            // get textLines
            this.getCrd()
            this.lines = {}
            // measure text height
            for (let pg in this.shape.paragraph){
                let txtrun:any = this.shape.paragraph[pg].txtRun
                let row = Object.keys(this.lines).length
                Object.assign(this.lines, {[row]: ["",0]})
                for (let tr in txtrun){
                    row = Object.keys(this.lines).length
                    let txt:any = this.lines[row-1][0]+txtrun[tr]['txt']

                    // get font size
                    let fontSize = txtrun[tr]['size']
                    if(fontSize==0){fontSize=this.defaultFontsz(this.shape.phType)}
                    fontSize= fontSize * 1.3333
                    fontSize = Math.round(fontSize*this.heightRatio)
                    let font = txtrun[tr]['font']
                    if(font==""){font ="Calibri"}
                    let fontFrmt = ""
                    if(txtrun[tr]['bold']){fontFrmt+="bold "}
                    if(txtrun[tr]['italic']){fontFrmt+="italic "}
                    this.ctx.font =fontFrmt + `${fontSize}px ${font}`;
                    this.wrapText(txt, fontSize)
                }
            }

            let txtHeight = 0
            for(let ln in this.lines){txtHeight += this.lines[ln][1]}



            // draw text by each runs
            let ln = 0
            let xpos = 0
            let pos = this.getBaseTextPosition(this.lines[ln][1], this.lines[ln][0])
            let fontszadj = this.lines[ln][1]/2
            let ypos = pos.y-(txtHeight/2)+fontszadj
            for (let pg in this.shape.paragraph){
                let preTxt = ""
                if(parseInt(pg)>0){
                    ypos += this.lines[ln][1]
                    ln += 1
                    xpos = 0
                }

                let txtrun:any = this.shape.paragraph[pg].txtRun
                for (let tr in txtrun){
                    let txt = txtrun[tr]['txt']
                    let fontSize = txtrun[tr]['size']
                    if(fontSize==0){fontSize=this.defaultFontsz(this.shape.phType)}
                    fontSize= fontSize * 1.3333
                    fontSize = Math.round(fontSize*this.heightRatio)
                    let font = txtrun[tr]['font']
                    if(font==""){font ="Calibri"}
                    let fontFrmt = ""
                    if(txtrun[tr]['bold']){fontFrmt+="bold "}
                    if(txtrun[tr]['italic']){fontFrmt+="italic "}
                    this.ctx.font =fontFrmt + `${fontSize}px ${font}`;

                    // get font fill
                    let fill = txtrun[tr]['fill']
                    if(fill==undefined){fill=this.shape.fontFill}
                    this.ctx.fillStyle = fill.getVal()
                    this.ctx.globalAlpha = fill.alpha
                    // this.ctx.fillStyle = "#000000"

                    // get font align   
                    // this.ctx.fillText(txt, Math.round(xpos), Math.round(ypos));
                    const words = txt.split(" ");
                    for (let i = 0; i < words.length; i++) {
                        if(preTxt!=""){
                            let ntxt = preTxt + words[i]
                            let currentLineWidth = xpos + this.ctx.measureText(words[i]).width
                            if((currentLineWidth) > (this.cx)){
                                ypos += this.lines[ln][1]
                                ln += 1
                                xpos = 0
                                preTxt = ""
                            }
                        }
                        // get xpos
                        if(xpos==0){
                            let pos = this.getBaseTextPosition(this.lines[ln][1], this.lines[ln][0])
                            xpos = pos.x
                        }                        
                        const word = words[i]+" ";
                        this.ctx.fillText(word, Math.round(xpos), Math.round(ypos));
                        preTxt += word
                        let wordWidth = this.ctx.measureText(word).width;
                        let nxtWordWidth = this.ctx.measureText(words[i+1]).width;
                        let currentLineWidth = 0
                        if(words[i+1]!=undefined){currentLineWidth=xpos+wordWidth+nxtWordWidth}
                        xpos += wordWidth;                        
                    }

                }

            }
            
            
            // let lineHeight = 0
            // for(let ln in this.lines){
            //     let pos = this.getBaseTextPosition(this.lines[ln][1], this.lines[ln][0])
            //     this.ctx.fillStyle = "#ffffff"
            //     this.ctx.fillText(this.lines[ln][0], Math.round(pos.x), Math.round(pos.y-(txtHeight/2)+lineHeight+(this.lines[ln][1]/2)));
            //     lineHeight += this.lines[ln][1]
            // }




        // adjust xy for each line in paragraph
            

        // draw each line
    }

    defaultFontsz(type:string){
        let sz;
        switch (type) {
            case "text": // Top alignment
                sz = 18
                break;
            case "title": // Center alignment
                sz = 44
              break;
            case "ctrTitle": // Center alignment
              sz = 60
            break;
            default:
              sz = 18
          }
          return sz
    }

    // Function to wrap text
    wrapText(text:string, fontSize:any) {
        const words = text.split(" ");
        let currentLine = words[0];
        let maxWidth = (this.cx-this.x)*1;
        let row = Object.keys(this.lines).length
        let lineHeight = this.lines[row-1][1]
        if(fontSize>lineHeight){lineHeight=fontSize}
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const testLine = currentLine + " " + word;
            const metrics:any = this.ctx?.measureText(testLine);
            if (metrics.width <= maxWidth) {
                currentLine = testLine;
            } else {
                Object.assign(this.lines, {[row-1]: [currentLine,lineHeight]})
                row += 1
                currentLine = word;
            }
        }
        Object.assign(this.lines, {[row-1]: [currentLine,lineHeight]})
    }

    // Function to draw textruns

  // Function to adjust font size
  adjustFontSize(text:string, maxHeight:number, initialFontSize:number, fontFamily:string, lineHeightMultiplier:number) 
    {
        let fontSize = initialFontSize;
        let lines:any = [];
        let lineHeight = 0;

        while (fontSize > 0) {
        this.ctx.font = `${fontSize}px ${fontFamily}`;
        lineHeight = fontSize * lineHeightMultiplier;
        lines = this.wrapText( text, fontSize);

        const totalHeight = lines.length * lineHeight;
        if (totalHeight <= maxHeight) {
            break;
        }

        fontSize--;
        }

        return { fontSize, lines, lineHeight };
    }

    getBaseTextPosition(fontSize:number, text:string) {
      
        // Measure the text width
        const textWidth = this.ctx.measureText(text).width;
      
        // Calculate the x position based on horizontal alignment (assume center)
        const x = this.x + ((this.cx-this.x) / 2)-(textWidth/2); // Center alignment
      
        // Calculate the y position based on vertical alignment
        let y;
        let shapeHeight = this.cy-this.y;
        switch (this.shape.txtAnchor) {
          case "t": // Top alignment
            y = this.y + fontSize; // Add font size to avoid clipping
            break;
          case "ctr": // Center alignment
            y = this.y + shapeHeight / 2 + fontSize / 2; // Vertical center
            break;
          case "b": // Bottom alignment
            y = this.y + shapeHeight - fontSize / 2; // Bottom edge
            break;
          default:
            y = this.y + fontSize; // Default to top alignment
        }
      
        return { x, y };
    }

    textUnderline (text:string, x:number, y:number, fontSize:number, color:string) {
        // Get the width of the text
        let textWidth = this.ctx.measureText(text).width;
    
        // var to store the starting position of text (X-axis)
        var startX;
    
        // var to store the starting position of text (Y-axis)
        // I have tried to set the position of the underline according
        // to size of text. You can change as per your need
        var startY = y + fontSize / 10;
    
        // var to store the end position of text (X-axis)
        var endX;
    
        // var to store the end position of text (Y-axis)
        // It should be the same as start position vertically.
        var endY = startY;
    
        // To set the size line which is to be drawn as underline.
        // Its set as per the size of the text. Feel free to change as per need.
        var underlineHeight = fontSize / 15;
    
        // Because of the above calculation we might get the value less
        // than 1 and then the underline will not be rendered. this is to make sure
        // there is some value for line width.
        if (underlineHeight < 1) {
            underlineHeight = 1;
        }
    
        this.ctx.beginPath();
    
        // calculating startX and endX values
        startX = x;
        endX = x + textWidth;
    
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = underlineHeight;
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
    };

  

    
    


}