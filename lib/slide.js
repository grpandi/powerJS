var shape = require('./shape')

class Slides{
    // slide sizes are in DXA
    // - 914400 EMUs is 1 inch
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
