
class Shapes{
    // slide sizes are in DXA
    // - 914400 EMUs is 1 inch
    
    constructor(){
        this.shapeProps = {}
        this.cordinates = [0,0,0,0]
    }

    getShapeProps(){
        // console.log(this.shapeProps)
        this.id=this.shapeProps['p:nvSpPr']['p:cNvPr']['@_id']
        this.name=this.shapeProps['p:nvSpPr']['p:cNvPr']['@_name']
        this.cordinates[0]=this.shapeProps['p:spPr']['a:xfrm']['a:off']['@_x']
        this.cordinates[1]=this.shapeProps['p:spPr']['a:xfrm']['a:off']['@_y']
        this.cordinates[2]=this.shapeProps['p:spPr']['a:xfrm']['a:ext']['@_cx']
        this.cordinates[3]=this.shapeProps['p:spPr']['a:xfrm']['a:ext']['@_cy']
        console.log(this.cordinates)
    }

}

module.exports = Shapes