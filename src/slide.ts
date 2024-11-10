import {getNested} from './util'
import {Shape} from './shape'
import {Pjs} from './power'

export class Slide  {
    // slide sizes are in DXA
    // - 914400 EMUs is 1 inch
     slidenr:number = 1
    protected _slideObj:any ={}
    protected _slideM:any = {}
    protected _slideL:any={}
    protected _masterShapes:any = []
    protected _slideShapes:any=[]
    constructor(n?:number){
        if (typeof(n)!='undefined'){
            this.slidenr=n
        }        
    }

    getSlideLayoutName(slideRel:any, slideNr:number){
        let slr =  slideRel['slide'+slideNr+'.xml.rels']['Relationships']['Relationship']['@_Target']
        let layoutName =  slr.split('/')[2]
        return layoutName
    }
    getMasterLayoutName(slideLayoutRel:any, slideNr:number){
        // let smr =  slideLayoutRel['Relationships']['Relationship']['@_Target']
        let smr =  slideLayoutRel['slideLayout'+slideNr+'.xml.rels']['Relationships']['Relationship']['@_Target']
        let masterName =  smr.split('/')[2]
        return masterName
        // return (this._slideMasters[masterName])
    }

    getMasterShapes(slideMasters:object, n:number){
        let layout = getNested(slideMasters,'slideMaster'+n+'.xml')
        let ShapeTree = layout['p:sldMaster']['p:cSld']['p:spTree']['p:sp']
        for (let sp in ShapeTree){
            let shape = new Shape()
            shape._shapes = ShapeTree[sp]
            this._masterShapes.push(shape.getShapeProps())
        }   
        return this._masterShapes

    }

    getLayoutShapes(){}
    getSlideShapes(slides:object,n:number){
        let layout = getNested(slides,'slide'+n+'.xml')
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

    


}



