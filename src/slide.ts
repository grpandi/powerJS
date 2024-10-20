import {getNested} from './util'
import {Shape} from './shape'
import { inherits } from 'util'

export class Slide {
    // slide sizes are in DXA
    // - 914400 EMUs is 1 inch
     _slide:number = 1
    _slideObjects:any = new Map()
    _layoutObjects:any ={}
    _masterObjects:any = {}
    _slideRel:any = {}
    _masterShapes:any = []
    _slideShapes:any=[]
    constructor(n?:number){
        if (typeof(n)!='undefined'){
            this._slide=n
        }        
    }

    getAllSlides(){
        return this._slideObjects
    }
    getSlide(n:number){
        return this._slideObjects['slide'+n+'.xml']
    }

    getMasterslide(n:number){
        return this._masterObjects['slideMaster'+n+'.xml']
    }

    getSlideLayout(n:number){
        let a =  this._slideRel['slide'+n+'.xml.rels']['Relationships']['Relationship']['@_Target']
        let layoutName =  a.split('/')[2]
        return (this._layoutObjects[layoutName])
    }
    
    getMasterShapes(n:number){
        let layout = this.getMasterslide(n)
        let ShapeTree = layout['p:sldMaster']['p:cSld']['p:spTree']['p:sp']
        for (let sp in ShapeTree){
            let shape = new Shape()
            shape._shapes = ShapeTree[sp]
            this._masterShapes.push(shape.getShapeProps())
        }   
        return this._masterShapes

    }

    getLayoutShapes(){}
    getSlideShapes(n:number){
        let layout = this.getSlide(n)
        // let shapeTree = layout['p:sld']['p:cSld']['p:spTree']['p:sp']
        let shapeTree = getNested(layout, 'p:sld','p:cSld','p:spTree','p:sp')
        for (let sp in shapeTree){
            let shape = new Shape()
            shape._shapes = shapeTree[sp]
            this._slideShapes.push(shape.getShapeProps())
        }
        let groupTree = getNested(layout, 'p:sld','p:cSld','p:spTree','p:grpSp','p:sp')
        for (let sp in groupTree){
            let shape = new Shape()
            shape._shapes = groupTree[sp]
            this._slideShapes.push(shape.getShapeProps())
        }

        return this._slideShapes
        

    }

    getBackground(){
        // 1. get bg object from slide or slide layout or slide master
        // 2. check bg props or bg ref
        // 3. get bg type
        // 4. get bg props
    }


}

