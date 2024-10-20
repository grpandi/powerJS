var shape = require('./shape')

class Slides{
    // slide sizes are in DXA
    // - 914400 EMUs is 1 inch

    //Todo
        //Get Slide count
        //Get Slide BG-Color
    constructor(slide=1){
        this.slide=slide
        this.objects={}
        this.layOutObjects={}
        this.layOutRelObjects={}
        this.masterObjects={}
        this.masterRelObjects={}
        this.slideRel = {}
        this.masterShapes = []
        this.slideShapes = []
    }

    getAllSlides(){
        return this.objects
    }

    getSlideCount(){
        return Object.keys(this.objects).length;  
    }

    getSlide(n){
        return this.objects['slide'+n+'.xml']
    }

    getMasterslide(n){
        return this.masterObjects['slideMaster'+n+'.xml']
    }

    getSlideLayout(n){
        let a =  this.slideRel['slide'+n+'.xml.rels']['Relationships']['Relationship']['@_Target']
        let layoutName =  a.split('/')[2]
        return (this.layOutObjects[layoutName])
    }

    getBG(n){
        let bg = {type:'', obj:{}}
        let solidFill = {type:'',clr:'', obj:''}
        let grdFill ={stp:[],clr:[],lin:false,path:[], tileRect:[]}
        let blipFill = {}
        let slide = this.getSlide(n)
        let lSlide = this.getSlideLayout(n)
        let mSlide = this.getMasterslide(n)
        console.log(this.getNested(slide,'p:sld','p:cSld','p:bg'))
        console.log(this.getNested(lSlide,'p:sldLayout','p:cSld','p:bg'))
        console.log(this.getNested(mSlide,'p:sldMaster','p:cSld','p:bg'))
    }

    getColor(){

    }
    
    getMasterShapes(n){
        let layout = this.getMasterslide(n)
        let ShapeTree = layout['p:sldMaster']['p:cSld']['p:spTree']['p:sp']
        for (let sp in ShapeTree){
            let Shape = new shape()
            Shape.shapes = ShapeTree[sp]
            this.masterShapes.push(Shape.getShapeProps())
        }   
        return this.masterShapes

    }

    getLayoutShapes(){}
    getSlideShapes(n){
        let layout = this.getSlide(n)
        // let shapeTree = layout['p:sld']['p:cSld']['p:spTree']['p:sp']
        let shapeTree = this.getNested(layout, 'p:sld','p:cSld','p:spTree','p:sp')
        for (let sp in shapeTree){
            let Shape = new shape()
            Shape.shapes = shapeTree[sp]
            this.slideShapes.push(Shape.getShapeProps())
        }
        let groupTree = this.getNested(layout, 'p:sld','p:cSld','p:spTree','p:grpSp','p:sp')
        for (let sp in groupTree){
            let Shape = new shape()
            Shape.shapes = groupTree[sp]
            this.slideShapes.push(Shape.getShapeProps())
        }

        return this.slideShapes
        

    }


    getNested(obj, ...args) {
        return args.reduce((obj, level) => obj && obj[level], obj)
      }

    
}

module.exports = Slides


